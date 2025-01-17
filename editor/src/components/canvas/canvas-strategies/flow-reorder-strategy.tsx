import { MetadataUtils } from '../../../core/model/element-metadata-utils'
import * as EP from '../../../core/shared/element-path'
import { offsetPoint } from '../../../core/shared/math-utils'
import { CSSCursor } from '../canvas-types'
import { reorderElement } from '../commands/reorder-element-command'
import { setCursorCommand } from '../commands/set-cursor-command'
import { setElementsToRerenderCommand } from '../commands/set-elements-to-rerender-command'
import { updateHighlightedViews } from '../commands/update-highlighted-views-command'
import { ParentBounds } from '../controls/parent-bounds'
import { ParentOutlines } from '../controls/parent-outlines'
import {
  CanvasStrategy,
  emptyStrategyApplicationResult,
  getTargetPathsFromInteractionTarget,
  InteractionCanvasState,
  strategyApplicationResult,
  StrategyApplicationResult,
} from './canvas-strategy-types'
import { absolute } from '../../../utils/utils'
import { InteractionSession, StrategyState } from './interaction-state'
import { ElementInstanceMetadataMap } from '../../../core/shared/element-template'
import { getFlowReorderIndex, getOptionalDisplayPropCommands } from './flow-reorder-helpers'
import {
  FlowReorderAreaIndicator,
  FlowReorderDragOutline,
} from '../controls/flow-reorder-indicators'
import { AllElementProps } from '../../editor/store/editor-state'
import { isGeneratedElement } from './reparent-helpers'
import { isReorderAllowed } from './reorder-utils'

function isFlowReorderConversionApplicable(
  canvasState: InteractionCanvasState,
  interactionSession: InteractionSession | null,
  metadata: ElementInstanceMetadataMap,
  allElementProps: AllElementProps,
  displayTypeFiltering: 'no-filter' | 'requires-mixed-display-type' = 'requires-mixed-display-type',
): boolean {
  const selectedElements = getTargetPathsFromInteractionTarget(canvasState.interactionTarget)
  if (selectedElements.length === 1) {
    const target = selectedElements[0]
    const elementMetadata = MetadataUtils.findElementByElementPath(metadata, target)
    const siblings = MetadataUtils.getSiblings(metadata, target)
    if (siblings.length > 1 && MetadataUtils.isPositionedByFlow(elementMetadata)) {
      // Strategies that might convert while reordering between 'block' and 'inline-block' are shown only if there is a possibilty of conversion
      if (displayTypeFiltering === 'requires-mixed-display-type') {
        const targetDisplayType = elementMetadata?.specialSizeMeasurements.display
        return siblings.some(
          (sibling) =>
            MetadataUtils.isPositionedByFlow(sibling) &&
            sibling.specialSizeMeasurements.display !== targetDisplayType,
        )
      } else {
        return true
      }
    } else {
      return false
    }
  } else {
    return false
  }
}

function flowReorderApplyCommon(
  canvasState: InteractionCanvasState,
  interactionState: InteractionSession,
  strategyState: StrategyState,
  withAutoConversion: 'with-auto-conversion' | 'no-conversion',
  displayTypeFiltering: 'allow-mixed-display-type' | 'same-display-type-only',
): StrategyApplicationResult {
  if (interactionState.interactionData.type !== 'DRAG') {
    return emptyStrategyApplicationResult
  }

  if (interactionState.interactionData.drag != null) {
    const selectedElements = getTargetPathsFromInteractionTarget(canvasState.interactionTarget)
    const target = selectedElements[0] // TODO MULTISELECT??

    const siblingsOfTarget = MetadataUtils.getSiblings(strategyState.startingMetadata, target).map(
      (element) => element.elementPath,
    )

    if (!isReorderAllowed(siblingsOfTarget)) {
      return strategyApplicationResult(
        [setCursorCommand('mid-interaction', CSSCursor.NotPermitted)],
        {},
        'failure',
      )
    }

    const rawPointOnCanvas = offsetPoint(
      interactionState.interactionData.dragStart,
      interactionState.interactionData.drag,
    )

    const unpatchedIndex = siblingsOfTarget.findIndex((sibling) => EP.pathsEqual(sibling, target))
    const lastReorderIdx = strategyState.customStrategyState.lastReorderIdx ?? unpatchedIndex

    const reorderResult = getFlowReorderIndex(
      strategyState.startingMetadata,
      siblingsOfTarget,
      rawPointOnCanvas,
      target,
      interactionState.latestAllElementProps,
      displayTypeFiltering,
    )

    const { newIndex, newDisplayType } = reorderResult

    const realNewIndex = newIndex > -1 ? newIndex : lastReorderIdx

    if (realNewIndex === unpatchedIndex) {
      return strategyApplicationResult(
        [
          setElementsToRerenderCommand(siblingsOfTarget),
          updateHighlightedViews('mid-interaction', []),
          setCursorCommand('mid-interaction', CSSCursor.Move),
        ],
        {
          lastReorderIdx: realNewIndex,
        },
      )
    } else {
      return strategyApplicationResult(
        [
          reorderElement('always', target, absolute(realNewIndex)),
          setElementsToRerenderCommand(siblingsOfTarget),
          updateHighlightedViews('mid-interaction', []),
          setCursorCommand('mid-interaction', CSSCursor.Move),
          ...getOptionalDisplayPropCommands(target, newDisplayType, withAutoConversion),
        ],
        {
          lastReorderIdx: realNewIndex,
        },
      )
    }
  } else {
    // Fallback for when the checks above are not satisfied.
    return strategyApplicationResult([setCursorCommand('mid-interaction', CSSCursor.Move)])
  }
}

export const flowReorderAutoConversionStrategy: CanvasStrategy = {
  id: 'FLOW_REORDER_AUTO_CONVERSION',
  name: 'Reorder (Flow, Auto)',
  isApplicable: isFlowReorderConversionApplicable,
  controlsToRender: [
    {
      control: ParentOutlines,
      key: 'parent-outlines-control',
      show: 'visible-only-while-active',
    },
    {
      control: ParentBounds,
      key: 'parent-bounds-control',
      show: 'visible-only-while-active',
    },
    {
      control: FlowReorderDragOutline,
      key: 'flow-reorder-drag-outline',
      show: 'visible-only-while-active',
    },
  ], // Uses existing hooks in select-mode-hooks.tsx
  fitness: (canvasState, interactionState, strategyState) => {
    return flowReorderAutoConversionStrategy.isApplicable(
      canvasState,
      interactionState,
      strategyState.startingMetadata,
      strategyState.startingAllElementProps,
    ) &&
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.activeControl.type === 'BOUNDING_AREA'
      ? 3
      : 0
  },
  apply: (canvasState, interactionState, strategyState) => {
    return flowReorderApplyCommon(
      canvasState,
      interactionState,
      strategyState,
      'with-auto-conversion',
      'allow-mixed-display-type',
    )
  },
}

export const flowReorderNoConversionStrategy: CanvasStrategy = {
  id: 'FLOW_REORDER_NO_CONVERSION',
  name: 'Reorder (Flow)',
  isApplicable: isFlowReorderConversionApplicable,
  controlsToRender: flowReorderAutoConversionStrategy.controlsToRender,
  fitness: (canvasState, interactionState, strategyState) => {
    return flowReorderNoConversionStrategy.isApplicable(
      canvasState,
      interactionState,
      strategyState.startingMetadata,
      strategyState.startingAllElementProps,
    ) &&
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.activeControl.type === 'BOUNDING_AREA'
      ? 2
      : 0
  },
  apply: (canvasState, interactionState, strategyState) => {
    return flowReorderApplyCommon(
      canvasState,
      interactionState,
      strategyState,
      'no-conversion',
      'allow-mixed-display-type',
    )
  },
}

export const flowReorderSameTypeOnlyStrategy: CanvasStrategy = {
  id: 'FLOW_REORDER_SAME_TYPE_ONLY',
  name: 'Reorder (Same)',
  isApplicable: (canvasState, interactionState, strategyState, allElementProps) => {
    return isFlowReorderConversionApplicable(
      canvasState,
      interactionState,
      strategyState,
      allElementProps,
      'no-filter',
    )
  },
  controlsToRender: [
    ...flowReorderAutoConversionStrategy.controlsToRender,
    {
      control: FlowReorderAreaIndicator,
      key: 'flow-reorder-area-indicator',
      show: 'visible-only-while-active',
    },
  ],
  fitness: (canvasState, interactionState, strategyState) => {
    return flowReorderSameTypeOnlyStrategy.isApplicable(
      canvasState,
      interactionState,
      strategyState.startingMetadata,
      strategyState.startingAllElementProps,
    ) &&
      interactionState.interactionData.type === 'DRAG' &&
      interactionState.activeControl.type === 'BOUNDING_AREA'
      ? 1
      : 0
  },
  apply: (canvasState, interactionState, strategyState) => {
    return flowReorderApplyCommon(
      canvasState,
      interactionState,
      strategyState,
      'no-conversion',
      'same-display-type-only',
    )
  },
}
