import './widget.css'

import { getNodesAtCursor, setCursorAtPosition, setCursorInElement } from '../../utils/cursor'
import { BaseWidget } from '../BaseWidget'

export default class CodeblockWidget extends BaseWidget {
  START_SYNTAX_REGEX = /^(`{3})(\w*)/
  END_SYNTAX_REGEX = /^(`{3})/

  insert(nodes: HTMLElement[]) {
    const startNode = nodes[0] as HTMLElement
    const endNode = nodes[nodes.length - 1] as HTMLElement
    const innerNodes = nodes.slice(1, nodes.length - 1)

    const lang = startNode.textContent?.replace(this.START_SYNTAX_REGEX, '$2') || 'plaintext'

    const div = document.createElement('div')
    const pre = document.createElement('pre')
    pre.classList.add('widget', 'widget-codeblock')

    const code = document.createElement('code')
    code.contentEditable = 'plaintext-only'
    code.spellcheck = false
    code.classList.add('language-' + lang)

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
    div.appendChild(pre)
    startNode.replaceWith(div)
    endNode.remove()
    setCursorInElement(code)
  }

  onKeyup() {
    const { focusNode, cursorTarget } = getNodesAtCursor()
    if (!focusNode || !cursorTarget) {
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

  onKeydown(event: KeyboardEvent): void {
    const isEnter = event.key === 'Enter'

    if (!isEnter) {
      return
    }

    const { focusNode, cursorTarget, cursorPosition } = getNodesAtCursor()
    if (!focusNode || !cursorTarget) {
      return
    }

    const codeblock = cursorTarget.closest('.widget-codeblock')
    if (!codeblock) {
      return
    }

    event.preventDefault()

    const pos = cursorPosition || 0
    const length = cursorTarget.textContent?.length || 1
    const isAtEnd = pos === length - 1

    if (isAtEnd) {
      const div = document.createElement('div')
      div.append(document.createElement('br'))
      codeblock.after(div)
      setCursorInElement(div)
      return
    }

    const text = cursorTarget.textContent || ''
    const textBeforeCursor = text.slice(0, pos)
    const textAfterCursor = text.slice(pos)
    cursorTarget.textContent = textBeforeCursor + '\n' + textAfterCursor
    setCursorAtPosition(cursorTarget, pos + 1)
  }
}
