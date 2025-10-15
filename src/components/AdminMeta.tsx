import { cn } from '@/lib/utils'
import { LucideFilter, LucideRefreshCcw } from 'lucide-react'
import React, { Children, memo, useEffect } from 'react'

interface AdminMetaProps {
  children: React.ReactNode
  handleFilter: () => void
  handleResetFilter: () => void
  className?: string
}

function AdminMeta({
  handleFilter,
  handleResetFilter,
  className = '',
  children,
}: AdminMetaProps) {
  // keyboard event
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + F (Filter)
      if (e.altKey && e.key === 'f') {
        e.preventDefault()
        handleFilter()
      }

      // Alt + R (Reset)
      if (e.altKey && e.key === 'r') {
        e.preventDefault()
        handleResetFilter()
      }
    }

    // Add the event listener
    window.addEventListener('keydown', handleKeyDown)

    // Remove the event listener on cleanup
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleFilter, handleResetFilter])

  return (
    <div className={cn('w-full bg-white p-5 shadow-md', className)}>
      <div className="grid grid-cols-12 gap-2">
        {/* MARK: children 1 -> n - 1 */}
        {Children.toArray(children).slice(0, -1)}

        {/* MARK: Filter Buttons */}
        <div className="col-span-12 flex items-center justify-end gap-2 md:col-span-4">
          {/* Filter Button */}
          <button
            className="trans-200 group flex cursor-pointer items-center rounded-md bg-sky-400 px-3 py-2 text-sm font-semibold text-nowrap text-white hover:bg-sky-500"
            title="Alt + Enter"
            onClick={handleFilter}
          >
            Filter
            <LucideFilter size={14} className="ml-[6px]" />
          </button>

          {/* Reset Button */}
          <button
            className="trans-200 group flex cursor-pointer items-center rounded-md bg-slate-600 px-3 py-2 text-sm font-semibold text-nowrap text-white hover:bg-slate-800"
            title="Alt + R"
            onClick={handleResetFilter}
          >
            Reset
            <LucideRefreshCcw size={14} className="ml-1" />
          </button>
        </div>

        {/* MARK: children n */}
        {Children.toArray(children).slice(-1)}
      </div>
    </div>
  )
}

export default memo(AdminMeta)
