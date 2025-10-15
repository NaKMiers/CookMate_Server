import { cn } from '@/lib/utils'
import { LucideLoader } from 'lucide-react'
import { Dispatch, memo, SetStateAction, useEffect, useRef } from 'react'

interface ConfirmDialogProps {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  title: string
  content: string
  acceptLabel?: string
  cancelLabel?: string
  onAccept: () => void
  isLoading?: boolean
  color?: string
  containerClassName?: string
  className?: string
}

function ConfirmDialog({
  open,
  setOpen,
  title,
  content,
  acceptLabel,
  cancelLabel,
  onAccept,
  isLoading = false,
  color = 'destructive',
  containerClassName,
  className,
}: ConfirmDialogProps) {
  const initialFocusRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        initialFocusRef.current?.focus()
      }, 50)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false)
      }

      if (e.key === 'Enter') {
        if (!isLoading) {
          onAccept()
          setOpen(false)
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [setOpen, onAccept, open, isLoading])

  return open ? (
    <div
      className={cn(
        'fixed inset-0 z-50 flex items-center justify-center bg-black/50',
        containerClassName
      )}
      onClick={() => !isLoading && setOpen(false)}
    >
      <div
        className={cn(
          'animate-in fade-in-0 slide-in-from-top-1 relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg',
          className
        )}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3">
          <h2 className="text-lg font-semibold">{title}</h2>
        </div>
        <div className="mb-4 text-gray-700">
          <p>{content}</p>
        </div>
        <div className="flex items-center justify-end gap-2">
          <button
            ref={initialFocusRef}
            type="button"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
            onClick={() => setOpen(false)}
            disabled={isLoading}
          >
            {cancelLabel || 'Cancel'}
          </button>
          <button
            type="button"
            className={cn(
              'rounded-md border px-4 py-2 text-sm font-medium shadow-sm transition-colors disabled:opacity-50',
              color === 'destructive'
                ? 'border-red-500 text-red-600 hover:bg-red-600 hover:text-white'
                : `border-${color}-500 text-${color}-600 hover:bg-${color}-600 hover:text-white`
            )}
            onClick={() => {
              if (!isLoading) {
                onAccept()
                setOpen(false)
              }
            }}
            disabled={isLoading}
            tabIndex={0}
          >
            {isLoading ? (
              <LucideLoader
                size={18}
                className="mr-2 animate-spin text-gray-400"
              />
            ) : null}
            {acceptLabel || 'Confirm'}
          </button>
        </div>
      </div>
    </div>
  ) : null
}

export default memo(ConfirmDialog)
