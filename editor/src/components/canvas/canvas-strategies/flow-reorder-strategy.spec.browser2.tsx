import {
  EditorRenderResult,
  getPrintedUiJsCode,
  makeTestProjectCodeWithSnippet,
  renderTestEditorWithCode,
} from '../ui-jsx.test-utils'
import { act, fireEvent } from '@testing-library/react'
import { CanvasControlsContainerID } from '../controls/new-canvas-controls'
import { offsetPoint, windowPoint, WindowPoint } from '../../../core/shared/math-utils'
import { emptyModifiers, Modifiers } from '../../../utils/modifiers'
import * as EP from '../../../core/shared/element-path'

const TestProject = `
<div style={{ width: '100%', height: '100%', position: 'absolute' }} data-uid='container'>
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#CA1E4C80',
    }}
    data-uid='aaa'
    data-testid='aaa'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#297374',
    }}
    data-uid='bbb'
    data-testid='bbb'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#292E74',
    }}
    data-uid='ccc'
    data-testid='ccc'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#D9DDAA80',
      display: 'inline-block',
    }}
    data-uid='ddd'
    data-testid='ddd'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#DDAAB880',
      display: 'inline-block',
    }}
    data-uid='eee'
    data-testid='eee'
  />
</div>
`

const TestProjectCCCDraggedToSecond = `
<div style={{ width: '100%', height: '100%', position: 'absolute' }} data-uid='container'>
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#CA1E4C80',
    }}
    data-uid='aaa'
    data-testid='aaa'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#292E74',
    }}
    data-uid='ccc'
    data-testid='ccc'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#297374',
    }}
    data-uid='bbb'
    data-testid='bbb'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#D9DDAA80',
      display: 'inline-block',
    }}
    data-uid='ddd'
    data-testid='ddd'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#DDAAB880',
      display: 'inline-block',
    }}
    data-uid='eee'
    data-testid='eee'
  />
</div>
`

const TestProjectCCCInlineBlock = `
<div style={{ width: '100%', height: '100%', position: 'absolute' }} data-uid='container'>
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#CA1E4C80',
    }}
    data-uid='aaa'
    data-testid='aaa'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#297374',
    }}
    data-uid='bbb'
    data-testid='bbb'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#D9DDAA80',
      display: 'inline-block',
    }}
    data-uid='ddd'
    data-testid='ddd'
  />
  <div
    style={{
      width: 50,
      height: 50,
      backgroundColor: '#292E74',
      display: 'inline-block',
    }}
    data-uid='ccc'
    data-testid='ccc'
  />
  <div
    style={{
      height: 80,
      width: 80,
      backgroundColor: '#DDAAB880',
      display: 'inline-block',
    }}
    data-uid='eee'
    data-testid='eee'
  />
</div>
`

function dragElement(
  renderResult: EditorRenderResult,
  targetTestId: string,
  dragDelta: WindowPoint,
  modifiers: Modifiers,
  expectedNavigatorTargetsDuringMove: Array<string>,
): void {
  const targetElement = renderResult.renderedDOM.getByTestId(targetTestId)
  const targetElementBounds = targetElement.getBoundingClientRect()
  const canvasControl = renderResult.renderedDOM.getByTestId(CanvasControlsContainerID)

  const startPoint = windowPoint({ x: targetElementBounds.x + 5, y: targetElementBounds.y + 5 })
  const endPoint = offsetPoint(startPoint, dragDelta)
  fireEvent(
    canvasControl,
    new MouseEvent('mousedown', {
      bubbles: true,
      cancelable: true,
      metaKey: true,
      altKey: modifiers.alt,
      shiftKey: modifiers.shift,
      clientX: startPoint.x,
      clientY: startPoint.y,
      buttons: 1,
    }),
  )

  fireEvent(
    canvasControl,
    new MouseEvent('mousemove', {
      bubbles: true,
      cancelable: true,
      metaKey: modifiers.cmd,
      altKey: modifiers.alt,
      shiftKey: modifiers.shift,
      clientX: endPoint.x,
      clientY: endPoint.y,
      buttons: 1,
    }),
  )

  expect(renderResult.getEditorState().derived.visibleNavigatorTargets.map(EP.toString)).toEqual(
    expectedNavigatorTargetsDuringMove,
  )

  fireEvent(
    window,
    new MouseEvent('mouseup', {
      bubbles: true,
      cancelable: true,
      metaKey: modifiers.cmd,
      altKey: modifiers.alt,
      shiftKey: modifiers.shift,
      clientX: endPoint.x,
      clientY: endPoint.y,
    }),
  )
}

describe('Flow Reorder Strategy (Mixed Display Type)', () => {
  it('simple dragging the element in a block reorders it', async () => {
    const renderResult = await renderTestEditorWithCode(
      makeTestProjectCodeWithSnippet(TestProject),
      'await-first-dom-report',
    )

    // drag element 'CCC' up a little to replace it with it's direct sibling
    const dragDelta = windowPoint({ x: 0, y: -45 })
    act(() =>
      dragElement(renderResult, 'ccc', dragDelta, emptyModifiers, [
        'utopia-storyboard-uid/scene-aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity',
        'utopia-storyboard-uid/scene-aaa/app-entity:container',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ccc',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/bbb',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ddd',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/eee',
      ]),
    )

    await renderResult.getDispatchFollowUpActionsFinished()
    expect(getPrintedUiJsCode(renderResult.getEditorState())).toEqual(
      makeTestProjectCodeWithSnippet(TestProjectCCCDraggedToSecond),
    )
  })
  it('dragging a block element over an inline row will insert into it with conversion', async () => {
    const renderResult = await renderTestEditorWithCode(
      makeTestProjectCodeWithSnippet(TestProject),
      'await-first-dom-report',
    )

    // drag element 'CCC' right to insert into the row
    const dragDelta = windowPoint({ x: 120, y: 0 })
    act(() =>
      dragElement(renderResult, 'ccc', dragDelta, emptyModifiers, [
        'utopia-storyboard-uid/scene-aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity',
        'utopia-storyboard-uid/scene-aaa/app-entity:container',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/bbb',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ddd',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ccc',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/eee',
      ]),
    )

    await renderResult.getDispatchFollowUpActionsFinished()

    expect(getPrintedUiJsCode(renderResult.getEditorState())).toEqual(
      makeTestProjectCodeWithSnippet(TestProjectCCCInlineBlock),
    )
  })
  it('dragging an inline element over a block column will insert into it with conversion and removes the default display prop', async () => {
    const renderResult = await renderTestEditorWithCode(
      makeTestProjectCodeWithSnippet(TestProjectCCCInlineBlock),
      'await-first-dom-report',
    )

    // drag element 'CCC' up to pull out of the row and insert into block
    const dragDelta = windowPoint({ x: 0, y: -100 })
    act(() =>
      dragElement(renderResult, 'ccc', dragDelta, emptyModifiers, [
        'utopia-storyboard-uid/scene-aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity',
        'utopia-storyboard-uid/scene-aaa/app-entity:container',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/aaa',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ccc',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/bbb',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/ddd',
        'utopia-storyboard-uid/scene-aaa/app-entity:container/eee',
      ]),
    )

    await renderResult.getDispatchFollowUpActionsFinished()

    expect(getPrintedUiJsCode(renderResult.getEditorState())).toEqual(
      makeTestProjectCodeWithSnippet(TestProjectCCCDraggedToSecond),
    )
  })
})
