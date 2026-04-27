import Image from 'next/image'
import Container from '@/app/components/ui/Container'
import ItalicHeading from '@/app/components/ui/ItalicHeading'

export type ProcessStep = {
  number: string
  title: string
  image: string
  imageAlt?: string
}

export type ProcessBlockProps = {
  heading: string
  italicPhrase: string
  subheading: string
  steps: ProcessStep[]
}

const STEP_IMAGE_HEIGHTS = ['h-[300px] xl:h-[517px]', 'h-[300px] xl:h-[280px]', 'h-[300px] xl:h-[517px]', 'h-[300px] xl:h-[280px]']
const STEP_ALIGN = ['items-start xl:items-end', 'items-start', 'items-start xl:items-end', 'items-start']

export default function ProcessBlock({ heading, italicPhrase, subheading, steps }: ProcessBlockProps) {
  return (
    <section className="bg-[var(--color-blush-dark)] pt-16 lg:pt-[120px] pb-16 lg:pb-[160px] flex flex-col gap-16 lg:gap-[100px] items-center">
      <Container className="flex flex-col gap-8 lg:gap-10 items-center text-center text-[var(--color-text)]">
        <ItalicHeading
          text={heading}
          italicPart={italicPhrase}
          className="display-lg max-w-full lg:max-w-[1210px]"
        />
        <p className="body-lg opacity-50 max-w-full lg:max-w-[612px]">{subheading}</p>
      </Container>

      <Container className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5 xl:items-start">
        {steps.map((step, i) => (
          <div
            key={step.number}
            className={`flex flex-col gap-3 ${STEP_ALIGN[i]}`}
          >
            <div className={`relative w-full overflow-hidden rounded-sm ${STEP_IMAGE_HEIGHTS[i]}`}>
              <Image
                src={step.image}
                alt={step.imageAlt ?? step.title}
                fill
                className="object-cover transition-all duration-500 ease-in-out hover:scale-125 hover:brightness-50"
              />
            </div>

            <div className="flex items-end gap-3 w-full text-[var(--color-text)] uppercase">
              <span className="step-number leading-none shrink-0">{step.number}</span>
              <span className="font-display font-medium text-xl lg:text-2xl tracking-tight leading-tight">
                {step.title}
              </span>
            </div>
          </div>
        ))}
      </Container>
    </section>
  )
}
