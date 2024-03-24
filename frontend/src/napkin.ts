export const NAPKIN_EVENTS = {
  ON_UPDATE: "update",
};

export default class Napkin {
  element: HTMLElement

  private callbacks: { [key: string]: EventListener[] } = {}

  private CHECKBOX_REGEX = /^(-\s\[[\sx]?\])(.*)/
  private IS_CHECKED_REGEX = /^-\s\[[x]\]/
  private LIST_UNORDERED_REGEX = /^([*-]\s)([^[].*)/
  private LIST_ORDERED_REGEX = /^([1]+\.\s)(.*)/
  private CALCULATOR_REGEX = /^(\$\s)(.*)/

  constructor(element: HTMLElement) {
    this.element = element

    this.loadCheckboxWidgets()
    this.loadCalculatorWidgets()

    this.element.addEventListener("onpaste", (event) => this.handlePasteEvent(event as ClipboardEvent))
    this.element.addEventListener("input", (event) => this.handleInputEvent(event as InputEvent))
    this.element.addEventListener("click", (event) => this.handleClickEvent(event as MouseEvent))

    this.element.focus()
  }

  get htmlContent() {
    return this.element.innerHTML || ""
  }

  on(event: string, callback: EventListener) {
    if (!Object.values(NAPKIN_EVENTS).includes(event)) {
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
    const div = document.createElement("div");
    div.classList.add("widget", "widget-calculator");

    const input = document.createElement("input");
    input.className = "widget-calculator__input";
    input.type = "text";
    input.value = text.replace(this.CALCULATOR_REGEX, "$2");

    const output = document.createElement("output");
    output.className = "widget-calculator__output";
    output.textContent = "";

    div.appendChild(input);
    div.appendChild(output);

    textNode.replaceWith(div);
    this.setCursorAfterElement(div);
  }

  loadCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll(".widget-calculator");
    if (!calculatorElements) {
      return;
    }

    for (const calculator of calculatorElements) {
      const input = calculator.querySelector(".widget-calculator__input") as HTMLInputElement;
      input.value = input.dataset.value || "";
    }
  }

  formatCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll(".widget-calculator");
    if (!calculatorElements) {
      return;
    }

    const inputHistory = []
    for (const calculator of calculatorElements) {
      const input = calculator.querySelector(".widget-calculator__input") as HTMLInputElement;
      const output = calculator.querySelector(".widget-calculator__output") as HTMLOutputElement;

      if (!input || !output) {
        continue;
      }

      input.dataset.value = input.value;

      if (input.value.trim() === "") {
        output.textContent = "";
        continue;
      }

      inputHistory.push(input.value);

      try {
        const result = eval(inputHistory.join(";"));
        output.textContent = result;
      } catch (error) {
        inputHistory.pop();
        output.textContent = "";
      }
    }
  }

  createUnorderedListWidget(textNode: Text, text: string) {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.textContent = text.slice(2) || " ";
    ul.appendChild(li);

    const div = document.createElement("div");
    div.appendChild(ul);
    textNode.replaceWith(div);
    this.setCursorAfterElement(div);
  }

  createOrderedListWidget(textNode: Text, text: string) {
    const ol = document.createElement("ol");
    const li = document.createElement("li");
    li.textContent = text.slice(3) || " ";
    ol.appendChild(li);

    const div = document.createElement("div");
    div.appendChild(ol);
    textNode.replaceWith(div);
    this.setCursorAfterElement(div);
  }

  createLinkWidget(url: string) {
    const widget = document.createElement("span");
    widget.classList.add("widget", "widget-link");

    const spanLinkText = document.createElement("span");
    spanLinkText.classList.add("widget-link__text");
    spanLinkText.textContent = url;

    const gotoLink = document.createElement("a");
    gotoLink.classList.add("widget-link__action");
    gotoLink.contentEditable = "false";
    gotoLink.href = url;
    gotoLink.target = "_blank";
    gotoLink.textContent = "[⤴︎]";

    widget.appendChild(spanLinkText);
    widget.appendChild(document.createTextNode(" "));
    widget.appendChild(gotoLink);

    const row = document.createElement("div");
    row.appendChild(widget);

    this.insertHTML(row);
  }

  loadCheckboxWidgets() {
    const checkboxElements = this.element.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    if (!checkboxElements) {
      return;
    }

    for (const checkbox of checkboxElements) {
      checkbox.checked = checkbox.value === "true";
    }
  }

  formatLinkWidgets() {
    const linkElements = this.element.querySelectorAll(".widget-link");

    if (!linkElements) {
      return;
    }

    for (const linkElement of linkElements) {
      const gotoLink = linkElement.querySelector(".widget-link__action") as HTMLAnchorElement;
      const gotoLinkText = linkElement.querySelector(".widget-link__text") as HTMLElement;

      if (!gotoLink || !gotoLinkText) {
        continue;
      }

      gotoLink.href = gotoLinkText.textContent || "";
    }
  }

  createCheckboxWidget(textNode: Text, text: string) {
    const inputText = text.replace(this.CHECKBOX_REGEX, "$2")
    const input = document.createElement("input");

    input.classList.add("widget", "widget-checkbox");
    input.type = "checkbox";
    input.checked = this.IS_CHECKED_REGEX.test(text);
    input.value = input.checked ? "true" : "false";

    const div = document.createElement("div");
    div.appendChild(input);
    div.insertAdjacentHTML("beforeend", "&nbsp;");
    div.appendChild(document.createTextNode(inputText));
    textNode.replaceWith(div);
    this.setCursorAfterElement(div);
  }

  formatCheckboxWidgets() {
    const checkboxElements = this.element.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    if (!checkboxElements) {
      return;
    }

    for (const checkbox of checkboxElements) {
      checkbox.value = checkbox.checked ? "true" : "false";
    }
  }

  private handleInputEvent(event: InputEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.formatTextNodes();
    this.formatLinkWidgets();
    this.formatCalculatorWidgets();
    this.trigger(NAPKIN_EVENTS.ON_UPDATE);
  }

  private handleClickEvent(event: MouseEvent) {
    const target = event.target

    if (typeof target === "undefined" || target === null) {
      return
    }

    const isCheckbox = (target as HTMLInputElement).type && (target as HTMLInputElement).type === "checkbox";
    if (!isCheckbox) {
      return;
    }

    this.formatCheckboxWidgets();
    this.trigger(NAPKIN_EVENTS.ON_UPDATE);
  }

  private handlePasteEvent(event: ClipboardEvent) {
    if (!event.clipboardData) {
      return;
    }

    const text = event.clipboardData.getData("text/plain");
    const isLink = text.startsWith("http://") || text.startsWith("https://");

    if (!isLink) {
      return;
    }

    event.preventDefault();
    this.createLinkWidget(text);
    this.trigger(NAPKIN_EVENTS.ON_UPDATE);
  }

  private getAllTextNodes(node: Node): Text[] {
    const textNodes: Text[] = [];
    const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
    while (walker.nextNode()) {
      textNodes.push(walker.currentNode as Text);
    }
    return textNodes;
  }

  private formatTextNodes() {
    const textNodes = this.getAllTextNodes(this.element as Node);
    for (const textNode of textNodes) {
      const text = textNode.textContent || "";

      const isCheckbox = this.CHECKBOX_REGEX.test(text);
      const isBulletList = this.LIST_UNORDERED_REGEX.test(text);
      const isNumberedList = this.LIST_ORDERED_REGEX.test(text);
      const isCalculator = this.CALCULATOR_REGEX.test(text);

      if (!isCheckbox && !isBulletList && !isNumberedList && !isCalculator) {
        continue;
      }

      if (isCheckbox) {
        this.createCheckboxWidget(textNode, text);
        continue;
      }

      if (isBulletList) {
        this.createUnorderedListWidget(textNode, text);
        continue;
      }

      if (isNumberedList) {
        this.createOrderedListWidget(textNode, text);
        continue;
      }

      if (isCalculator) {
        this.createCalculatorWidget(textNode, text);
        continue;
      }
    }
  }

  private insertHTML(element: HTMLElement) {
    const range = window.getSelection()?.getRangeAt(0);
    range?.collapse(true);
    range?.insertNode(element);
    this.setCursorAfterElement(element);
  }

  private setCursorAfterElement(element: HTMLElement | null | undefined) {
    if (typeof element === "undefined" || element === null) {
      return;
    }

    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);

    const selection = window.getSelection();
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}
