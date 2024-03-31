import { getNodesAtCursor, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class HeadingsWidget extends Widget {
  SYNTAX_REGEX = /^(?:\s*)(#{1,4})\s/gm

  insert(textNode: Text, text: string) {
    const headingLevel = text.match(/#/g)?.length || 0
    const heading = document.createElement(`h${headingLevel}`)
    heading.innerHTML = text.replace(/#/g, '').trim() + '&ZeroWidthSpace;'
    textNode.replaceWith(heading)
    setCursorInElement(heading)
  }

  onKeyup(): boolean {
    const { focusedNode, cursorTarget } = getNodesAtCursor()
    const isInsertWidget = focusedNode
      ? this.SYNTAX_REGEX.test(focusedNode.textContent || '')
      : false
    if (!isInsertWidget) {
      return false
    }

    const isHeading =
      cursorTarget?.nodeName === 'H1' ||
      cursorTarget?.nodeName === 'H2' ||
      cursorTarget?.nodeName === 'H3' ||
      cursorTarget?.nodeName === 'H4'
    if (isHeading) {
      return false
    }

    if (focusedNode) {
      this.insert(focusedNode as Text, focusedNode.textContent || '')
      return true
    }

    return false
  }
}
