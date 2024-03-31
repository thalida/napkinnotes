import { getCursorNodes, setCursorBeforeElement, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class OrderedListWidget extends Widget {
  SYNTAX_REGEX = /^([1]+\.\s)(.*)/

  load() {}

  update() {}

  insert(textNode: Text, text: string) {
    const ol = document.createElement('ol')
    const li = document.createElement('li')
    li.textContent = text.slice(3) || ' '
    ol.appendChild(li)

    textNode.replaceWith(ol)
    setCursorInElement(li)
  }

  onKeyup() {
    const { focusedNode } = getCursorNodes()
    const isInsertWidget = focusedNode
      ? this.SYNTAX_REGEX.test(focusedNode.textContent || '')
      : false
    if (!isInsertWidget) {
      return
    }

    if (focusedNode) {
      this.insert(focusedNode as Text, focusedNode.textContent || '')
    }
  }

  onTab(event: KeyboardEvent): boolean {
    const { cursorTarget } = getCursorNodes()
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
