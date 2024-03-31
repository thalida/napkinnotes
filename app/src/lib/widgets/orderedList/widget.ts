import './widget.css'

import { getNodesAtCursor, setCursorBeforeElement, setCursorInElement } from '../../utils/cursor'
import { BaseWidget } from '../BaseWidget'

export default class OrderedListWidget extends BaseWidget {
  SYNTAX_REGEX = /^([1]+\.\s)(.*)/

  insert(textNode: Text, text: string) {
    const ol = document.createElement('ol')
    const li = document.createElement('li')
    li.innerHTML = text.slice(3).trim() || '&ZeroWidthSpace;'
    ol.appendChild(li)

    textNode.replaceWith(ol)
    setCursorInElement(li)
  }

  onKeyup() {
    const { focusNode } = getNodesAtCursor()
    const isInsertWidget = focusNode ? this.SYNTAX_REGEX.test(focusNode.textContent || '') : false
    if (!isInsertWidget) {
      return
    }

    if (focusNode) {
      this.insert(focusNode as Text, focusNode.textContent || '')
    }
  }

  onTab(event: KeyboardEvent): boolean {
    const { cursorTarget } = getNodesAtCursor()
    const isCursorAtLiStart = window.getSelection()?.anchorOffset === 0
    const previousSibling = cursorTarget?.previousSibling as HTMLElement
    const listParentType = cursorTarget?.parentElement?.tagName

    if (
      isCursorAtLiStart &&
      listParentType === 'OL' &&
      cursorTarget?.tagName === 'LI' &&
      previousSibling?.tagName === 'LI'
    ) {
      event.preventDefault()
      const nestedParent = document.createElement('ol')
      nestedParent.appendChild(cursorTarget)
      previousSibling.appendChild(nestedParent)
      setCursorBeforeElement(cursorTarget)
      return true
    }

    return false
  }
}
