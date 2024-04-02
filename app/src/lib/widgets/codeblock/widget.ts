import './widget.css'

import { getNodesAtCursor, setCursorInElement } from '../../utils/cursor'
import { BaseWidget } from '../BaseWidget'
import hljs from 'highlight.js'
import 'highlight.js/styles/default.min.css'
import 'highlight.js/styles/tokyo-night-dark.min.css'

export default class CodeblockWidget extends BaseWidget {
  START_SYNTAX_REGEX = /^(`{3})(\w*)/
  END_SYNTAX_REGEX = /^(`{3})/
  private alreadyEmptyInputs = new Set<HTMLElement>()

  load(): void {
    const codeblocks = this.napkinnote.element.querySelectorAll(
      '.widget-codeblock'
    ) as NodeListOf<HTMLElement>
    for (const codeblock of codeblocks) {
      const code = codeblock.querySelector('.widget-codeblock__code') as
        | HTMLElement
        | null
        | undefined
      if (!code) {
        continue
      }

      this.highlightOne(code)

      const select = codeblock.querySelector('.widget-codeblock__lang-dropdown') as
        | HTMLSelectElement
        | null
        | undefined
      if (!select) {
        continue
      }

      select.value = code.dataset.language || 'plaintext'
      select.addEventListener('change', this.onLanguageSelectChange.bind(this))
    }
  }

  insert(nodes: HTMLElement[]) {
    const startNode = nodes[0] as HTMLElement
    const endNode = nodes[nodes.length - 1] as HTMLElement
    const innerNodes = nodes.slice(1, nodes.length - 1)

    const langStr = startNode.textContent?.replace(this.START_SYNTAX_REGEX, '$2')
    const language = langStr
      ? hljs.getLanguage(langStr)?.name?.toLowerCase() || 'plaintext'
      : 'plaintext'

    const div = document.createElement('div')

    const widgetWrapper = document.createElement('div')
    widgetWrapper.classList.add('widget', 'widget-codeblock')

    const pre = document.createElement('pre')
    pre.classList.add('widget-codeblock__pre')

    const code = document.createElement('code')
    code.contentEditable = 'plaintext-only'
    code.spellcheck = false
    code.classList.add('widget-codeblock__code', 'hljs', `language-${language}`)
    code.dataset.language = language

    const selectWrapper = document.createElement('div')
    selectWrapper.classList.add('widget-codeblock__lang-dropdown-wrapper')
    selectWrapper.contentEditable = 'false'
    const select = document.createElement('select')
    select.classList.add('widget-codeblock__lang-dropdown')
    const languages = hljs.listLanguages()
    for (const language of languages) {
      const option = document.createElement('option')
      option.value = language
      option.textContent = language
      select.appendChild(option)
    }
    select.value = language
    selectWrapper.appendChild(select)

    for (const node of innerNodes) {
      let text = node.textContent || ''
      text = `${text}\n`
      code.appendChild(document.createTextNode(text))
      node.remove()
    }

    if (code.textContent?.length === 0) {
      code.appendChild(document.createTextNode('\n'))
    }

    pre.appendChild(code)
    widgetWrapper.appendChild(selectWrapper)
    widgetWrapper.appendChild(pre)
    div.appendChild(widgetWrapper)
    startNode.replaceWith(div)
    endNode.remove()
    code.focus()
    setCursorInElement(code)

    select.addEventListener('change', this.onLanguageSelectChange.bind(this))
  }

  highlightOne(code: HTMLElement) {
    code.innerHTML = code.textContent || ''
    delete code.dataset.highlighted
    delete code.dataset.isfocused
    hljs.highlightElement(code)
  }

  highlightAll(exclude?: HTMLElement | null | undefined) {
    const codeElements = this.napkinnote.element.querySelectorAll(
      '.widget-codeblock__code'
    ) as NodeListOf<HTMLElement>
    for (const code of codeElements) {
      if (code === exclude) {
        continue
      }
      this.highlightOne(code)
    }
  }

  onLanguageSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement
    const codeblock = target.closest('.widget-codeblock')
    const code = codeblock?.querySelector('.widget-codeblock__code') as
      | HTMLElement
      | null
      | undefined
    if (!code) {
      return
    }

    const language = target.value
    code.dataset.language = language
    code.className = `widget-codeblock__code language-${language}`
    this.highlightOne(code)
  }

  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement
    const isSelect = target.classList.contains('widget-codeblock__lang-dropdown')
    const codeblock = target.closest('.widget-codeblock')
    const code = codeblock?.querySelector('.widget-codeblock__code') as
      | HTMLElement
      | null
      | undefined

    this.highlightAll(isSelect ? null : code)

    if (isSelect || typeof code === 'undefined' || code === null) {
      return
    }

    const alreadyFocused = code.dataset.isfocused === 'true'
    if (alreadyFocused) {
      return
    }

    const { focusNode, cursorPosition } = getNodesAtCursor()

    const walkCodeTree = document.createTreeWalker(code, NodeFilter.SHOW_TEXT, null)
    const nodes = []
    let nodeIndex = 0
    while (walkCodeTree.nextNode()) {
      if (walkCodeTree.currentNode === focusNode) {
        nodeIndex = nodes.length
      }
      nodes.push(walkCodeTree.currentNode)
    }

    code.innerHTML = code.textContent || ''
    code.dataset.isfocused = 'true'
    delete code.dataset.highlighted

    if (code.firstChild) {
      const range = document.createRange()
      const sel = window.getSelection()
      const numCharsBeforeCursor = nodes
        .slice(0, nodeIndex)
        .reduce((acc, node) => acc + (node.textContent || '').length, 0)
      range.setStart(code.firstChild, numCharsBeforeCursor + (cursorPosition || 0))
      range.collapse(true)
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  }

  onKeyup(event: KeyboardEvent) {
    const { focusNode, cursorTarget } = getNodesAtCursor()
    if (!focusNode || !cursorTarget) {
      return
    }

    const codeblock = cursorTarget.closest('.widget-codeblock')
    if (codeblock) {
      const code = codeblock.querySelector('.widget-codeblock__code') as
        | HTMLElement
        | null
        | undefined
      if (!code) {
        return
      }

      const isShiftEnter = event.key === 'Enter' && event.shiftKey
      if (isShiftEnter) {
        code.textContent = code.textContent?.trim() || ''
        code.blur()
        this.highlightOne(code)

        const div = document.createElement('div')
        const br = document.createElement('br')
        div.appendChild(br)
        codeblock.after(div)
        setCursorInElement(div)
        return
      }

      const isEmpty = code.textContent?.length === 0
      const isBackspace = event.key === 'Backspace'
      if (isBackspace && isEmpty) {
        const previouslyEmpty = this.alreadyEmptyInputs.has(code)
        if (!previouslyEmpty) {
          this.alreadyEmptyInputs.add(code)
        } else {
          const emptyDiv = document.createElement('div')
          emptyDiv.appendChild(document.createElement('br'))
          codeblock.replaceWith(emptyDiv)
          setCursorInElement(emptyDiv)
          this.alreadyEmptyInputs.delete(code)
        }
      } else {
        this.alreadyEmptyInputs.delete(code)
      }
      return
    }

    const isInsertWidget = focusNode
      ? this.END_SYNTAX_REGEX.test(focusNode.textContent || '')
      : false
    if (!isInsertWidget) {
      return
    }

    const parentElement = cursorTarget.parentElement
    if (!parentElement) {
      return
    }

    const fenchedNodes = []
    const walkParentTree = document.createTreeWalker(parentElement, NodeFilter.SHOW_ELEMENT, null)
    let fenceSet = []
    let isInFence = false
    while (walkParentTree.nextNode()) {
      const currentNode = walkParentTree.currentNode as HTMLElement
      const isStartFence = this.START_SYNTAX_REGEX.test(currentNode.textContent || '')
      const isEndFence = this.END_SYNTAX_REGEX.test(currentNode.textContent || '')

      if (isStartFence && !isInFence) {
        isInFence = true
        fenceSet.push(currentNode)
        continue
      }

      if (!isEndFence && isInFence) {
        fenceSet.push(currentNode)
        continue
      }

      if (isEndFence && isInFence) {
        fenceSet.push(currentNode)
        fenchedNodes.push(fenceSet)
        fenceSet = []
        isInFence = false
        continue
      }
    }

    for (let i = 0; i < fenchedNodes.length; i += 1) {
      this.insert(fenchedNodes[i])
    }
  }
}
