import Image from "next/image";
import ArrowLink from "@/app/components/ui/ArrowLink";
import Container from "@/app/components/ui/Container";
import ItalicHeading from "@/app/components/ui/ItalicHeading";

export type AboutBlockProps = {
  image: string;
  imageAlt?: string;
  heading: string;
  italicPhrase: string;
  body: string[];
  ctaLabel: string;
  ctaHref: string;
};

export default function AboutBlock({
  image,
  imageAlt = "",
  heading,
  italicPhrase,
  body,
  ctaLabel,
  ctaHref,
}: AboutBlockProps) {
  return (
    <section className="bg-[var(--color-red-deep)] py-16 lg:py-[120px]">
      <Container className="flex flex-col lg:flex-row items-center gap-10 lg:gap-[120px]">
        <div className="relative shrink-0 w-full lg:w-[494px] h-[320px] md:h-[440px] lg:h-[596px] rounded-sm overflow-hidden">
          <Image src={image} alt={imageAlt} fill className="object-cover" />
        </div>

        <div className="flex flex-col gap-10 lg:gap-[60px] flex-1">
          <div className="flex flex-col gap-6 lg:gap-8">
            <ItalicHeading
              text={heading}
              italicPart={italicPhrase}
              className="display-lg text-white"
            />
            <div className="flex flex-col gap-3 max-w-full lg:max-w-[524px] opacity-60">
              {body.map((paragraph, i) => (
                <p key={i} className="body-lg text-white">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <div>
            <ArrowLink href={ctaHref} label={ctaLabel} variant="filled-white" />
          </div>
        </div>
      </Container>
    </section>
  );
}
