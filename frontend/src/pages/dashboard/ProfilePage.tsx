import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';
import { UsersStoreContext } from '@/store/users';

const ProfilePage = observer(() => {
  const usersStore = useContext(UsersStoreContext)

  return (
    <div className="flex flex-col">
      <div className="flex flex-row items-center space-x-5 py-10 px-4 sm:px-6 lg:px-8 bg-slate-200 dark:bg-slate-950">
        <div className="flex-shrink-0">
          <div>
            <span className="inline-flex h-16 w-16 rounded-full items-center justify-center bg-gray-500 ring-4 ring-white dark:bg-gray-800 dark:ring-slate-600">
              <span className="text-xl font-medium leading-none text-white">{usersStore.me?.initials}</span>
            </span>
          </div>
        </div>
        <div className="pt-1.5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{usersStore.me?.display_name}</h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-500">
            {usersStore.me?.email}
          </p>
        </div>
      </div>
      <div className="flex flex-col py-10 px-4 sm:px-6 lg:px-8 text-gray-900 dark:text-white">
        Page content goes here
      </div>
    </div>
  )
});

export default ProfilePage;
