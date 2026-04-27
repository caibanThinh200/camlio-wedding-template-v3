import { type ElementType } from 'react'

type ItalicHeadingProps = {
  text: string
  italicPart: string
  as?: 'h1' | 'h2' | 'h3'
  className?: string
}

/**
 * Renders a heading where one phrase is wrapped in <em> for italic styling.
 * The italic phrase must appear exactly once in `text`.
 */
export default function ItalicHeading({ text, italicPart, as: Tag = 'h2', className = '' }: ItalicHeadingProps) {
  const idx = text.indexOf(italicPart)
  if (idx === -1) return <Tag className={className}>{text}</Tag>

  return (
    <Tag className={className}>
      {text.slice(0, idx)}
      <em>{italicPart}</em>
      {text.slice(idx + italicPart.length)}
    </Tag>
  )
}
