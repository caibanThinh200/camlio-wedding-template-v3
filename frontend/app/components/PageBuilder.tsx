import BlockRenderer from '@/app/components/BlockRenderer'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Block = Record<string, any> & { _type: string; _key: string }

type PageBuilderProps = {
  blocks: Block[]
}

export default function PageBuilder({ blocks }: PageBuilderProps) {
  return (
    <>
      {blocks.map((block) => (
        <BlockRenderer key={block._key} block={block} />
      ))}
    </>
  )
}
