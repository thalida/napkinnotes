export interface Widget {
  onKeyup?(event: KeyboardEvent): void
  onKeydown?(event: KeyboardEvent): void
  onClick?(event: MouseEvent): void
  onTab?(event: KeyboardEvent): boolean
}

export abstract class Widget {
  $napkinnote: HTMLElement

  SYNTAX_REGEX: RegExp | null = null

  constructor($napkinnote: HTMLElement) {
    this.$napkinnote = $napkinnote
  }

  abstract load(): void
  abstract update(): void
  abstract insert(textNode: Text, text: string): void
}
