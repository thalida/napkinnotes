import './widget.css'

import { getNodesAtCursor, setCursorInElement } from '../../utils/cursor'
import { BaseWidget } from '../BaseWidget'

export default class AccordionWidget extends BaseWidget {
  SYNTAX_REGEX = /^(>\s)(.*)/

  insert(textNode: Text, text: string) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    summary.innerHTML = '&ZeroWidthSpace;'

    const p = document.createElement('p')
    p.innerHTML = '&ZeroWidthSpace;'
    p.appendChild(document.createTextNode(text.slice(2).trim()))

    details.appendChild(summary)
    details.appendChild(p)
    textNode.replaceWith(details)
    setCursorInElement(p)
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
}
