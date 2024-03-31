import { getNodesAtCursor, setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class ChecklistWidget extends Widget {
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

  _createInputElement(isChecked = false) {
    const input = document.createElement('input')

    input.classList.add('widget-checklist__input')
    input.type = 'checkbox'
    input.checked = isChecked
    input.value = input.checked ? 'true' : 'false'

    return input
  }

  insert(textNode: Text, text: string) {
    const ul = document.createElement('ul')
    const li = document.createElement('li')
    const input = this._createInputElement(this.IS_CHECKED_REGEX.test(text))
    const inputText = text.replace('- []', '').replace('- [ ]', '').replace('- [x]', '').trim()
    const inputTextNode = document.createTextNode(inputText)
    ul.classList.add('widget', 'widget-checklist')
    li.classList.add('widget-checklist__listitem')
    li.append(input)
    li.innerHTML += '&ZeroWidthSpace;'
    li.append(inputTextNode)
    ul.append(li)
    textNode.replaceWith(ul)
    setCursorInElement(li)

    const checkbox = li.querySelector('input[type=checkbox]') as HTMLInputElement
    if (!checkbox) {
      return
    }
    checkbox.checked = checkbox.value === 'true'
  }

  onKeyup(event: KeyboardEvent): void {
    const isEnter = event.key === 'Enter'
    const { focusNode, cursorTarget } = getNodesAtCursor()
    const isInsertWidget = focusNode ? this.SYNTAX_REGEX.test(focusNode.textContent || '') : false

    if (isInsertWidget && focusNode) {
      this.insert(focusNode as Text, focusNode.textContent || '')
    }

    if (isEnter && cursorTarget) {
      const parentListItem = cursorTarget.closest('li')
      if (!parentListItem) {
        return
      }

      const previousSibling = parentListItem.previousSibling as HTMLElement
      if (!previousSibling) {
        return
      }

      const prevHasCheckbox = previousSibling.querySelector('input[type=checkbox]')
      if (!prevHasCheckbox) {
        return
      }

      const prevTextLength =
        previousSibling.textContent?.replace(/[\u200B-\u200D\uFEFF]/g, '').trim().length || 0

      if (prevTextLength === 0) {
        const div = document.createElement('div')
        div.append(document.createElement('br'))
        cursorTarget.parentElement?.after(div)
        cursorTarget.remove()
        setCursorInElement(div)
        return
      }

      const checkboxInput = this._createInputElement()
      cursorTarget.innerHTML = '&ZeroWidthSpace;' + cursorTarget.innerHTML
      cursorTarget?.prepend(checkboxInput)
      setCursorInElement(cursorTarget)
    }
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
