'use client'

import React, { Fragment, useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

type InputProps = {
  type: string
  placeholder?: string
  required?: boolean
  className?: string
  label?: string
  name?: string
  value?: string
  showPasswordToggle?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
  error?: string | null
}
const InputProfil = ({
  type,
  placeholder,
  required,
  className,
  name,
  label,
  value,
  onChange,
  showPasswordToggle,
  error,
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <>
      {label && <label className="c-label">{label}</label>}
      <div className="relative">
        <input
          className={`${className} pr-8`}
          type={showPassword ? 'text' : type}
          placeholder={placeholder}
          required={required}
          name={name}
          value={value}
          onChange={onChange}
        />
        {showPasswordToggle && (
          <div className="c-icon-password" onClick={togglePasswordVisibility}>
            {showPassword ? (
              <ChevronDown fontSize={'small'} />
            ) : (
              <ChevronUp fontSize={'small'} />
            )}
          </div>
        )}
      </div>
      {error && (
        <Fragment>
          <div
            className="absolute right-0 mt-4 mr-2 cursor-pointer"
            style={{ top: '50px' }}
          >
            <span className="text-red-500 text-xs">{error}</span>
          </div>
        </Fragment>
      )}
    </>
  )
}

export default InputProfil
