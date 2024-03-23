import { useCallback, useContext, useState } from 'react'
import { observer } from 'mobx-react-lite';
import { AuthStoreContext } from '@/store/auth';
import { CoreStoreContext } from '@/store/core';
import LoginDialog from '@/components/LoginDialog';
import Contenteditable from '@/components/Contenteditable';

const IndexPage = observer(() => {
  const authStore = useContext(AuthStoreContext)
  const coreStore = useContext(CoreStoreContext)
  const [isLoginDialogVisible, setIsLoginDialogVisible] = useState(false)

  const handleLoginDialogDismiss = () => {
    setIsLoginDialogVisible(false)
  }

  const handleLogoutButtonClick = useCallback(() => {
    authStore.logout()
    coreStore.clearData()
  }, [authStore, coreStore])

  const handleContentChange = useCallback((content: string) => {
    coreStore.setNoteContent(content)
  }, [coreStore])

  return (
    <div className="flex flex-col py-10 px-4 sm:px-6 lg:px-8">
      {authStore.isAuthenticated ? (
        <button className="mt-4 bg-red-500 text-white font-semibold py-2 px-4 rounded" onClick={handleLogoutButtonClick}>
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

      {coreStore.note && (
        <Contenteditable
          value={coreStore.note?.content || ''}
          onContentChange={handleContentChange}
          style={{ minHeight: '200px', backgroundColor: '#f3f4f6', padding: '10px' }}
        />
      )}

      <LoginDialog isVisible={isLoginDialogVisible} onDismiss={handleLoginDialogDismiss} />
    </div>
  )
});

export default IndexPage;
