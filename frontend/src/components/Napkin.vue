<script setup lang="ts">
import { ref } from 'vue'

const contentEditableRef = ref<HTMLDivElement | null>(null)
const props = defineProps({
  content: String,
  onContentChange: Function,
})

// function handleClick(event) {
//   const target = event.target as HTMLElement;
//   if (target.tagName === "INPUT") {
//     console.log("input clicked");
//     const input = target as HTMLInputElement;
//     const refInput = contentEditableRef.value?.querySelector(`#${input.id}`) as HTMLInputElement;
//     refInput.checked = !refInput.checked;
//     refInput.value = refInput.checked ? "true" : "false";
//     refInput.focus();
//     console.log(refInput.checked, refInput.value);

//     // input.checked = input.checked ? false : true;
//     // console.log(input.checked)
//     // input.value = input.checked ? "true" : "false";
//     // input.focus();
//     event.preventDefault();

//     props.onContentChange?(contentEditableRef.value?.innerHTML)
//   }
// }

async function handleInput(event) {
  event.preventDefault();
  event.stopPropagation();

  const nodes = Array.from((event.target as HTMLDivElement).childNodes);

  const textNodes: Text[] = [];
  for (const node of nodes) {
    const isTextNode = node.nodeType === Node.TEXT_NODE;
    if (isTextNode) {
      textNodes.push(node as Text);
    } else {
      const divChildren = Array.from((node as HTMLDivElement).childNodes);
      for (const divChild of divChildren) {
        if (divChild.nodeType === Node.TEXT_NODE) {
          textNodes.push(divChild as Text);
        }
      }
    }
  }

  for (const textNode of textNodes) {
    const text = textNode.textContent || "";

    const isCheckbox = text.startsWith("- [ ]") || text.startsWith("- [x]");
    if (isCheckbox) {
      const isChecked = text.startsWith("- [x]");
      const input = document.createElement("input");
      const now = new Date();
      input.id = `checkbox-${now.getTime()}`;
      input.type = "checkbox";
      input.checked = isChecked;
      input.value = isChecked ? "true" : "false";

      const div = document.createElement("div");
      div.appendChild(input);
      div.appendChild(document.createTextNode(" " + text.slice(6)));
      textNode.replaceWith(div);
    }
  }


  if (props.onContentChange) {
    props.onContentChange((event.target as HTMLDivElement).innerHTML || "");
  }
}

// function handlePaste(event) {
//   event.preventDefault();
//   const text = event.clipboardData.getData("text/plain");
//   document.execCommand("insertText", false, text);
// }
</script>

<template>
  <div
    ref="contentEditableRef"
    contenteditable="true"
    v-html="props.content"
    @input="handleInput"
  />
</template>

<style scoped>
</style>
