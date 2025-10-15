import { LucideLoader } from 'lucide-react'
import { memo } from 'react'
interface LoadingButtonProps {
  text: string
  isLoading: boolean
  onClick?: (e?: any) => void
  className?: string
}

function LoadingButton({
  text,
  isLoading,
  onClick,
  className = '',
}: LoadingButtonProps) {
  return (
    <button
      className={`${
        isLoading ? 'pointer-events-none flex justify-center bg-slate-200' : ''
      } ${className}`}
      disabled={isLoading}
      onClick={onClick}
    >
      {isLoading ? <LucideLoader size={24} className="animate-spin" /> : text}
    </button>
  )
}

export default memo(LoadingButton)
