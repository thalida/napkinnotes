import { INote } from "./notes"

export interface IUser {
    id: string
    email: string
    first_name: string
    last_name: string
    display_name: string
    initials: string
    note: INote
}
