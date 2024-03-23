import { flow, makeAutoObservable } from "mobx"
import { createContext } from "react";
import { emailLogin, refreshToken, revokeToken } from "@/api/auth";
import type { IAuthLoginRequest, IAuthTokenResponse } from "@/types/auth";

class AuthStore {
    tokenData: IAuthTokenResponse | null = null;
    isAuthenticated = false;
    isAuthenticating = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true })
    }

    setTokenData(data: IAuthTokenResponse) {
        this.tokenData = data
        localStorage.setItem('x-tokenData', JSON.stringify(data))
        this.isAuthenticating = false
        this.isAuthenticated = true
    }

    getTokenData() {
        const data = localStorage.getItem('x-tokenData')
        if (data) {
            return JSON.parse(data) as IAuthTokenResponse
        }
        return null
    }

    clearTokenData() {
        this.tokenData = null
        localStorage.removeItem('x-tokenData')
        this.isAuthenticating = false
        this.isAuthenticated = false
    }

    logout = flow(function* (this: AuthStore) {
        console.log("Logging out", this)
        const tokenDataCopy = this.tokenData ? { ...this.tokenData } : null
        this.clearTokenData()
        if (tokenDataCopy !== null) {
            yield revokeToken(tokenDataCopy)
        }
    })

    silentLogin = flow(function* (this: AuthStore) {
        this.isAuthenticating = true
        const tokenData = this.getTokenData()
        if (tokenData === null) {
            this.clearTokenData()
            return
        }
        try {
            const res = yield refreshToken(tokenData.refresh_token)
            this.setTokenData(res.data)
        } catch (error) {
            this.clearTokenData()
        }
    })

    loginWithEmail = flow(function* (this: AuthStore, data: IAuthLoginRequest) {
        try {
            const res = yield emailLogin(data)
            this.setTokenData(res.data)
        } catch (error) {
            this.clearTokenData()
            throw error
        }
    })

}

export const authStore = new AuthStore();
export const AuthStoreContext = createContext(authStore);
