import { useContext, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '@/store/auth';
import { CoreStoreContext } from '@/store/core';
import LoginDialog from '@/components/LoginDialog';

const IndexPage = observer(() => {
  const authStore = useContext(AuthStoreContext)
  const coreStore = useContext(CoreStoreContext)

  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)

  const handleLoginDialogDismiss = () => {
    setIsLoginDialogVisible(false)
  }

  return (
    <div className="flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      {authStore.isAuthenticated ? (
        <button className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded" onClick={authStore.logout}>
          Logout
        </button>
      ) : (
        <button
          className="mt-4 bg-indigo-500 text-white font-semibold py-2 px-4 rounded"
          onClick={() => setIsLoginDialogVisible(true)}
        >
          Show Login Dialog
        </button>
      )}

      <LoginDialog isVisible={isLoginDialogVisible} onDismiss={handleLoginDialogDismiss} />
    </div>
  )
});

export default IndexPage;
