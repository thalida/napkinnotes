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
  private CALCULATOR_NEEDS_VAR_DEF_REGEX = /^\s*?([\w]*)\s*?=/
  private CALCULAOTR_VARIABLE_REGEX = /^(let|const|var)?\s*?([\w]*)\s*?=/

  private alreadyEmptyInputs = new Set<HTMLElement>();

  private isMetaKeyPressed = false;

  constructor(element: HTMLElement) {
    this.element = element

    try {
      this.loadCheckboxWidgets()
      this.loadCalculatorWidgets()
    } catch (error) {
      console.error(error)
    }

    document.execCommand('defaultParagraphSeparator', false, 'p');

    this.element.addEventListener("paste", (event) => this.handlePasteEvent(event as ClipboardEvent))
    this.element.addEventListener("keyup", (event) => this.handleKeyupEvent(event as KeyboardEvent))
    this.element.addEventListener("keydown", (event) => this.handleKeydownEvent(event as KeyboardEvent))
    this.element.addEventListener("click", (event) => this.handleClickEvent(event as MouseEvent))

    this.element.focus()
  }

  get htmlContent() {
    return this.element.innerHTML || ""
  }

  destroy() {
    this.element.removeEventListener("paste", (event) => this.handlePasteEvent(event as ClipboardEvent))
    this.element.removeEventListener("keyup", (event) => this.handleKeyupEvent(event as KeyboardEvent))
    this.element.removeEventListener("keydown", (event) => this.handleKeydownEvent(event as KeyboardEvent))
    this.element.removeEventListener("click", (event) => this.handleClickEvent(event as MouseEvent))
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
    const widget = document.createElement("div");
    widget.classList.add("widget", "widget-calculator");
    widget.contentEditable = "false";

    const input = document.createElement("textarea");
    input.className = "widget-calculator__input";
    input.wrap = "soft";
    input.autocomplete = "off";
    input.autocapitalize = "off";
    input.rows = 1;
    input.value = text.replace(this.CALCULATOR_REGEX, "$2");
    input.placeholder = "Enter a math expression";
    input.dataset.value = input.value;

    const output = document.createElement("output");
    output.className = "widget-calculator__output";
    output.contentEditable = "false";
    output.textContent = "";

    widget.appendChild(input);
    widget.appendChild(output);
    textNode.replaceWith(widget);

    input.focus();
  }

  loadCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll(".widget-calculator");
    if (!calculatorElements) {
      return;
    }

    for (const calculator of calculatorElements) {
      const input = calculator.querySelector(".widget-calculator__input") as HTMLInputElement;

      if (!input) {
        continue;
      }

      input.value = input.dataset.value || "";
      input.placeholder = "Enter a math expression";
    }
  }

  formatCalculatorWidgets() {
    const calculatorElements = this.element.querySelectorAll(".widget-calculator");
    if (!calculatorElements) {
      return;
    }

    const inputHistory: string[] = [];

    function evalInput(inputString: string, variableName: string): { success: boolean, result: any, error: any } {
      inputHistory.push(inputString);

      let evalString = `'use strict'; ${inputHistory.join(";")}`
      evalString = variableName ? `${evalString};${variableName}` : evalString;

      try {
        const result = eval?.(evalString);
        return { success: true, result, error: null };
      } catch (error) {
        inputHistory.pop();
        return { success: false, result: null, error };
      }
    }

    for (const calculator of calculatorElements) {
      const input = calculator.querySelector(".widget-calculator__input") as HTMLTextAreaElement;
      const output = calculator.querySelector(".widget-calculator__output") as HTMLElement;

      if (!input || !output) {
        continue;
      }

      input.dataset.value = input.value;

      let inputValue = input.value.trim();

      const hasValue = inputValue.length > 0;
      let evalRes: { success: boolean, result: any, error: any } | null = null;

      if (hasValue) {
        const isVariableWithoutDeclaration = this.CALCULATOR_NEEDS_VAR_DEF_REGEX.test(inputValue);
        if (isVariableWithoutDeclaration) {
          inputValue = `var ${input.value}`;
        }

        const matches = inputValue.match(this.CALCULAOTR_VARIABLE_REGEX);
        const variableName = matches ? matches[2] : "";
        evalRes = evalInput(inputValue, variableName);
      }

      output.textContent = evalRes ? evalRes.result : "";

      if (!hasValue) {
        calculator.classList.add("widget-calculator--empty");
        calculator.classList.remove("widget-calculator--success", "widget-calculator--error");
      } else {
        if (evalRes?.error) {
          calculator.classList.add("widget-calculator--error");
          calculator.classList.remove("widget-calculator--empty", "widget-calculator--success");
        } else {
          calculator.classList.add("widget-calculator--success");
          calculator.classList.remove("widget-calculator--empty", "widget-calculator--error");
        }
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

  createLinkWidget(textNode: Text, url: string) {
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
    gotoLink.textContent = "⤴︎";

    widget.appendChild(spanLinkText);
    widget.appendChild(gotoLink);

    textNode.replaceWith(widget);
    this.setCursorAfterElement(widget);
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
    div.appendChild(document.createTextNode(inputText));

    textNode.replaceWith(div);

    this.setCursorAfterElement(div);
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

  formatCheckboxWidgets() {
    const checkboxElements = this.element.querySelectorAll("input[type=checkbox]") as NodeListOf<HTMLInputElement>;
    if (!checkboxElements) {
      return;
    }

    for (const checkbox of checkboxElements) {
      checkbox.value = checkbox.checked ? "true" : "false";
    }
  }

  private handleKeyupEvent(event: KeyboardEvent) {
    const isInputElement = (event.target as HTMLElement).tagName === "INPUT" || (event.target as HTMLElement).tagName === "TEXTAREA";
    if (isInputElement) {
      const isBackspace = event.key === "Backspace";
      const isEnter = event.key === "Enter";
      const value = (event.target as HTMLInputElement).value;
      const isEmpty = value.length === 0;

      if (isBackspace && isEmpty) {
        const previouslyEmpty = this.alreadyEmptyInputs.has(event.target as HTMLElement);

        if (previouslyEmpty) {
          (event.target as HTMLElement).parentElement?.remove();
          this.alreadyEmptyInputs.delete(event.target as HTMLElement);
        } else {
          this.alreadyEmptyInputs.add(event.target as HTMLElement);
        }
      } else {
        this.alreadyEmptyInputs.delete(event.target as HTMLElement);
      }

      if (isEnter) {
        (event.target as HTMLInputElement).value = value.trim();

        (event.target as HTMLElement).blur();
        const p = document.createElement("p");
        const br = document.createElement("br");
        p.appendChild(br);
        (event.target as HTMLElement).parentElement?.after(p);
        this.setCursorAfterElement(p);
      }
    }

    try {
      this.formatTextNodes();
      this.formatLinkWidgets();
      this.formatCalculatorWidgets();
    } catch (error) {
      console.error(error);
    }

    this.trigger(NAPKIN_EVENTS.ON_UPDATE);
  }

  private handleKeydownEvent(event: KeyboardEvent) {
    this.isMetaKeyPressed = event.metaKey || event.ctrlKey;
    const isK = event.key === "k";

    if (!this.isMetaKeyPressed || !isK) {
      return;
    }

    event.preventDefault();
    const selection = window.getSelection();
    const text = selection?.toString();

    if (!text) {
      return;
    }

    const textNode = selection?.anchorNode as Text;
    const textContent = textNode.textContent || "";

    if (!textNode) {
      return;
    }

    this.createLinkWidget(textNode, textContent);
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
