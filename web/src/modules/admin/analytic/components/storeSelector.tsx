import { memo, useState, useEffect } from 'react'

import { collection, onSnapshot } from 'firebase/firestore'
import { getFirestoreInstance } from '../../../../core/services/getFirestoreInstance'

import { classNames } from '../../../../core/services/classNames'

import { Store } from '../../../../core/@types/firebase/Store'

interface Props {
  onSelect?(storeId: string): void
}

export const StoreSelector = memo<Props>(props => {
  const { onSelect = () => {} } = props

  const [disabled, setDisabled] = useState<boolean>(true)
  const [storeOptions, setStoreOptions] = useState<
    { id: string; name: string }[]
  >([])

  useEffect(() => {
    const listeners = onSnapshot(
      collection(getFirestoreInstance(), 'stores'),
      snapshot => {
        const stores = snapshot.docs.map(doc => ({
          id: doc.id,
          name: (doc.data() as Store).name,
        }))

        setStoreOptions(stores)
        setDisabled(false)
      }
    )

    return () => listeners()
  }, [])

  return (
    <div className="sm:max-w-xs w-full">
      <label
        htmlFor="store"
        className="block text-sm font-medium text-gray-700"
      >
        Store
      </label>
      <div className="mt-1">
        <select
          className={classNames(
            disabled ? 'cursor-wait' : '',
            'block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md'
          )}
          defaultValue="none"
          disabled={disabled}
          onChange={option => {
            if (option.target.value !== 'none') {
              console.log(option.target.value)
              onSelect(option.target.value)
            }
          }}
        >
          <option value="none">Select store</option>
          {storeOptions.map(storeOption => (
            <option
              key={`storeSelector-option-${storeOption.id}`}
              value={storeOption.id}
            >
              {storeOption.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
})
