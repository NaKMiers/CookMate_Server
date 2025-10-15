import { IUser } from '@/models/User'
import { LucideLoader, LucideTrash, LucideUndo2 } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { Dispatch, memo, SetStateAction, useState } from 'react'
import ConfirmDialog from './ConfirmDialog'
import moment from 'moment'

interface UserItemProps {
  data: IUser
  loadingUsers: string[]
  className?: string
  selectedUsers: string[]
  setSelectedUsers: Dispatch<SetStateAction<string[]>>
  handleDeleteUsers: (ids: string[], value?: boolean) => void
}

function UserItem({
  data,
  loadingUsers,
  className,
  selectedUsers,
  setSelectedUsers,
  handleDeleteUsers,
}: UserItemProps) {
  // hooks
  const { data: session } = useSession()
  const curUser: any = session?.user

  // states
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState<boolean>(false)

  // values
  const isCurUser = data._id === curUser?._id

  return (
    <>
      <div
        className={`trans-200 relative flex items-start justify-between gap-2 rounded-lg p-4 shadow-lg select-none ${
          selectedUsers.includes(data._id)
            ? '-translate-y-1 bg-violet-50'
            : 'bg-white'
        } ${!isCurUser ? 'cursor-pointer' : ''} ${className}`}
        onClick={() =>
          !isCurUser &&
          setSelectedUsers(prev =>
            prev.includes(data._id)
              ? prev.filter(id => id !== data._id)
              : [...prev, data._id]
          )
        }
      >
        {/* MARK: Body */}
        <div className="flex-1">
          {/* Avatar */}
          {data.avatar && (
            <Image
              className="float-end mr-3 aspect-square rounded-md"
              src={data.avatar}
              height={50}
              width={50}
              alt="thumbnail"
              title={data._id}
            />
          )}

          {/* Information */}
          <div className="font-body absolute -top-2 -left-2 z-30 rounded-lg bg-neutral-700 px-2 py-[2px] text-xs text-yellow-300 shadow-md select-none">
            {data.role}
          </div>
          <p
            className="font-body text-secondary line-clamp-1 block cursor-pointer text-[18px] font-semibold tracking-wide text-ellipsis"
            title={data.email}
            onClick={e => e.stopPropagation()}
          >
            {data.email}
          </p>
          {data.name && (
            <p className="text-sm">
              <span className="font-semibold">Name: </span>
              <span
                className="cursor-pointer"
                onClick={e => e.stopPropagation()}
              >
                {data.name}
              </span>
            </p>
          )}
          {data.googleUserId && (
            <p className="text-sm">
              <span className="font-semibold">Google User ID: </span>
              <span
                className="cursor-pointer"
                onClick={e => e.stopPropagation()}
              >
                {data.googleUserId}
              </span>
            </p>
          )}
          {data.authType && (
            <p className="text-sm">
              <span className="font-semibold">Auth Type: </span>
              <span
                className="cursor-pointer capitalize"
                onClick={e => e.stopPropagation()}
              >
                {data.authType}
              </span>
            </p>
          )}
          <p className="text-sm">
            <span className="font-semibold">Created At: </span>
            <span
              className="cursor-pointer capitalize"
              onClick={e => e.stopPropagation()}
            >
              {moment(data.createdAt).format('DD/MM/YYYY HH:mm')}
            </span>
          </p>
        </div>

        {/* MARK: Action Buttons*/}
        <div className="text-dark flex flex-col gap-4">
          {/* Delete Button */}
          {!isCurUser && !['admin', 'editor'].includes(data?.role) && (
            <button
              className="group block cursor-pointer"
              onClick={e => {
                e.stopPropagation()
                if (!data.isDeleted) {
                  setIsOpenConfirmModal(true)
                } else {
                  handleDeleteUsers([data._id], false)
                }
              }}
              disabled={loadingUsers.includes(data._id)}
              title="Delete"
            >
              {loadingUsers.includes(data._id) ? (
                <LucideLoader
                  size={18}
                  className="animate-spin text-slate-300"
                />
              ) : data.isDeleted ? (
                <LucideUndo2 size={18} className="text-sky-500" />
              ) : (
                <LucideTrash size={18} className="text-rose-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Confirm Delete Dialog */}
      <ConfirmDialog
        open={isOpenConfirmModal}
        setOpen={setIsOpenConfirmModal}
        title="Delete User"
        content="Are you sure that you want to delete this user?"
        onAccept={() => handleDeleteUsers([data._id])}
        isLoading={loadingUsers.includes(data._id)}
      />
    </>
  )
}

export default memo(UserItem)
