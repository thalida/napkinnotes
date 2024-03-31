import './widget.css'
import { BaseWidget } from '../BaseWidget'
import { getNodesAtCursor, setCursorInElement } from '../../utils/cursor'

export default class CalculatorWidget extends BaseWidget {
  SYNTAX_REGEX = /^(\$\s)(.*)/
  private CALCULATOR_NEEDS_VAR_DEF_REGEX = /^\s*?([\w]*)\s*?=/
  private CALCULAOTR_VARIABLE_REGEX = /^(let|const|var)?\s*?([\w]*)\s*?=/
  private alreadyEmptyInputs = new Set<HTMLElement>()

  insert(textNode: Text, text: string) {
    const widget = document.createElement('div')
    widget.classList.add('widget', 'widget-calculator')
    widget.contentEditable = 'false'

    const textarea = document.createElement('textarea')
    textarea.className = 'widget-calculator__input'
    textarea.wrap = 'soft'
    textarea.autocomplete = 'off'
    textarea.autocapitalize = 'off'
    textarea.value = text.replace(this.SYNTAX_REGEX, '$2')
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

  load() {
    const calculatorElements = this.napkinnote.element.querySelectorAll('.widget-calculator')
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

  update() {
    const calculatorElements = this.napkinnote.element.querySelectorAll('.widget-calculator')
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

  onKeyup(event: KeyboardEvent) {
    if (event.target === null) {
      return
    }

    const { focusNode } = getNodesAtCursor()
    const isInsertCalculator = focusNode
      ? this.SYNTAX_REGEX.test(focusNode.textContent || '')
      : false
    const isTextArea = (event.target as HTMLElement).tagName === 'TEXTAREA'
    if (!isTextArea && !isInsertCalculator) {
      return
    }

    if (focusNode && isInsertCalculator) {
      this.insert(focusNode as Text, focusNode.textContent || '')
      return
    }

    const inputTarget = event.target as HTMLTextAreaElement
    const value = inputTarget.value
    const isShiftEnter = event.key === 'Enter' && event.shiftKey
    if (isShiftEnter) {
      inputTarget.value = value.trim()
      inputTarget.blur()

      const p = document.createElement('p')
      const br = document.createElement('br')
      p.appendChild(br)
      inputTarget.parentElement?.after(p)
      setCursorInElement(p)
      return
    }

    const isEmpty = value.length === 0
    const isBackspace = event.key === 'Backspace'
    if (isBackspace && isEmpty) {
      const previouslyEmpty = this.alreadyEmptyInputs.has(inputTarget)
      if (!previouslyEmpty) {
        this.alreadyEmptyInputs.add(inputTarget)
      } else {
        const emptyDiv = document.createElement('div')
        emptyDiv.appendChild(document.createElement('br'))
        inputTarget.parentElement?.replaceWith(emptyDiv)
        setCursorInElement(emptyDiv)
        this.alreadyEmptyInputs.delete(inputTarget)
      }
    } else {
      this.alreadyEmptyInputs.delete(inputTarget)
    }

    this.update()
    return
  }
}
