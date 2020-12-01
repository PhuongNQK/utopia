import { LayoutSystem } from 'utopia-api' // TODO fixme this imports utopia-api
import type { revertFile, saveFile } from '../../../core/model/project-file-utils'
import type { foldEither } from '../../../core/shared/either'
import type {
  ElementInstanceMetadata,
  JSXAttribute,
  JSXElement,
  JSXElementName,
  JSXMetadata,
  SettableLayoutSystem,
} from '../../../core/shared/element-template'
import type {
  CanvasPoint,
  CanvasRectangle,
  Size,
  WindowPoint,
} from '../../../core/shared/math-utils'
import type {
  PackageStatus,
  RequestedNpmDependency,
} from '../../../core/shared/npm-dependency-types'
import type {
  Imports,
  InstancePath,
  LayoutWrapper,
  NodeModules,
  ProjectFile,
  PropertyPath,
  ScenePath,
  StaticElementPath,
  TemplatePath,
  TextFile,
} from '../../../core/shared/project-file-types'
import type { BuildType } from '../../../core/workers/ts/ts-worker'
import type { Key, KeysPressed } from '../../../utils/keyboard'
import type { objectKeyParser, parseString } from '../../../utils/value-parser-utils'
import type { CSSCursor } from '../../../uuiui-deps'
import type {
  addFileToProjectContents,
  getContentsTreeFileFromString,
  ProjectContentTreeRoot,
} from '../../assets'
import CanvasActions from '../../canvas/canvas-actions'
import type { PinOrFlexFrameChange } from '../../canvas/canvas-types'
import type { RightMenuTab } from '../../canvas/right-menu'
import type { CodeEditorTheme } from '../../code-editor/code-editor-themes'
import type { CursorPosition } from '../../code-editor/code-editor-utils'
import type { EditorPane, EditorPanel } from '../../common/actions'
import type { Notice } from '../../common/notices'
import type { CodeResultCache, PropertyControlsInfo } from '../../custom-code/code-file'
import type { ElementContextMenuInstance } from '../../element-context-menu'
import type { FontSettings } from '../../inspector/common/css-utils'
import type { CSSTarget } from '../../inspector/sections/header-section/target-selector'
import type { LeftMenuTab } from '../../navigator/left-pane'
import type {
  AddFolder,
  AddMissingDimensions,
  AddStoryboardFile,
  AddTextFile,
  Alignment,
  AlignSelectedViews,
  Atomic,
  ClearHighlightedViews,
  ClearImageFileBlob,
  ClearParseOrPrintInFlight,
  CloseEditorTab,
  ClosePopup,
  CloseTextEditor,
  CopySelectionToClipboard,
  DeleteFile,
  DeleteView,
  DeleteViews,
  DistributeSelectedViews,
  Distribution,
  DuplicateSelected,
  DuplicateSpecificElements,
  EditorAction,
  EditorDispatch,
  FinishCheckpointTimer,
  HideModal,
  InsertDroppedImage,
  InsertImageIntoUI,
  InsertJSXElement,
  InsertScene,
  MoveSelectedBackward,
  MoveSelectedForward,
  MoveSelectedToBack,
  MoveSelectedToFront,
  OpenEditorTab,
  OpenPopup,
  OpenTextEditor,
  PasteJSXElements,
  PopToast,
  PropertyControlsIFrameReady,
  PushToast,
  Redo,
  RedrawOldCanvasControls,
  RegenerateThumbnail,
  RenameStyleSelector,
  ReorderEditorTabs,
  ResetPins,
  ResetPropToDefault,
  ResizeInterfaceDesignerCodePane,
  SaveAsset,
  SaveCurrentFile,
  SaveDOMReport,
  SaveImageDetails,
  SaveImageDoNothing,
  SaveImageInsertWith,
  SaveImageReplace,
  SaveImageSwitchMode,
  SelectAllSiblings,
  SelectComponent,
  SelectComponents,
  SendLinterRequestMessage,
  SendPreviewModel,
  SetAspectRatioLock,
  SetCanvasAnimationsEnabled,
  SetCanvasFrames,
  SetCodeEditorBuildErrors,
  SetCodeEditorLintErrors,
  SetCodeEditorTheme,
  SetCodeEditorVisibility,
  SetCursorOverlay,
  SetFilebrowserRenamingTarget,
  SetHighlightedView,
  SetHighlightsEnabled,
  SetLeftMenuExpanded,
  SetLeftMenuTab,
  SetMainUIFile,
  SetNavigatorRenamingTarget,
  SetPackageStatus,
  SetPanelVisibility,
  SetProjectID,
  SetProjectName,
  SetProp,
  SetPropWithElementPath,
  SetRightMenuExpanded,
  SetRightMenuTab,
  SetSafeMode,
  SetSaveError,
  SetSceneProp,
  SetShortcut,
  SetStoredFontSettings,
  SetZIndex,
  ShowContextMenu,
  ShowModal,
  StartCheckpointTimer,
  SwitchEditorMode,
  SwitchLayoutSystem,
  ToggleCanvasIsLive,
  ToggleCollapse,
  ToggleHidden,
  ToggleInterfaceDesignerAdditionalControls,
  ToggleInterfaceDesignerCodeEditor,
  ToggleInterfaceDesignerLayoutReversed,
  TogglePane,
  ToggleProperty,
  TransientActions,
  Undo,
  UnsetProperty,
  UnsetSceneProp,
  UnwrapGroupOrView,
  UnwrapLayoutable,
  UpdateCodeResultCache,
  UpdateDuplicationState,
  UpdateEditorMode,
  UpdateFile,
  UpdateFilePath,
  UpdateFrameDimensions,
  UpdateFromWorker,
  UpdateJSXElementName,
  UpdateKeysPressed,
  UpdateNodeModulesContents,
  UpdatePackageJson,
  UpdatePreviewConnected,
  UpdatePropertyControlsInfo,
  UpdateThumbnailGenerated,
  WrapInLayoutable,
  WrapInView,
} from '../action-types'
import { EditorModes, elementInsertionSubject, Mode, SceneInsertionSubject } from '../editor-modes'
import type {
  DuplicationState,
  ErrorMessages,
  ModalDialog,
  OriginalFrame,
} from '../store/editor-state'
import { EditorTab } from '../store/editor-tabs'

export function clearSelection(): EditorAction {
  return {
    action: 'CLEAR_SELECTION',
  }
}

export function insertScene(frame: CanvasRectangle): InsertScene {
  return {
    action: 'INSERT_SCENE',
    frame: frame,
  }
}

export function insertJSXElement(
  element: JSXElement,
  parent: TemplatePath | null,
  importsToAdd: Imports,
): InsertJSXElement {
  return {
    action: 'INSERT_JSX_ELEMENT',
    jsxElement: element,
    parent: parent,
    importsToAdd: importsToAdd,
  }
}

export function deleteView(target: TemplatePath): DeleteView {
  return {
    action: 'DELETE_VIEW',
    target: target,
  }
}

export function deleteViews(targets: Array<TemplatePath>): DeleteViews {
  return {
    action: 'DELETE_VIEWS',
    targets: targets,
  }
}

export function deleteSelected(): EditorAction {
  return {
    action: 'DELETE_SELECTED',
  }
}

export function unsetProperty(element: InstancePath, property: PropertyPath): UnsetProperty {
  return {
    action: 'UNSET_PROPERTY',
    element: element,
    property: property,
  }
}

export function toggleHidden(targets: Array<TemplatePath> = []): ToggleHidden {
  return {
    action: 'TOGGLE_HIDDEN',
    targets: targets,
  }
}

export function transientActions(actions: Array<EditorAction>): TransientActions {
  return {
    action: 'TRANSIENT_ACTIONS',
    transientActions: actions,
  }
}

export function selectComponents(
  target: Array<TemplatePath>,
  addToSelection: boolean,
): SelectComponents {
  return {
    action: 'SELECT_COMPONENTS',
    target: target,
    addToSelection: addToSelection,
  }
}

export function updateEditorMode(mode: Mode): UpdateEditorMode {
  return {
    action: 'UPDATE_EDITOR_MODE',
    mode: mode,
  }
}

export function switchEditorMode(mode: Mode): SwitchEditorMode {
  return {
    action: 'SWITCH_EDITOR_MODE',
    mode: mode,
  }
}

export function duplicateSelected(): DuplicateSelected {
  return {
    action: 'DUPLICATE_SELECTED',
  }
}

export function duplicateSpecificElements(paths: Array<TemplatePath>): DuplicateSpecificElements {
  return {
    action: 'DUPLICATE_SPECIFIC_ELEMENTS',
    paths: paths,
  }
}

export function updateDuplicationState(
  duplicationState: DuplicationState | null,
): UpdateDuplicationState {
  return {
    action: 'UPDATE_DUPLICATION_STATE',
    duplicationState: duplicationState,
  }
}

export function setCanvasFrames(
  framesAndTargets: Array<PinOrFlexFrameChange>,
  keepChildrenGlobalCoords: boolean,
  originalFrames: Array<OriginalFrame> | null = null,
): SetCanvasFrames {
  return {
    action: 'SET_CANVAS_FRAMES',
    framesAndTargets: framesAndTargets,
    keepChildrenGlobalCoords: keepChildrenGlobalCoords,
    originalFrames: originalFrames,
  }
}

export function setPanelVisibility(
  target: EditorPanel | EditorPane,
  visible: boolean,
): SetPanelVisibility {
  return {
    action: 'SET_PANEL_VISIBILITY',
    target: target,
    visible: visible,
  }
}

export function togglePanel(panel: EditorPanel | EditorPane): TogglePane {
  return {
    action: 'TOGGLE_PANE',
    target: panel,
  }
}

export function openPopup(popupId: string): OpenPopup {
  return {
    action: 'OPEN_POPUP',
    popupId: popupId,
  }
}

export function closePopup(): ClosePopup {
  return {
    action: 'CLOSE_POPUP',
  }
}

export function pasteJSXElements(
  elements: Array<JSXElement>,
  originalTemplatePaths: Array<TemplatePath>,
  targetOriginalContextMetadata: JSXMetadata,
): PasteJSXElements {
  return {
    action: 'PASTE_JSX_ELEMENTS',
    elements: elements,
    originalTemplatePaths: originalTemplatePaths,
    targetOriginalContextMetadata: targetOriginalContextMetadata,
  }
}

export function copySelectionToClipboard(): CopySelectionToClipboard {
  return {
    action: 'COPY_SELECTION_TO_CLIPBOARD',
  }
}

export function openTextEditor(
  target: InstancePath,
  mousePosition: WindowPoint | null, // if mousePosition is zero, the whole text will be selected
): OpenTextEditor {
  return {
    action: 'OPEN_TEXT_EDITOR',
    target: target,
    mousePosition: mousePosition,
  }
}

export function closeTextEditor(): CloseTextEditor {
  return {
    action: 'CLOSE_TEXT_EDITOR',
  }
}

export function toggleCollapse(target: TemplatePath): ToggleCollapse {
  return {
    action: 'TOGGLE_COLLAPSE',
    target: target,
  }
}

export function enableInsertModeForJSXElement(
  element: JSXElement,
  uid: string,
  importsToAdd: Imports,
  size: Size | null,
): SwitchEditorMode {
  return switchEditorMode(
    EditorModes.insertMode(false, elementInsertionSubject(uid, element, size, importsToAdd, null)),
  )
}

export function enableInsertModeForScene(name: JSXElementName | 'scene'): SwitchEditorMode {
  return switchEditorMode(EditorModes.insertMode(false, SceneInsertionSubject()))
}

export function pushToast(toastContent: Notice): PushToast {
  return {
    action: 'PUSH_TOAST',
    toast: toastContent,
  }
}

export function popToast(): PopToast {
  return {
    action: 'POP_TOAST',
  }
}

export function showToast(toastContent: Notice): PushToast {
  return pushToast(toastContent)
}

let selectionControlTimer: any // TODO maybe this should live inside the editormodel
export function hideAndShowSelectionControls(dispatch: EditorDispatch): void {
  dispatch([CanvasActions.setSelectionControlsVisibility(false)], 'canvas')
  if (selectionControlTimer != null) {
    window.clearTimeout(selectionControlTimer)
  }
  selectionControlTimer = window.setTimeout(() => {
    dispatch([CanvasActions.setSelectionControlsVisibility(true)], 'canvas')
    selectionControlTimer = null
  }, 2000)
}

export function setLeftMenuTab(tab: LeftMenuTab): SetLeftMenuTab {
  return {
    action: 'SET_LEFT_MENU_TAB',
    tab: tab,
  }
}

export function setLeftMenuExpanded(expanded: boolean): SetLeftMenuExpanded {
  return {
    action: 'SET_LEFT_MENU_EXPANDED',
    expanded: expanded,
  }
}

export function setRightMenuTab(tab: RightMenuTab): SetRightMenuTab {
  return {
    action: 'SET_RIGHT_MENU_TAB',
    tab: tab,
  }
}

export function setRightMenuExpanded(expanded: boolean): SetRightMenuExpanded {
  return {
    action: 'SET_RIGHT_MENU_EXPANDED',
    expanded: expanded,
  }
}

export function setHighlightedView(target: TemplatePath): SetHighlightedView {
  return {
    action: 'SET_HIGHLIGHTED_VIEW',
    target: target,
  }
}

export function clearHighlightedViews(): ClearHighlightedViews {
  return {
    action: 'CLEAR_HIGHLIGHTED_VIEWS',
  }
}

export function updateKeys(keys: KeysPressed): UpdateKeysPressed {
  return {
    action: 'UPDATE_KEYS_PRESSED',
    keys: keys,
  }
}

export function hideModal(): HideModal {
  return {
    action: 'HIDE_MODAL',
  }
}

export function showModal(modal: ModalDialog): ShowModal {
  return {
    action: 'SHOW_MODAL',
    modal: modal,
  }
}

export function resizeInterfaceDesignerCodePane(
  deltaCodePaneWidth: number,
): ResizeInterfaceDesignerCodePane {
  return {
    action: 'RESIZE_INTERFACEDESIGNER_CODEPANE',
    deltaCodePaneWidth: deltaCodePaneWidth,
  }
}

export function toggleInterfaceDesignerCodeEditor(): ToggleInterfaceDesignerCodeEditor {
  return {
    action: 'TOGGLE_INTERFACEDESIGNER_CODEEDITOR',
  }
}

export function toggleInterfaceDesignerLayoutReversed(): ToggleInterfaceDesignerLayoutReversed {
  return {
    action: 'TOGGLE_INTERFACEDESIGNER_LAYOUT_REVERSED',
  }
}

export function toggleInterfaceDesignerAdditionalControls(): ToggleInterfaceDesignerAdditionalControls {
  return {
    action: 'TOGGLE_INTERFACEDESIGNER_ADDITIONAL_CONTROLS',
  }
}

export function saveImageSwitchMode(): SaveImageSwitchMode {
  return {
    type: 'SAVE_IMAGE_SWITCH_MODE',
  }
}

export function saveImageDoNothing(): SaveImageDoNothing {
  return {
    type: 'SAVE_IMAGE_DO_NOTHING',
  }
}

export function saveImageReplace(): SaveImageReplace {
  return {
    type: 'SAVE_IMAGE_REPLACE',
  }
}

export function saveImageInsertWith(
  parentPath: TemplatePath | null,
  frame: CanvasRectangle,
  multiplier: number,
): SaveImageInsertWith {
  return {
    type: 'SAVE_IMAGE_INSERT_WITH',
    parentPath: parentPath,
    frame: frame,
    multiplier: multiplier,
  }
}

export function saveCurrentFile(): SaveCurrentFile {
  return {
    action: 'SAVE_CURRENT_FILE',
  }
}

export function saveImageDetails(
  imageSize: Size | null,
  afterSave: SaveImageSwitchMode | SaveImageDoNothing | SaveImageInsertWith | SaveImageReplace,
): SaveImageDetails {
  return {
    imageSize: imageSize,
    afterSave: afterSave,
  }
}

export function saveAsset(
  fileName: string,
  fileType: string,
  base64: string,
  hash: string,
  imageDetails: SaveImageDetails | null,
): SaveAsset {
  return {
    action: 'SAVE_ASSET',
    fileName: fileName,
    fileType: fileType,
    base64: base64,
    hash: hash,
    imageDetails: imageDetails,
  }
}

export function resetPins(target: InstancePath): ResetPins {
  return {
    action: 'RESET_PINS',
    target: target,
  }
}

export function wrapInGroup(targets: Array<TemplatePath>): WrapInView {
  return wrapInView(targets)
  // FIXME: Make Groups Great Again.
  //return {
  //  action: 'WRAP_IN_VIEW',
  //  targets: targets,
  //  layoutSystem: LayoutSystem.Group,
  //}
}

export function unwrapGroupOrView(target: TemplatePath): UnwrapGroupOrView {
  return {
    // TODO make it only run when the target is a group
    action: 'UNWRAP_GROUP_OR_VIEW',
    target: target,
    onlyForGroups: false,
  }
}

export function wrapInView(targets: Array<TemplatePath>): WrapInView {
  return {
    action: 'WRAP_IN_VIEW',
    targets: targets,
    layoutSystem: LayoutSystem.PinSystem,
  }
}

export function setCursorOverlay(cursor: CSSCursor | null): SetCursorOverlay {
  return {
    action: 'SET_CURSOR_OVERLAY',
    cursor: cursor,
  }
}

export function setCanvasAnimationsEnabled(value: boolean): SetCanvasAnimationsEnabled {
  return {
    action: 'SET_CANVAS_ANIMATIONS_ENABLED',
    value: value,
  }
}

export function setZIndex(target: TemplatePath, index: number): SetZIndex {
  return {
    action: 'SET_Z_INDEX',
    target: target,
    indexPosition: {
      type: 'absolute',
      index: index,
    },
  }
}

export function moveSelectedBackward(): MoveSelectedBackward {
  return {
    action: 'MOVE_SELECTED_BACKWARD',
  }
}

export function moveSelectedToBack(): MoveSelectedToBack {
  return {
    action: 'MOVE_SELECTED_TO_BACK',
  }
}

export function moveSelectedForward(): MoveSelectedForward {
  return {
    action: 'MOVE_SELECTED_FORWARD',
  }
}

export function moveSelectedToFront(): MoveSelectedToFront {
  return {
    action: 'MOVE_SELECTED_TO_FRONT',
  }
}

export function updateFrameDimensions(
  element: TemplatePath,
  width: number,
  height: number,
): UpdateFrameDimensions {
  return {
    action: 'UPDATE_FRAME_DIMENSIONS',
    element: element,
    width: width,
    height: height,
  }
}

export function setNavigatorRenamingTarget(
  target: TemplatePath | null,
): SetNavigatorRenamingTarget {
  return {
    action: 'SET_NAVIGATOR_RENAMING_TARGET',
    target: target,
  }
}

export function redrawOldCanvasControls(): RedrawOldCanvasControls {
  return {
    action: 'REDRAW_OLD_CANVAS_CONTROLS',
  }
}

export function setStoredFontSettings(fontSettings: FontSettings): SetStoredFontSettings {
  return {
    action: 'SET_STORED_FONT_SETTINGS',
    fontSettings: fontSettings,
  }
}

export function setProjectID(id: string): SetProjectID {
  return {
    action: 'SET_PROJECT_ID',
    id: id,
  }
}

export function atomic(actions: Array<EditorAction>): Atomic {
  return {
    action: 'ATOMIC',
    actions: actions,
  }
}

export function selectComponent(target: InstancePath): SelectComponent {
  return {
    action: 'SELECT_COMPONENT',
    target: target,
  }
}

export function selectAllSiblings(): SelectAllSiblings {
  return {
    action: 'SELECT_ALL_SIBLINGS',
  }
}

export function undo(): Undo {
  return {
    action: 'UNDO',
  }
}

export function redo(): Redo {
  return {
    action: 'REDO',
  }
}

export function updateCodeResultCache(
  codeResultCache: CodeResultCache,
  buildType: BuildType,
): UpdateCodeResultCache {
  return {
    action: 'UPDATE_CODE_RESULT_CACHE',
    codeResultCache: codeResultCache,
    buildType: buildType,
  }
}

export function setCodeEditorVisibility(value: boolean): SetCodeEditorVisibility {
  return {
    action: 'SET_CODE_EDITOR_VISIBILITY',
    value: value,
  }
}

export function setProjectName(projectName: string): SetProjectName {
  return {
    action: 'SET_PROJECT_NAME',
    name: projectName,
  }
}

export function regenerateThumbnail(): RegenerateThumbnail {
  return {
    action: 'REGENERATE_THUMBNAIL',
  }
}

export function updateThumbnailGenerated(timestamp: number): UpdateThumbnailGenerated {
  return {
    action: 'UPDATE_THUMBNAIL_GENERATED',
    timestamp: timestamp,
  }
}

export function updatePreviewConnected(connected: boolean): UpdatePreviewConnected {
  return {
    action: 'UPDATE_PREVIEW_CONNECTED',
    connected: connected,
  }
}

export function setHighlightsEnabled(value: boolean): SetHighlightsEnabled {
  return {
    action: 'SET_HIGHLIGHTS_ENABLED',
    value: value,
  }
}

export function alignSelectedViews(alignment: Alignment): AlignSelectedViews {
  return {
    action: 'ALIGN_SELECTED_VIEWS',
    alignment: alignment,
  }
}

export function distributeSelectedViews(distribution: Distribution): DistributeSelectedViews {
  return {
    action: 'DISTRIBUTE_SELECTED_VIEWS',
    distribution: distribution,
  }
}

export function showContextMenu(
  menuName: ElementContextMenuInstance,
  event: MouseEvent,
): ShowContextMenu {
  return {
    action: 'SHOW_CONTEXT_MENU',
    menuName: menuName,
    event: event,
  }
}

export function sendPreviewModel(): SendPreviewModel {
  return {
    action: 'SEND_PREVIEW_MODEL',
  }
}

export function updateFilePath(oldPath: string, newPath: string): UpdateFilePath {
  return {
    action: 'UPDATE_FILE_PATH',
    oldPath: oldPath,
    newPath: newPath,
  }
}

export function deleteFile(filename: string): DeleteFile {
  return {
    action: 'DELETE_FILE',
    filename: filename,
  }
}

export function addFolder(parentPath: string): AddFolder {
  return {
    action: 'ADD_FOLDER',
    parentPath: parentPath,
  }
}

export function openEditorTab(
  editorTab: EditorTab,
  cursorPosition: CursorPosition | null,
): OpenEditorTab {
  return {
    action: 'OPEN_FILE',
    editorTab: editorTab,
    cursorPosition: cursorPosition,
  }
}

export function closeEditorTab(editorTab: EditorTab): CloseEditorTab {
  return {
    action: 'CLOSE_FILE',
    editorTab: editorTab,
  }
}

export function reorderOpenFiles(editorTab: EditorTab, newIndex: number): ReorderEditorTabs {
  return {
    action: 'REORDER_OPEN_FILES',
    editorTab: editorTab,
    newIndex: newIndex,
  }
}

export function updateFile(
  filePath: string,
  file: ProjectFile,
  addIfNotInFiles: boolean,
): UpdateFile {
  return {
    action: 'UPDATE_FILE',
    filePath: filePath,
    file: file,
    addIfNotInFiles: addIfNotInFiles,
  }
}

export function updateFromWorker(
  filePath: string,
  file: TextFile,
  codeOrModel: 'Code' | 'Model',
): UpdateFromWorker {
  return {
    action: 'UPDATE_FROM_WORKER',
    filePath: filePath,
    file: file,
    codeOrModel: codeOrModel,
  }
}

export function clearParseOrPrintInFlight(): ClearParseOrPrintInFlight {
  return {
    action: 'CLEAR_PARSE_OR_PRINT_IN_FLIGHT',
  }
}

export function clearImageFileBlob(uiFilePath: string, elementID: string): ClearImageFileBlob {
  return {
    action: 'CLEAR_IMAGE_FILE_BLOB',
    uiFilePath: uiFilePath,
    elementID: elementID,
  }
}

export function addTextFile(parentPath: string, fileName: string): AddTextFile {
  return {
    action: 'ADD_TEXT_FILE',
    fileName: fileName,
    parentPath: parentPath,
  }
}

export function setMainUIFile(uiFile: string): SetMainUIFile {
  return {
    action: 'SET_MAIN_UI_FILE',
    uiFile: uiFile,
  }
}

export function saveDOMReport(elementMetadata: Array<ElementInstanceMetadata>): SaveDOMReport {
  return {
    action: 'SAVE_DOM_REPORT',
    elementMetadata: elementMetadata,
  }
}

/** WARNING: you probably don't want to use setProp, instead you should use a domain-specific action! */
export function setProp_UNSAFE(
  target: InstancePath,
  propertyPath: PropertyPath,
  value: JSXAttribute,
): SetProp {
  return {
    action: 'SET_PROP',
    target: target,
    propertyPath: propertyPath,
    value: value,
  }
}

/** WARNING: you probably don't want to use setProp, instead you should use a domain-specific action! */
export function setPropWithElementPath_UNSAFE(
  target: StaticElementPath,
  propertyPath: PropertyPath,
  value: JSXAttribute,
): SetPropWithElementPath {
  return {
    action: 'SET_PROP_WITH_ELEMENT_PATH',
    target: target,
    propertyPath: propertyPath,
    value: value,
  }
}

export function renamePropKey(
  target: InstancePath,
  cssTargetPath: CSSTarget,
  value: Array<string>,
): RenameStyleSelector {
  return {
    action: 'RENAME_PROP_KEY',
    target,
    cssTargetPath,
    value,
  }
}

export function setCodeEditorBuildErrors(buildErrors: ErrorMessages): SetCodeEditorBuildErrors {
  return {
    action: 'SET_CODE_EDITOR_BUILD_ERRORS',
    buildErrors: buildErrors,
  }
}

export function setCodeEditorLintErrors(lintErrors: ErrorMessages): SetCodeEditorLintErrors {
  return {
    action: 'SET_CODE_EDITOR_LINT_ERRORS',
    lintErrors: lintErrors,
  }
}

export function setFilebrowserRenamingTarget(
  filename: string | null,
): SetFilebrowserRenamingTarget {
  return {
    action: 'SET_FILEBROWSER_RENAMING_TARGET',
    filename: filename,
  }
}

export function toggleProperty(
  target: InstancePath,
  togglePropValue: (element: JSXElement) => JSXElement,
): ToggleProperty {
  return {
    action: 'TOGGLE_PROPERTY',
    target: target,
    togglePropValue: togglePropValue,
  }
}

export function switchLayoutSystem(layoutSystem: SettableLayoutSystem): SwitchLayoutSystem {
  return {
    action: 'SWITCH_LAYOUT_SYSTEM',
    layoutSystem: layoutSystem,
  }
}

export function insertImageIntoUI(imagePath: string): InsertImageIntoUI {
  return {
    action: 'INSERT_IMAGE_INTO_UI',
    imagePath: imagePath,
  }
}

export function setSceneProp(
  scenePath: ScenePath,
  propertyPath: PropertyPath,
  value: JSXAttribute,
): SetSceneProp {
  return {
    action: 'SET_SCENE_PROP',
    scenePath: scenePath,
    propertyPath: propertyPath,
    value: value,
  }
}

export function unsetSceneProp(scenePath: ScenePath, propertyPath: PropertyPath): UnsetSceneProp {
  return {
    action: 'UNSET_SCENE_PROP',
    scenePath: scenePath,
    propertyPath: propertyPath,
  }
}

export function wrapInLayoutable(target: InstancePath, wrapper: LayoutWrapper): WrapInLayoutable {
  return {
    action: 'WRAP_IN_LAYOUTABLE',
    target: target,
    wrapper: wrapper,
  }
}

export function unwrapLayoutable(target: InstancePath): UnwrapLayoutable {
  return {
    action: 'UNWRAP_LAYOUTABLE',
    target: target,
  }
}

export function updateJSXElementName(
  target: InstancePath,
  elementName: JSXElementName,
): UpdateJSXElementName {
  return {
    action: 'UPDATE_JSX_ELEMENT_NAME',
    target: target,
    elementName: elementName,
  }
}

export function setAspectRatioLock(target: InstancePath, locked: boolean): SetAspectRatioLock {
  return {
    action: 'SET_ASPECT_RATIO_LOCK',
    target: target,
    locked: locked,
  }
}

export function toggleCanvasIsLive(): ToggleCanvasIsLive {
  return {
    action: 'TOGGLE_CANVAS_IS_LIVE',
  }
}

export function setCodeEditorTheme(value: CodeEditorTheme): SetCodeEditorTheme {
  return {
    action: 'SET_CODE_EDITOR_THEME',
    value: value,
  }
}

export function setSafeMode(value: boolean): SetSafeMode {
  return {
    action: 'SET_SAFE_MODE',
    value: value,
  }
}

export function setSaveError(value: boolean): SetSaveError {
  return {
    action: 'SET_SAVE_ERROR',
    value: value,
  }
}

export function insertDroppedImage(imagePath: string, position: CanvasPoint): InsertDroppedImage {
  return {
    action: 'INSERT_DROPPED_IMAGE',
    imagePath: imagePath,
    position: position,
  }
}

export function resetPropToDefault(
  target: TemplatePath,
  path: PropertyPath | null,
): ResetPropToDefault {
  return {
    action: 'RESET_PROP_TO_DEFAULT',
    target: target,
    path: path,
  }
}

export function updateNodeModulesContents(
  contentsToAdd: NodeModules,
  buildType: BuildType,
): UpdateNodeModulesContents {
  return {
    action: 'UPDATE_NODE_MODULES_CONTENTS',
    contentsToAdd: contentsToAdd,
    buildType: buildType,
  }
}

export function updatePackageJson(dependencies: Array<RequestedNpmDependency>): UpdatePackageJson {
  return {
    action: 'UPDATE_PACKAGE_JSON',
    dependencies: dependencies,
  }
}

export function startCheckpointTimer(): StartCheckpointTimer {
  return {
    action: 'START_CHECKPOINT_TIMER',
  }
}

export function finishCheckpointTimer(): FinishCheckpointTimer {
  return {
    action: 'FINISH_CHECKPOINT_TIMER',
  }
}

export function addMissingDimensions(
  target: InstancePath,
  existingSize: CanvasRectangle,
): AddMissingDimensions {
  return {
    action: 'ADD_MISSING_DIMENSIONS',
    existingSize: existingSize,
    target: target,
  }
}

export function setPackageStatus(packageName: string, status: PackageStatus): SetPackageStatus {
  return {
    action: 'SET_PACKAGE_STATUS',
    packageName: packageName,
    status: status,
  }
}

export function setShortcut(shortcutName: string, newKey: Key): SetShortcut {
  return {
    action: 'SET_SHORTCUT',
    shortcutName: shortcutName,
    newKey: newKey,
  }
}

export function updatePropertyControlsInfo(
  propertyControlsInfo: PropertyControlsInfo,
): UpdatePropertyControlsInfo {
  return {
    action: 'UPDATE_PROPERTY_CONTROLS_INFO',
    propertyControlsInfo: propertyControlsInfo,
  }
}

export function propertyControlsIFrameReady(): PropertyControlsIFrameReady {
  return {
    action: 'PROPERTY_CONTROLS_IFRAME_READY',
  }
}

export function addStoryboardFile(): AddStoryboardFile {
  return {
    action: 'ADD_STORYBOARD_FILE',
  }
}

export function sendLinterRequestMessage(
  filePath: string,
  content: string,
): SendLinterRequestMessage {
  return {
    action: 'SEND_LINTER_REQUEST_MESSAGE',
    filePath: filePath,
    content: content,
  }
}