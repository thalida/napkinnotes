import './widget.css'

import { getNodesAtCursor, setCursorAfterElement, setCursorInElement } from '../../utils/cursor'
import { BaseWidget } from '../BaseWidget'

export default class HrWidget extends BaseWidget {
  SYNTAX_REGEX = /^(={3,})|(-{3,})|(\*{3,})/

  insert(textNode: Text) {
    const hr = document.createElement('hr')
    hr.classList.add('widget', 'widget-hr')
    textNode.replaceWith(hr)

    const div = document.createElement('div')
    div.append(document.createElement('br'))

    hr.after(div)

    setCursorInElement(div)
  }

  onKeyup() {
    const { focusNode } = getNodesAtCursor()
    const isInsertWidget = focusNode ? this.SYNTAX_REGEX.test(focusNode.textContent || '') : false
    if (!isInsertWidget) {
      return
    }

    if (focusNode) {
      this.insert(focusNode as Text)
    }
  }
}
