import { getNodesAtCursor, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class HeadingsWidget extends Widget {
  SYNTAX_REGEX = /^(?:\s*)(#{1,4})\s/gm

  insert(textNode: Text, text: string) {
    const headingLevel = text.match(/#/g)?.length || 0
    const heading = document.createElement(`h${headingLevel}`)
    heading.textContent = text.replace(/#/g, '').trim() + ' '
    textNode.replaceWith(heading)
    setCursorInElement(heading)
  }

  onKeyup(): boolean {
    const { focusedNode } = getNodesAtCursor()
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
}
