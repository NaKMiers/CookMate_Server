import { LucideEye } from 'lucide-react'
import React, { memo, useCallback, useState } from 'react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'

interface InputProps {
  label: string
  icon?: React.ElementType
  className?: string

  id: string
  type?: string
  disabled?: boolean
  required?: boolean
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  register: UseFormRegister<FieldValues>
  errors: FieldErrors
  options?: any[]
  rows?: number
  minDate?: string
  maxDate?: string
  onClick?: (e?: any) => void
  onFocus?: (e?: any) => void

  // rest
  [key: string]: any
}

function Input({
  id,
  type = 'text',
  disabled,
  required,
  register,
  errors,
  label,
  onChange,
  icon: Icon,
  options,
  rows,
  onClick,
  onFocus,
  minDate,
  maxDate,
  className = '',
  ...rest
}: InputProps) {
  // states
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false)

  // show password
  const showPassword = useCallback(() => {
    setIsShowPassword(prev => !prev)
  }, [])

  return (
    <div className={`${className}`} onClick={onClick} onFocus={onFocus}>
      <div className={`flex`}>
        {/* MARK: Icon */}
        {Icon && (
          <span
            onClick={type === 'password' ? showPassword : undefined}
            className={`inline-flex items-center rounded-tl-lg rounded-bl-lg border-[2px] px-3 text-sm text-gray-900 ${
              errors[id]
                ? 'border-rose-400 bg-rose-100'
                : 'border-slate-200 bg-slate-100'
            } ${type === 'password' ? 'cursor-pointer' : ''}`}
          >
            {type === 'password' ? (
              isShowPassword ? (
                <LucideEye size={19} className="text-secondary" />
              ) : (
                <Icon size={19} className="text-secondary" />
              )
            ) : (
              <Icon size={19} className="text-secondary" />
            )}
          </span>
        )}

        {/* MARK: Text Field */}
        <div
          className={`relative w-full border-[2px] border-l-0 bg-white ${
            Icon ? 'rounded-tr-lg rounded-br-lg' : 'rounded-lg'
          } ${errors[id] ? 'border-rose-400' : 'border-slate-200'}`}
        >
          {type === 'textarea' ? (
            <textarea
              id={id}
              className="peer text-dark block w-full bg-transparent px-2.5 pt-4 pb-2.5 text-sm focus:ring-0 focus:outline-none"
              placeholder=" "
              disabled={disabled}
              rows={rows || 4}
              {...register(id, { required })}
              {...rest}
            />
          ) : type === 'select' ? (
            <select
              id={id}
              className="peer text-dark block min-h-[46px] w-full rounded-r-lg bg-neutral-300 px-2.5 pt-4 pb-2.5 text-sm focus:ring-0 focus:outline-none"
              style={{ WebkitAppearance: 'none' }}
              disabled={disabled}
              {...register(id, { required })}
              onChange={onChange}
              defaultValue={options?.find(option => option.selected)?.value}
              {...rest}
            >
              {options?.map((option, index) => (
                <option
                  className="bg-dark-100 font-body appearance-none p-5 font-semibold tracking-wider"
                  key={index}
                  value={option.value}
                >
                  {option.label}
                </option>
              ))}
            </select>
          ) : (
            <input
              id={id}
              className="number-input peer text-dark block h-[46px] w-full bg-transparent px-2.5 pt-4 pb-2.5 text-sm focus:ring-0 focus:outline-none"
              min={type === 'date' ? minDate : undefined}
              max={type === 'date' ? maxDate : undefined}
              disabled={disabled}
              type={
                type === 'password'
                  ? isShowPassword
                    ? 'text'
                    : 'password'
                  : type
              }
              {...register(id, { required })}
              onWheel={e => e.currentTarget.blur()}
              {...rest}
            />
          )}

          {/* MARK: Label */}
          <label
            htmlFor={id}
            className={`absolute start-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform cursor-pointer rounded-md bg-white px-2 text-sm text-nowrap text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 ${
              errors[id] ? 'text-rose-400' : 'text-dark'
            }`}
          >
            {label}
          </label>
        </div>
      </div>

      {/* MARK: Error */}
      {errors[id]?.message && (
        <span className="text-sm text-rose-400">
          {errors[id]?.message?.toString()}
        </span>
      )}
    </div>
  )
}

export default memo(Input)
