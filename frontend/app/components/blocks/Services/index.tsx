import Image from "next/image";
import ArrowLink from "@/app/components/ui/ArrowLink";
import Container from "@/app/components/ui/Container";
import ItalicHeading from "@/app/components/ui/ItalicHeading";

export type ServiceItem = {
  year: string;
  title: string;
  image?: string;
  href: string;
};

export type ServicesBlockProps = {
  heading: string;
  italicPhrase: string;
  subheading: string;
  items: ServiceItem[];
};

export default function ServicesBlock({
  heading,
  italicPhrase,
  subheading,
  items,
}: ServicesBlockProps) {
  return (
    <section className="bg-[var(--color-red-mid)] py-16 lg:py-[120px] flex flex-col gap-16 lg:gap-[100px] items-center">
      <Container className="flex flex-col gap-10 items-center text-center text-white">
        <div className="flex flex-col gap-6 lg:gap-10 items-center text-center">
          <ItalicHeading
            text={heading}
            italicPart={italicPhrase}
            className="display-lg"
          />
          <p className="body-lg opacity-80 max-w-full md:max-w-[545px]">{subheading}</p>
        </div>
      </Container>
      <div className="w-full flex flex-col">
        {items.map((item, i) => (
          <div
            className="group hover:bg-[var(--color-red-dark)] transition-colors duration-300"
            key={item.title}
          >
            <Container className={`border-[#ff8484] transition-colors flex justify-between duration-300 group-hover:border-transparent ${
              i === 0 ? "border-t border-b" : "border-b"
            }`}>
              <div className="flex items-center gap-4 md:gap-[80px] lg:gap-[175px]">
                <span className="hidden md:block font-body font-bold text-xl lg:text-2xl text-white tracking-tight uppercase w-14 shrink-0">
                  {item.year}
                </span>
                <div className="flex items-center gap-4 lg:gap-6">
                  {item.image ? (
                    <div className="relative hidden md:block w-[160px] lg:w-[240px] h-[100px] lg:h-[140px] shrink-0">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <div className="hidden md:block w-[160px] lg:w-[240px] h-[100px] lg:h-[140px] shrink-0 bg-white/10" />
                  )}
                  <span className="font-body font-bold text-base md:text-xl lg:text-2xl text-white tracking-tight uppercase">
                    {item.title}
                  </span>
                </div>
              </div>

              <ArrowLink
                href={item.href}
                label="LEARN MORE"
                variant="dark"
                className="group-hover:opacity-100 shrink-0"
              />
            </Container>
          </div>
        ))}
      </div>
    </section>
  );
}
