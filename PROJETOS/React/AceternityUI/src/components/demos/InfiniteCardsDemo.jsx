import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { testimonials } from "@/data/portfolio";

export default function InfiniteCardsDemo() {
  return (
    <section className="dark flex flex-col items-center justify-center overflow-hidden rounded-2xl bg-puc-ink py-10 antialiased">
      <InfiniteMovingCards items={testimonials} direction="right" speed="slow" />
    </section>
  );
}
