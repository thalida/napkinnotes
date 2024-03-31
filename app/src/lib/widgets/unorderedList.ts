import { getNodesAtCursor, setCursorBeforeElement, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class UnorderedListWidget extends Widget {
  SYNTAX_REGEX = /^([*-]\s)([^[].*)/

  insert(textNode: Text, text: string) {
    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.innerHTML = text.slice(2).trim() || '&ZeroWidthSpace;'
    ul.appendChild(li)

    textNode.replaceWith(ul)
    setCursorInElement(li)
  }

  onKeyup(): boolean {
    const { focusNode } = getNodesAtCursor()
    const isInsertWidget = focusNode ? this.SYNTAX_REGEX.test(focusNode.textContent || '') : false
    if (!isInsertWidget) {
      return false
    }

    if (focusNode) {
      this.insert(focusNode as Text, focusNode.textContent || '')
      return true
    }

    return false
  }

  onTab(event: KeyboardEvent): boolean {
    const { cursorTarget } = getNodesAtCursor()
    const isCursorAtLiStart = window.getSelection()?.anchorOffset === 0
    const previousSibling = cursorTarget?.previousSibling as HTMLElement
    const listParentType = cursorTarget?.parentElement?.tagName

    if (
      isCursorAtLiStart &&
      listParentType === 'UL' &&
      cursorTarget?.tagName === 'LI' &&
      previousSibling?.tagName === 'LI'
    ) {
      event.preventDefault()
      const nestedParent = document.createElement('ul')
      nestedParent.appendChild(cursorTarget)
      previousSibling.appendChild(nestedParent)
      setCursorBeforeElement(cursorTarget)
      return true
    }

    return false
  }
}
