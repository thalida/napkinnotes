import { setCursorInElement } from '../utils/cursor'
import { Widget } from '../Widget'

export default class LinkWidget extends Widget {
  load() {
    const linkElements = this.napkinnote.element.querySelectorAll(
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

  update() {
    this.load()
  }

  insert(textNode: Text | HTMLElement, url: string) {
    const gotoLink = document.createElement('a')
    gotoLink.classList.add('widget', 'widget-link')
    gotoLink.href = url
    gotoLink.target = '_blank'
    gotoLink.textContent = url

    textNode.replaceWith(gotoLink)
    setCursorInElement(gotoLink)
  }

  onKeyup() {
    this.update()
  }

  onKeydown(event: KeyboardEvent) {
    const isMetaKeyPressed = event.metaKey || event.ctrlKey

    if (!isMetaKeyPressed || event.key !== 'k') {
      return
    }

    const selection = window.getSelection()

    const text = selection?.toString()
    if (!text) {
      return
    }

    const textNode = selection?.anchorNode as Text | HTMLElement
    if (!textNode) {
      return
    }

    event.preventDefault()
    const textContent = textNode?.textContent || ''
    this.insert(textNode, textContent)
  }

  onClick(event: MouseEvent) {
    const target = event.target

    if (typeof target === 'undefined' || target === null) {
      return
    }

    const isLink = (target as HTMLElement).classList.contains('widget-link')
    if (isLink && (event.metaKey || event.ctrlKey)) {
      const url = (target as HTMLAnchorElement).href
      window.open(url, '_blank')
    }
  }
}
