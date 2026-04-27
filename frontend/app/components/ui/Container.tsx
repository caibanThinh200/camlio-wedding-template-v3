import { type ElementType } from 'react'

type ContainerProps = {
  as?: ElementType
  className?: string
  children: React.ReactNode
}

/**
 * Centers content with consistent horizontal padding and Tailwind's container width scale.
 * Sections provide background color and vertical padding; Container handles horizontal layout.
 */
export default function Container({ as: Tag = 'div', className = '', children }: ContainerProps) {
  return (
    <Tag className={`container mx-auto px-5 md:px-0 ${className}`}>
      {children}
    </Tag>
  )
}
