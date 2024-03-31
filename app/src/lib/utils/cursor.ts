export function setCursorAfterElement(element: Node | null | undefined) {
  if (typeof element === 'undefined' || element === null) {
    return
  }

  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(false)

  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function setCursorBeforeElement(element: Node | null | undefined) {
  if (typeof element === 'undefined' || element === null) {
    return
  }

  const range = document.createRange()
  range.selectNodeContents(element)
  range.collapse(true)

  const selection = window.getSelection()
  selection?.removeAllRanges()
  selection?.addRange(range)
}

export function setCursorInElement(element: HTMLElement | null | undefined) {
  if (typeof element === 'undefined' || element === null) {
    return
  }

  setCursorAfterElement(element.childNodes[element.childNodes.length - 1] as HTMLElement)
}

export function insertHTMLAtCursor(element: Node) {
  const range = window.getSelection()?.getRangeAt(0)
  range?.collapse(true)
  range?.insertNode(element)
  setCursorAfterElement(element)
}

export function getNodesAtCursor() {
  const cursorPosition = window.getSelection()?.getRangeAt(0).startOffset
  const anchorNode = window.getSelection()?.anchorNode
  const focusNode = window.getSelection()?.focusNode
  let cursorTarget: HTMLElement | null = null

  if (focusNode && focusNode.nodeType === Node.TEXT_NODE) {
    cursorTarget = focusNode.parentElement
  } else {
    cursorTarget = focusNode as HTMLElement | null
  }

  return { cursorPosition, anchorNode, focusNode, cursorTarget }
}
