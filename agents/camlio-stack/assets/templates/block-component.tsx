/**
 * BLOCK COMPONENT TEMPLATE
 * ─────────────────────────
 * 1. Rename every occurrence of "MyBlock" to your block name.
 * 2. Import the generated type from @/sanity.types (run `npm run predev` first).
 * 3. Register the component in BlockRenderer.tsx:
 *      import MyBlockBlock from '@/app/components/blocks/MyBlock'
 *      const Blocks = { …, myBlock: MyBlockBlock }
 */

import { MyBlock } from '@/sanity.types'
import { Container } from '@/app/components/Container'
import { cn } from '@/sanity/lib/utils'
import { urlForImage } from '@/sanity/lib/utils'
import Image from 'next/image'

type MyBlockProps = {
  block: MyBlock
  index: number
  pageId?: string
  pageType?: string
}

export default function MyBlockBlock({ block, index }: MyBlockProps) {
  const { heading, body, image } = block

  return (
    <section
      className={cn(
        'py-16 md:py-24',
        index === 0 && 'pt-0',  // remove top padding when first block
      )}
    >
      <Container as="div">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">

          {/* Text column */}
          <div className="flex flex-col gap-6">
            {heading && (
              <h2 className="heading-2-bold text-green-900">{heading}</h2>
            )}
            {body && (
              <p className="body-1-regular text-green-900">{body}</p>
            )}
          </div>

          {/* Image column */}
          {image?.asset && (
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={urlForImage(image).width(800).height(600).url()}
                alt={image.alt ?? ''}
                fill
                className="object-cover"
              />
            </div>
          )}

        </div>
      </Container>
    </section>
  )
}
