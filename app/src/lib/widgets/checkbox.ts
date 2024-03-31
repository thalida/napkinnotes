import { getNodesAtCursor, setCursorAfterElement, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class CheckboxWidget extends Widget {
  SYNTAX_REGEX = /^(?:\s*)(-\s\[[\sx]?\])(.*)/
  private IS_CHECKED_REGEX = /^-\s\[[x]\]/

  load() {
    const checkboxElements = this.napkinnote.element.querySelectorAll(
      'input[type=checkbox]'
    ) as NodeListOf<HTMLInputElement>
    if (!checkboxElements) {
      return
    }

    for (const checkbox of checkboxElements) {
      checkbox.checked = checkbox.value === 'true'
    }
  }

  update() {
    const checkboxElements = this.napkinnote.element.querySelectorAll(
      'input[type=checkbox]'
    ) as NodeListOf<HTMLInputElement>
    if (!checkboxElements) {
      return
    }

    for (const checkbox of checkboxElements) {
      checkbox.value = checkbox.checked ? 'true' : 'false'
    }
  }

  createElement(isChecked = false) {
    const input = document.createElement('input')

    input.classList.add('widget', 'widget-checkbox')
    input.type = 'checkbox'
    input.checked = isChecked
    input.value = input.checked ? 'true' : 'false'

    return input
  }

  insert(textNode: Text, text: string) {
    const inputText = text.replace('- []', '').replace('- [ ]', '').replace('- [x]', '').trim()

    const input = this.createElement(this.IS_CHECKED_REGEX.test(text))
    const inputTextNode = document.createTextNode(inputText)

    const div = document.createElement('div')
    div.append(input)
    div.innerHTML += '&ZeroWidthSpace;'
    div.append(inputTextNode)
    textNode.replaceWith(div)
    setCursorInElement(div)

    const checkbox = div.querySelector('input[type=checkbox]') as HTMLInputElement
    if (!checkbox) {
      return
    }
    checkbox.checked = checkbox.value === 'true'
  }

  onKeyup(): void {
    const { focusedNode } = getNodesAtCursor()
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

  onKeydown(event: KeyboardEvent): void {
    const isEnter = event.key === 'Enter'
    if (!isEnter) {
      return
    }

    const { cursorTarget } = getNodesAtCursor()
    if (typeof cursorTarget === 'undefined' || cursorTarget === null) {
      return
    }

    const childNodes = cursorTarget.childNodes || []
    const hasCheckboxChild =
      childNodes[0] && (childNodes[0] as HTMLInputElement).type === 'checkbox'

    if (!hasCheckboxChild) {
      return
    }

    event.preventDefault()

    const hasText = cursorTarget.textContent
      ? cursorTarget.textContent.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length > 0
      : false
    if (!hasText) {
      const emptyDiv = document.createElement('div')
      emptyDiv.appendChild(document.createElement('br'))

      if (cursorTarget.classList.contains('napkinnote')) {
        cursorTarget.appendChild(emptyDiv)
      } else {
        cursorTarget.replaceWith(emptyDiv)
      }

      setCursorInElement(emptyDiv)
      return
    }

    const div = document.createElement('div')
    const checkboxInput = this.createElement()
    div.append(checkboxInput)
    div.innerHTML += '&ZeroWidthSpace;'

    cursorTarget.after(div)
    setCursorInElement(div)
  }

  onClick(event: MouseEvent) {
    const target = event.target

    if (typeof target === 'undefined' || target === null) {
      return
    }

    const isCheckbox =
      (target as HTMLInputElement).type && (target as HTMLInputElement).type === 'checkbox'
    if (isCheckbox) {
      this.update()
    }
  }
}
