import { useContext, useEffect, useState } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from './store/auth';
import { CoreStoreContext } from './store/core';
import { UIStoreContext } from './store/ui';
import NotFoundPage from './pages/NotFoundPage';
import IndexPage from './pages/IndexPage';

const App = observer(() => {

    const authStore = useContext(AuthStoreContext)
    const coreStore = useContext(CoreStoreContext)
    const uiStore = useContext(UIStoreContext)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        uiStore.initTheme()
    }, [uiStore])

    useEffect(() => {
        async function silentLogin() {
            try {
                await authStore.silentLogin()
            } catch (error) {
                console.error(error)
            } finally {
                setIsLoading(false)
            }
        }
        silentLogin()
    }, [authStore])

    useEffect(() => {
        if (authStore.isAuthenticated) {
            coreStore.fetchMe()
        } else {
            coreStore.clearData()
        }
    }, [authStore, authStore.isAuthenticated, coreStore])


    if (isLoading || authStore.isAuthenticating) {
        return (
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                <h1>...</h1>
            </div>
        )
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="*"
                    element={<NotFoundPage />}
                />
                <Route
                    path={"/"}
                    element={<IndexPage />}
                />
            </Routes>
        </BrowserRouter>
    );
})

export default App;
