export const NAPKIN_NOTE_EVENTS = {
  ON_UPDATE: 'update'
}

export default class NapkinNote {
  element: HTMLElement

  private callbacks: { [key: string]: EventListener[] } = {}

  private CHECKBOX_REGEX = /^[\s*]?(-\s\[[\sx]?\])(.*)/
  private IS_CHECKED_REGEX = /^-\s\[[x]\]/
  private LIST_UNORDERED_REGEX = /^([*-]\s)([^[].*)/
  private LIST_ORDERED_REGEX = /^([1]+\.\s)(.*)/
  private CALCULATOR_REGEX = /^(\$\s)(.*)/
  private CALCULATOR_NEEDS_VAR_DEF_REGEX = /^\s*?([\w]*)\s*?=/
  private CALCULAOTR_VARIABLE_REGEX = /^(let|const|var)?\s*?([\w]*)\s*?=/

  private alreadyEmptyInputs = new Set<HTMLElement>()

  constructor(element: HTMLElement) {
    this.element = element

    try {
      this.loadCheckboxWidgets()
      this.loadCalculatorWidgets()
    } catch (error) {
      console.error(error)
    }

    this.element.addEventListener('keyup', this.handleKeyupEvent.bind(this))
    this.element.addEventListener('keydown', this.handleKeydownEvent.bind(this))
    this.element.addEventListener('click', this.handleClickEvent.bind(this))

    this.element.focus()
  }

  get htmlContent() {
    return this.element.innerHTML || ''
  }

  destroy() {
    this.element.removeEventListener('keyup', this.handleKeyupEvent)
    this.element.removeEventListener('keydown', this.handleKeydownEvent)
    this.element.removeEventListener('click', this.handleClickEvent)
  }

  on(event: string, callback: EventListener) {
    if (!Object.values(NAPKIN_NOTE_EVENTS).includes(event)) {
      throw new Error(`Unsupported event: ${event}`)
    }

    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }

    this.callbacks[event].push(callback)
  }

  private trigger(event: string, data?: any) {
    if (!this.callbacks[event]) {
      return
    }

    for (const callback of this.callbacks[event]) {
      callback(data)
    }
  }

  createCalculatorWidget(textNode: Text, text: string) {
    const widget = document.createElement('div')
    widget.classList.add('widget', 'widget-calculator')
    widget.contentEditable = 'false'

    const textarea = document.createElement('textarea')
    textarea.className = 'widget-calculator__input'
    textarea.wrap = 'soft'
    textarea.autocomplete = 'off'
    textarea.autocapitalize = 'off'
    textarea.value = text.replace(this.CALCULATOR_REGEX, '$2')
    textarea.placeholder = 'Enter a math expression'
    textarea.dataset.value = textarea.value

    const output = document.createElement('output')
    output.className = 'widget-calculator__output'
    output.contentEditable = 'false'
    output.textContent = ''

    widget.appendChild(textarea)
    widget.appendChild(output)
    textNode.replaceWith(widget)

    textarea.focus()
  }

  loadCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll('.widget-calculator')
    if (!calculatorElements) {
      return
    }

    for (const calculator of calculatorElements) {
      const textarea = calculator.querySelector('.widget-calculator__input') as HTMLTextAreaElement

      if (!textarea) {
        continue
      }

      textarea.value = textarea.dataset.value || ''
      textarea.placeholder = 'Enter a math expression'
    }
  }

  formatCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll('.widget-calculator')
    if (!calculatorElements) {
      return
    }

    const inputHistory: string[] = []

    function evalInput(
      inputString: string,
      variableName: string
    ): { success: boolean; result: any; error: any } {
      inputHistory.push(inputString)

      let evalString = `'use strict'; ${inputHistory.join(';')}`
      evalString = variableName ? `${evalString};${variableName}` : evalString

      try {
        const result = eval?.(evalString)
        return { success: true, result, error: null }
      } catch (error) {
        inputHistory.pop()
        return { success: false, result: null, error }
      }
    }

    for (const calculator of calculatorElements) {
      const input = calculator.querySelector('.widget-calculator__input') as HTMLTextAreaElement
      const output = calculator.querySelector('.widget-calculator__output') as HTMLElement

      if (!input || !output) {
        continue
      }

      input.dataset.value = input.value

      const inputValue = input.value.trim()
      const hasValue = inputValue.length > 0

      let evalRes: { success: boolean; result: any; error: any } | null = null

      if (hasValue) {
        const splitLines = inputValue
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0)

        let inputStr = ''
        let lastVariableName = ''
        for (let line of splitLines) {
          const endswithSemiColon = line.endsWith(';')
          const endsWithCurlyBrace = line.endsWith('}') || line.endsWith('{')

          const isVariableWithoutDeclaration = this.CALCULATOR_NEEDS_VAR_DEF_REGEX.test(line)
          if (isVariableWithoutDeclaration) {
            line = `var ${line}`
          }

          if (!endsWithCurlyBrace && !endswithSemiColon) {
            inputStr += `${line};`
          } else {
            inputStr += `${line}`
          }

          const matches = line.match(this.CALCULAOTR_VARIABLE_REGEX)
          lastVariableName = matches ? matches[2] : ''
        }

        evalRes = evalInput(inputStr, lastVariableName)
      }

      output.textContent = evalRes ? evalRes.result : ''

      if (!hasValue) {
        calculator.classList.add('widget-calculator--empty')
        calculator.classList.remove('widget-calculator--success', 'widget-calculator--error')
      } else {
        if (evalRes?.error) {
          calculator.classList.add('widget-calculator--error')
          calculator.classList.remove('widget-calculator--empty', 'widget-calculator--success')
        } else {
          calculator.classList.add('widget-calculator--success')
          calculator.classList.remove('widget-calculator--empty', 'widget-calculator--error')
        }
      }
    }
  }

  createUnorderedListWidget(textNode: Text, text: string) {
    const ul = document.createElement('ul')
    const li = document.createElement('li')
    li.textContent = text.slice(2) || ' '
    ul.appendChild(li)

    textNode.replaceWith(ul)
    this.setCursorInElement(li)
  }

  createOrderedListWidget(textNode: Text, text: string) {
    const ol = document.createElement('ol')
    const li = document.createElement('li')
    li.textContent = text.slice(3) || ' '
    ol.appendChild(li)

    textNode.replaceWith(ol)
    this.setCursorInElement(li)
  }

  createLinkWidget(textNode: Text | HTMLElement, url: string) {
    const gotoLink = document.createElement('a')
    gotoLink.classList.add('widget', 'widget-link')
    gotoLink.href = url
    gotoLink.target = '_blank'
    gotoLink.textContent = url

    textNode.replaceWith(gotoLink)
    this.setCursorInElement(gotoLink)
  }

  formatLinkWidgets() {
    const linkElements = this.element.querySelectorAll(
      '.widget-link'
    ) as NodeListOf<HTMLAnchorElement>

    if (!linkElements) {
      return
    }

    for (const linkElement of linkElements) {
      const linkText = linkElement.textContent || ''
      linkElement.href = linkText
    }
  }

  createCheckboxElement(isChecked = false) {
    const input = document.createElement('input')

    input.classList.add('widget', 'widget-checkbox')
    input.type = 'checkbox'
    input.checked = isChecked
    input.value = input.checked ? 'true' : 'false'

    return input
  }

  createCheckboxWidget(textNode: Text, text: string) {
    const inputText = text.replace('- []', '').replace('- [x]', '').replace('- [ ]', '')

    const input = this.createCheckboxElement(this.IS_CHECKED_REGEX.test(text))
    const inputTextNode = document.createTextNode(inputText)
    textNode.replaceWith(input)
    input.after(inputTextNode)
    this.setCursorAfterElement(inputTextNode)
  }

  loadCheckboxWidgets() {
    const checkboxElements = this.element.querySelectorAll(
      'input[type=checkbox]'
    ) as NodeListOf<HTMLInputElement>
    if (!checkboxElements) {
      return
    }

    for (const checkbox of checkboxElements) {
      checkbox.checked = checkbox.value === 'true'
    }
  }

  formatCheckboxWidgets() {
    const checkboxElements = this.element.querySelectorAll(
      'input[type=checkbox]'
    ) as NodeListOf<HTMLInputElement>
    if (!checkboxElements) {
      return
    }

    for (const checkbox of checkboxElements) {
      checkbox.value = checkbox.checked ? 'true' : 'false'
    }
  }

  private handleKeyupEvent(event: KeyboardEvent) {
    const isMetaKeyPressed = event.metaKey || event.ctrlKey

    if (!isMetaKeyPressed) {
      this.element.classList.remove('napkinnote--ctrl-key-active')
    }

    if (event.target === null) {
      return
    }

    const isBackspace = event.key === 'Backspace'
    const isEnter = event.key === 'Enter'
    const isShift = event.shiftKey
    const isShiftEnter = isEnter && isShift

    if ((event.target as HTMLElement).tagName === 'TEXTAREA') {
      const inputTarget = event.target as HTMLTextAreaElement
      const value = inputTarget.value
      const isEmpty = value.length === 0

      if (isBackspace && isEmpty) {
        const previouslyEmpty = this.alreadyEmptyInputs.has(inputTarget)

        if (!previouslyEmpty) {
          this.alreadyEmptyInputs.add(inputTarget)
        } else {
          const emptyDiv = document.createElement('div')
          emptyDiv.appendChild(document.createElement('br'))
          inputTarget.parentElement?.replaceWith(emptyDiv)
          this.setCursorInElement(emptyDiv)
          this.alreadyEmptyInputs.delete(inputTarget)
        }
      } else {
        this.alreadyEmptyInputs.delete(inputTarget)
      }

      if (isShiftEnter) {
        inputTarget.value = value.trim()
        inputTarget.blur()

        const p = document.createElement('p')
        const br = document.createElement('br')
        p.appendChild(br)
        inputTarget.parentElement?.after(p)
        this.setCursorInElement(p)
      }
    }

    try {
      this.formatTextNodes()
      this.formatLinkWidgets()
      this.formatCalculatorWidgets()
    } catch (error) {
      console.error(error)
    }

    this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
  }

  private handleKeydownEvent(event: KeyboardEvent) {
    const isNapkinNote = (event.target as HTMLElement).classList.contains('napkinnote')
    if (!isNapkinNote) {
      return
    }

    const isMetaKeyPressed = event.metaKey || event.ctrlKey
    const isTab = event.key === 'Tab'
    const isEnter = event.key === 'Enter'

    if (isMetaKeyPressed) {
      this.element.classList.add('napkinnote--ctrl-key-active')
    }

    const focusedNode = window.getSelection()?.focusNode
    let cursorTarget: HTMLElement | null = null

    if (focusedNode && focusedNode.nodeType === Node.TEXT_NODE) {
      cursorTarget = focusedNode.parentElement
    } else {
      cursorTarget = focusedNode as HTMLElement | null
    }

    const childNodes = cursorTarget?.childNodes || []
    const hasCheckboxChild =
      childNodes[0] && (childNodes[0] as HTMLInputElement).type === 'checkbox'

    if (isEnter && cursorTarget && hasCheckboxChild) {
      event.preventDefault()

      const hasText = cursorTarget.textContent ? cursorTarget.textContent.trim().length > 0 : false
      if (!hasText) {
        const emptyDiv = document.createElement('div')
        emptyDiv.appendChild(document.createElement('br'))

        if (cursorTarget.classList.contains('napkinnote')) {
          cursorTarget.appendChild(emptyDiv)
        } else {
          cursorTarget.replaceWith(emptyDiv)
        }

        this.setCursorInElement(emptyDiv)
        this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
        return
      }

      const div = document.createElement('div')
      const checkboxInput = this.createCheckboxElement()
      div.appendChild(checkboxInput)
      div.appendChild(document.createTextNode(' '))

      cursorTarget.after(div)

      this.setCursorInElement(div)
      this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
      return
    }

    if (isTab) {
      event.preventDefault()
      const tabNode = document.createTextNode('\t')
      this.insertHTML(tabNode)
      this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
      return
    }

    if (isMetaKeyPressed && event.key === 'k') {
      event.preventDefault()

      const selection = window.getSelection()
      const text = selection?.toString()

      if (!text) {
        return
      }

      const textNode = selection?.anchorNode as Text | HTMLElement
      const textContent = textNode?.textContent || ''

      if (!textNode) {
        return
      }

      this.createLinkWidget(textNode, textContent)
      this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
      return
    }
  }

  private handleClickEvent(event: MouseEvent) {
    const target = event.target

    if (typeof target === 'undefined' || target === null) {
      return
    }

    const isLink = (target as HTMLElement).classList.contains('widget-link')
    if (isLink && (event.metaKey || event.ctrlKey)) {
      const url = (target as HTMLAnchorElement).href
      window.open(url, '_blank')
    }

    const isCheckbox =
      (target as HTMLInputElement).type && (target as HTMLInputElement).type === 'checkbox'
    if (isCheckbox) {
      this.formatCheckboxWidgets()
      this.trigger(NAPKIN_NOTE_EVENTS.ON_UPDATE)
    }
  }

  private getAllTextNodes(node: Node): Text[] {
    const textNodes: Text[] = []
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null)
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text)
    }
    return textNodes
  }

  private formatTextNodes() {
    const textNodes = this.getAllTextNodes(this.element as Node)
    for (const textNode of textNodes) {
      const rawText = textNode.textContent || ''
      const cleanedText = rawText.trim()

      const isCheckbox = this.CHECKBOX_REGEX.test(cleanedText)
      const isBulletList = this.LIST_UNORDERED_REGEX.test(cleanedText)
      const isNumberedList = this.LIST_ORDERED_REGEX.test(cleanedText)
      const isCalculator = this.CALCULATOR_REGEX.test(rawText)

      if (!isCheckbox && !isBulletList && !isNumberedList && !isCalculator) {
        continue
      }

      if (isCheckbox) {
        this.createCheckboxWidget(textNode, rawText)
        continue
      }

      if (isBulletList) {
        this.createUnorderedListWidget(textNode, rawText)
        continue
      }

      if (isNumberedList) {
        this.createOrderedListWidget(textNode, rawText)
        continue
      }

      if (isCalculator) {
        this.createCalculatorWidget(textNode, rawText)
        continue
      }
    }
  }

  private setCursorInElement(element: HTMLElement | null | undefined) {
    if (typeof element === 'undefined' || element === null) {
      return
    }

    this.setCursorAfterElement(element.childNodes[element.childNodes.length - 1] as HTMLElement)
  }

  private setCursorAfterElement(element: Node | null | undefined) {
    if (typeof element === 'undefined' || element === null) {
      return
    }

    const range = document.createRange()
    range.selectNodeContents(element)
    range.collapse(false)

    const selection = window.getSelection()
    selection?.removeAllRanges()
    selection?.addRange(range)
  }

  private insertHTML(element: Node) {
    const range = window.getSelection()?.getRangeAt(0)
    range?.collapse(true)
    range?.insertNode(element)
    this.setCursorAfterElement(element)
  }
}
