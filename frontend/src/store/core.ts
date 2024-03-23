import { flow, makeAutoObservable } from "mobx"
import { createContext } from "react";
import { updateNote } from "@/api/notes";
import { fetchMe } from "@/api/users";
import { INote } from "@/types/notes";
import { IUser } from "@/types/users";

class CoreStore {

    me: IUser | null = null

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    get note() {
        return this.me?.note
    }

    clearData() {
        this.me = null
    }

    setMe = (data: IUser) => {
        this.me = data
    }

    fetchMe = flow(function* (this: CoreStore) {
        const res = yield fetchMe()
        this.setMe(res.data)
    })

    updateNote = flow(function* (this: CoreStore, note: INote) {
        yield updateNote(note)
    });
}

export const coreStore = new CoreStore();
export const CoreStoreContext = createContext(coreStore);
