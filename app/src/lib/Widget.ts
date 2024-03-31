import type NapkinNote from './NapkinNote'

export interface Widget {
  load?(): void
  update?(): void
  onKeyup?(event: KeyboardEvent): void
  onKeydown?(event: KeyboardEvent): void
  onClick?(event: MouseEvent): void
  onTab?(event: KeyboardEvent): boolean
}

export abstract class Widget {
  napkinnote: NapkinNote

  SYNTAX_REGEX: RegExp | null = null

  constructor(napkinnote: NapkinNote) {
    this.napkinnote = napkinnote
  }

  abstract insert(textNode: Text, text: string): void
}
