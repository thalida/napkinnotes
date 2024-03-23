import { flow, makeAutoObservable, reaction } from "mobx"
import { createContext } from "react";
import { updateNote } from "@/api/notes";
import { fetchMe } from "@/api/users";
import { IUser } from "@/types/users";
import { INote } from "@/types/notes";

class CoreStore {
    me: IUser | null = null
    note: INote | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    clearData() {
        this.me = null
        this.note = null
    }

    setNoteContent = (content: string) => {
        if (typeof this.note === 'undefined' || this.note === null) {
            return
        }

        this.note.content = content

        if (this.note.isAnon) {
            localStorage.setItem('x-anon-note', JSON.stringify(this.note))
        }
    }

    initUser = flow(function* (this: CoreStore) {
        const res = yield fetchMe()
        this.me = res.data
        this.note = {
            ...res.data.note,
            isAnon: false
        }
    });

    initAnon() {
        const storedNote = localStorage.getItem('x-anon-note')
        if (storedNote) {
            this.note = JSON.parse(storedNote)
            return;
        }

        const now = new Date()
        this.note = {
            id: `anon-${now.getTime()}`,
            created_at: now.toISOString(),
            updated_at: now.toISOString(),
            content: '',
            isAnon: true
        }
        localStorage.setItem('x-anon-note', JSON.stringify(this.note))
    }

    updateNote = flow(function* (this: CoreStore, id: string, content: string) {
        yield updateNote(id, { content })
    });
}

export const coreStore = new CoreStore();
export const CoreStoreContext = createContext(coreStore);

reaction(() => coreStore.note?.content, (content) => {
    if (coreStore.note === null || coreStore.note.isAnon) {
        return
    }

    coreStore.updateNote(coreStore.note.id, content || '')
}, { delay: 1000 })
