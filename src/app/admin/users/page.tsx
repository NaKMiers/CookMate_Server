'use client'

import AdminMeta from '@/components/AdminMeta'
import ConfirmDialog from '@/components/ConfirmDialog'
import Input from '@/components/Input'
import Pagination from '@/components/Pagination'
import UserItem from '@/components/UserItem'
import { handleQuery, searchParamsToObject } from '@/lib/common'
import { IUser } from '@/models/User'
import { deleteUsersApi, getAllUsersApi } from '@/requests/adminRequest'
import { LucideArrowDownUp, LucideSearch } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { FieldValues, SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'

function AllUsersPage() {
  // hooks
  const params = useSearchParams()
  const searchParams = useMemo(() => searchParamsToObject(params), [params])
  const pathname = usePathname()
  const router = useRouter()

  // states
  const [users, setUsers] = useState<IUser[]>([])
  const [amount, setAmount] = useState<number>(0)
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // loading and confirming
  const [loadingUsers, setLoadingUsers] = useState<string[]>([])
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const itemPerPage = 9

  // form
  const defaultValues = useMemo<FieldValues>(
    () => ({
      search: '',
      sort: 'updatedAt|-1',
      role: '',
      isDeleted: '',
    }),
    []
  )

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
    reset,
    clearErrors,
  } = useForm<FieldValues>({
    defaultValues,
  })

  // MARK: Get Data
  // get all users
  useEffect(() => {
    // get all users
    const getAllUsers = async () => {
      const query = handleQuery(searchParams)

      try {
        const { users, amount } = await getAllUsersApi(query)

        // set to states
        setUsers(users)
        setAmount(amount)

        // sync search params with states
        setValue('search', searchParams?.search || getValues('search'))
        setValue('sort', searchParams?.sort || getValues('sort'))
        setValue('role', searchParams?.role || getValues('role'))
        setValue('isDeleted', searchParams?.isDeleted || getValues('isDeleted'))
      } catch (err: any) {
        console.log(err)
      }
    }
    getAllUsers()
  }, [searchParams, setValue, getValues])

  // MARK: Handlers
  // delete user
  const handleDeleteUsers = useCallback(
    async (ids: string[], value: boolean = true) => {
      setLoadingUsers(ids)

      try {
        // send request to server
        const { message } = await deleteUsersApi(ids, value)

        // remove deleted users from state
        setUsers(prev =>
          prev.map(user =>
            ids.includes(user._id) ? { ...user, isDeleted: value } : user
          )
        )

        // show success message
        toast.success(message)
      } catch (err: any) {
        console.log(err)
        toast.error(err.message)
      } finally {
        setLoadingUsers([])
        setSelectedUsers([])
      }
    },
    []
  )

  // handle select all users
  const handleSelectAllUsers = useCallback(() => {
    setSelectedUsers(
      selectedUsers.length > 0
        ? []
        : users.filter(user => user.role === 'user').map(user => user._id)
    )
  }, [users, selectedUsers.length])

  // handle optimize filter
  const handleOptimizeFilter: SubmitHandler<FieldValues> = useCallback(
    data => {
      // reset page
      if (searchParams?.page) {
        delete searchParams.page
      }

      // loop through data to prevent filter default
      for (const key in data) {
        if (data[key] === defaultValues[key]) {
          if (!searchParams?.[key]) {
            delete data[key]
          } else {
            data[key] = ''
          }
        }
      }

      return {
        ...data,
      }
    },
    [searchParams, defaultValues]
  )

  // handle submit filter
  const handleFilter: SubmitHandler<FieldValues> = useCallback(
    async data => {
      const params: any = handleOptimizeFilter(data)

      // handle query
      const query = handleQuery({
        ...searchParams,
        ...params,
      })

      // push to router
      router.push(pathname + query)
    },
    [handleOptimizeFilter, router, searchParams, pathname]
  )

  // handle reset filter
  const handleResetFilter = useCallback(() => {
    reset()
    router.push(pathname)
  }, [reset, router, pathname])

  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + A (Select All)
      if (e.altKey && e.key === 'a') {
        e.preventDefault()
        handleSelectAllUsers()
      }

      // Alt + Delete (Delete)
      if (e.altKey && e.key === 'Delete') {
        e.preventDefault()
        setIsOpenConfirmModal(true)
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter, handleSelectAllUsers, handleSubmit])

  return (
    <div className="w-full">
      <AdminMeta
        handleFilter={handleSubmit(handleFilter)}
        handleResetFilter={handleResetFilter}
      >
        {/* Search */}
        <div className="col-span-12 flex flex-col md:col-span-4">
          <Input
            id="search"
            className="md:max-w-[450px]"
            label="Search"
            disabled={false}
            register={register}
            errors={errors}
            type="text"
            icon={LucideSearch}
            onFocus={() => clearErrors('search')}
          />
        </div>

        {/* MARK: Select Filter */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-3 md:col-span-4">
          {/* Sort */}
          <Input
            id="sort"
            label="Sort"
            disabled={false}
            register={register}
            errors={errors}
            icon={LucideArrowDownUp}
            type="select"
            onFocus={() => clearErrors('sort')}
            options={[
              {
                value: 'createdAt|-1',
                label: 'Newest',
              },
              {
                value: 'createdAt|1',
                label: 'Oldest',
              },
              {
                value: 'updatedAt|-1',
                label: 'Latest',
                selected: true,
              },
              {
                value: 'updatedAt|1',
                label: 'Earliest',
              },
            ]}
          />

          {/* Role */}
          <Input
            id="role"
            label="Role"
            disabled={false}
            register={register}
            errors={errors}
            icon={LucideArrowDownUp}
            type="select"
            onFocus={() => clearErrors('role')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'admin',
                label: 'Admin',
              },
              {
                value: 'user',
                label: 'User',
              },
            ]}
          />

          {/* Deleted */}
          <Input
            id="isDeleted"
            label="Deleted"
            disabled={false}
            register={register}
            errors={errors}
            icon={LucideArrowDownUp}
            type="select"
            onFocus={() => clearErrors('isDeleted')}
            options={[
              {
                value: '',
                label: 'All',
                selected: true,
              },
              {
                value: 'true',
                label: 'Deleted',
              },
              {
                value: 'false',
                label: 'Available',
              },
            ]}
          />
        </div>

        {/* MARK: Action Buttons */}
        <div className="col-span-12 flex flex-wrap items-center justify-end gap-2 text-sm">
          {/* Select All Button */}
          <button
            className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-white"
            onClick={handleSelectAllUsers}
          >
            {selectedUsers.length > 0 ? 'Unselect All' : 'Select All'}
          </button>

          {/* Delete Many Button */}
          {!!selectedUsers.length &&
            selectedUsers.some(
              id => !users.find(user => user._id === id)?.isDeleted
            ) && (
              <button
                className="trans-200 rounded-lg border border-red-500 px-3 py-2 text-red-500 hover:bg-red-500 hover:text-white"
                onClick={() => setIsOpenConfirmModal(true)}
              >
                Delete
              </button>
            )}

          {/* Recover Many Button */}
          {!!selectedUsers.length &&
            selectedUsers.some(
              id => users.find(user => user._id === id)?.isDeleted
            ) && (
              <button
                className="trans-200 rounded-lg border border-sky-400 px-3 py-2 text-sky-400 hover:bg-sky-400 hover:text-white"
                onClick={() => handleDeleteUsers(selectedUsers, false)}
              >
                Recover
              </button>
            )}
        </div>
      </AdminMeta>

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete Users"
        content="Are you sure that you want to delete these users?"
        onAccept={() => handleDeleteUsers(selectedUsers)}
        isLoading={loadingUsers.length > 0}
      />

      {/* MARK: Amount */}
      <div className="p-3 text-right text-sm font-semibold">
        {Math.min(itemPerPage * +(searchParams?.page || 1), amount)}/{amount}{' '}
        user{amount > 1 && 's'}
      </div>

      {/* MARK: MAIN LIST */}
      <div className="grid grid-cols-1 gap-4 px-4 md:grid-cols-2 lg:grid-cols-3">
        {users.map(user => (
          <UserItem
            data={user}
            loadingUsers={loadingUsers}
            selectedUsers={selectedUsers}
            setSelectedUsers={setSelectedUsers}
            handleDeleteUsers={handleDeleteUsers}
            key={user._id}
          />
        ))}
      </div>

      <Pagination
        className="my-8"
        searchParams={searchParams}
        amount={amount}
        itemsPerPage={itemPerPage}
      />
    </div>
  )
}

export default AllUsersPage
