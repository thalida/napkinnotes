import { getCursorNodes, setCursorBeforeElement, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class UnorderedListWidget extends Widget {
  SYNTAX_REGEX = /^([*-]\s)([^[].*)/

  load() {}

  update() {}

  insert(textNode: Text, text: string) {
    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.textContent = text.slice(2) || ' '
    ul.appendChild(li)

    textNode.replaceWith(ul)
    setCursorInElement(li)
  }

  onKeyup(): boolean {
    const { focusedNode } = getCursorNodes()
    const isInsertWidget = focusedNode
      ? this.SYNTAX_REGEX.test(focusedNode.textContent || '')
      : false
    if (!isInsertWidget) {
      return false
    }

    if (focusedNode) {
      this.insert(focusedNode as Text, focusedNode.textContent || '')
      return true
    }

    return false
  }

  onTab(event: KeyboardEvent): boolean {
    const { cursorTarget } = getCursorNodes()
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
