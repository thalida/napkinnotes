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
  const focusedNode = window.getSelection()?.focusNode
  let cursorTarget: HTMLElement | null = null

  if (focusedNode && focusedNode.nodeType === Node.TEXT_NODE) {
    cursorTarget = focusedNode.parentElement
  } else {
    cursorTarget = focusedNode as HTMLElement | null
  }

  return { focusedNode, cursorTarget }
}
