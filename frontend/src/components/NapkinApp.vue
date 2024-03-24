<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { throttle } from 'lodash'
import { useCoreStore } from '@/stores/core';

const coreStore = useCoreStore()
const contentEditableRef = ref<HTMLDivElement | null>(null)
const htmlContent = ref(coreStore.note?.content)

const throttledUpdate = throttle(coreStore.updateNote, 1000)

onMounted(() => {
  contentEditableRef.value?.focus()
  parseWidgets()
})

function parseWidgets() {
  const inputElements = contentEditableRef.value?.querySelectorAll("input");
  if (inputElements) {
    for (const inputElement of inputElements) {
      const isCheckbox = inputElement.type === "checkbox";
      if (isCheckbox) {
        inputElement.checked = inputElement.value === "true";
      }
    }
  }

  const linkElements = contentEditableRef.value?.querySelectorAll(".widget-link");
  if (linkElements) {
    for (const linkElement of linkElements) {
      const gotoLink = linkElement.querySelector(".widget-link__action") as HTMLAnchorElement;
      const gotoLinkText = linkElement.querySelector(".widget-link__text") as HTMLElement;

      if (!gotoLink || !gotoLinkText) {
        continue;
      }

      gotoLink.href = gotoLinkText.textContent || "";
    }
  }
}


function save() {
  coreStore.setNoteContent(contentEditableRef.value?.innerHTML || "")
  parseWidgets()
  throttledUpdate()
}

function getAllTextNodes(node: Node): Text[] {
  const textNodes: Text[] = [];
  const walker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null);
  while (walker.nextNode()) {
    textNodes.push(walker.currentNode as Text);
  }
  return textNodes;
}

function insertHTML(element: HTMLElement) {
  const range = window.getSelection()?.getRangeAt(0);
  range?.collapse(true);
  range?.insertNode(element);
  setCursorAfterElement(element);
  save();
}

function setCursorAfterElement(element: HTMLElement) {
  console.log(element);

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);

  const selection = window.getSelection();
  selection?.removeAllRanges();
  selection?.addRange(range);
}

const checkboxRegex = /^(-\s\[[\sx]?\])(.*)/
const isCheckedRegex = /^-\s\[[x]\]/
const bulletListRegex = /^([*-]\s)([^[].*)/
const numberedListRegex = /^([1]+\.\s)(.*)/

async function handleInput(event: Event) {
  event.preventDefault();
  event.stopPropagation();

  const textNodes = getAllTextNodes(contentEditableRef.value as Node);

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";

    const isCheckbox = checkboxRegex.test(text);
    const isBulletList = bulletListRegex.test(text);
    const isNumberedList = numberedListRegex.test(text);

    if (!isCheckbox && !isBulletList && !isNumberedList) {
      continue;
    }

    if (isCheckbox) {
      const inputText = text.replace(checkboxRegex, "$2")
      const input = document.createElement("input");

      input.classList.add("widget", "widget-checkbox");
      input.type = "checkbox";
      input.checked = isCheckedRegex.test(text);
      input.value = input.checked ? "true" : "false";

      const div = document.createElement("div");
      div.appendChild(input);
      div.insertAdjacentHTML("beforeend", "&nbsp;");
      div.appendChild(document.createTextNode(inputText));
      textNode.replaceWith(div);
      setCursorAfterElement(div);
      continue;
    }

    if (isBulletList) {
      const ul = document.createElement("ul");
      const li = document.createElement("li");
      li.textContent = text.slice(2) || " ";
      ul.appendChild(li);

      const div = document.createElement("div");
      div.appendChild(ul);
      textNode.replaceWith(div);
      setCursorAfterElement(div);
      continue;
    }

    if (isNumberedList) {
      const ol = document.createElement("ol");
      const li = document.createElement("li");
      li.textContent = text.slice(3) || " ";
      ol.appendChild(li);

      const div = document.createElement("div");
      div.appendChild(ol);
      textNode.replaceWith(div);
      setCursorAfterElement(div);
      continue;
    }
  }

  save();
}

function handleClick(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (target.tagName === "INPUT") {
    const input = target as HTMLInputElement;
    input.value = input.checked ? "true" : "false";
    save();
  }
}

function handlePaste(event: ClipboardEvent) {
  if (!event.clipboardData) {
    return;
  }

  const text = event.clipboardData.getData("text/plain");
  const isLink = text.startsWith("http://") || text.startsWith("https://");

  if (!isLink) {
    return;
  }

  event.preventDefault();

  const widget = document.createElement("span");
  widget.classList.add("widget", "widget-link");

  const spanLinkText = document.createElement("span");
  spanLinkText.classList.add("widget-link__text");
  spanLinkText.textContent = text;

  const gotoLink = document.createElement("a");
  gotoLink.classList.add("widget-link__action");
  gotoLink.contentEditable = "false";
  gotoLink.href = text;
  gotoLink.target = "_blank";
  gotoLink.textContent = "[⤴︎]";

  widget.appendChild(spanLinkText);
  widget.appendChild(document.createTextNode(" "));
  widget.appendChild(gotoLink);

  const row = document.createElement("div");
  row.appendChild(widget);

  insertHTML(widget);
}
</script>

<template>
  <div
    class="bg-white p-2 prose w-full max-w-full"
    style="min-height: 100px;"
    ref="contentEditableRef"
    contenteditable="true"
    v-html="htmlContent"
    @input="handleInput"
    @click="handleClick"
    @paste="handlePaste"
  />
</template>

<style scoped>
</style>
