import { insertHTMLAtCursor } from './utils/cursor'
import CalculatorWidget from './widgets/calculator'
import ChecklistWidget from './widgets/checklist'
import HeadingsWidget from './widgets/headings'
import LinkWidget from './widgets/link'
import OrderedListWidget from './widgets/orderedList'
import UnorderedListWidget from './widgets/unorderedList'

export const NAPKINNOTE_EVENTS = {
  ON_UPDATE: 'update'
}

export default class NapkinNote {
  element: HTMLElement
  widgets: any[]

  private callbacks: { [key: string]: EventListener[] } = {}

  constructor(element: HTMLElement) {
    this.element = element
    this.widgets = [
      new CalculatorWidget(this),
      new ChecklistWidget(this),
      new HeadingsWidget(this),
      new LinkWidget(this),
      new OrderedListWidget(this),
      new UnorderedListWidget(this)
    ]
    this.loadAllWidgets()
    this.element.addEventListener('keyup', this.handleKeyupEvent.bind(this))
    this.element.addEventListener('keydown', this.handleKeydownEvent.bind(this))
    this.element.addEventListener('click', this.handleClickEvent.bind(this))
    this.element.focus()
  }

  destroy() {
    this.element.removeEventListener('keyup', this.handleKeyupEvent)
    this.element.removeEventListener('keydown', this.handleKeydownEvent)
    this.element.removeEventListener('click', this.handleClickEvent)
  }

  on(event: string, callback: EventListener) {
    if (!Object.values(NAPKINNOTE_EVENTS).includes(event)) {
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

  get htmlContent() {
    return this.element.innerHTML || ''
  }

  set htmlContent(content: string) {
    this.element.innerHTML = content
    this.loadAllWidgets()
  }

  loadAllWidgets() {
    for (const widget of this.widgets) {
      if (widget.load) {
        widget.load()
      }
    }
  }

  handleKeyupEvent(event: KeyboardEvent) {
    const isMetaKeyPressed = event.metaKey || event.ctrlKey
    if (!isMetaKeyPressed) {
      this.element.classList.remove('napkinnote--ctrl-key-active')
    }

    for (const widget of this.widgets) {
      if (widget.onKeyup) {
        widget.onKeyup(event)
      }
    }

    this.trigger(NAPKINNOTE_EVENTS.ON_UPDATE, this.htmlContent)
  }

  handleKeydownEvent(event: KeyboardEvent) {
    const isMetaKeyPressed = event.metaKey || event.ctrlKey
    if (isMetaKeyPressed) {
      this.element.classList.add('napkinnote--ctrl-key-active')
    }

    for (const widget of this.widgets) {
      if (widget.onKeydown) {
        widget.onKeydown(event)
      }
    }

    const isTab = event.key === 'Tab'
    if (isTab) {
      event.preventDefault()
      let isHandled = false

      for (const widget of this.widgets) {
        if (!widget.onTab) {
          continue
        }
        isHandled = widget.onTab(event)
        if (isHandled) {
          break
        }
      }

      if (!isHandled) {
        const tabNode = document.createTextNode('    ')
        insertHTMLAtCursor(tabNode)
      }
    }

    this.trigger(NAPKINNOTE_EVENTS.ON_UPDATE, this.htmlContent)
  }

  handleClickEvent(event: MouseEvent) {
    for (const widget of this.widgets) {
      if (widget.onClick) {
        widget.onClick(event)
      }
    }

    this.trigger(NAPKINNOTE_EVENTS.ON_UPDATE, this.htmlContent)
  }
}
