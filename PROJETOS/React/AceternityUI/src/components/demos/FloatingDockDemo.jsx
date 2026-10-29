import { FloatingDock } from "@/components/ui/floating-dock";
import { socialLinks } from "@/data/portfolio";

export default function FloatingDockDemo() {
  return (
    <section className="dark flex h-[18rem] w-full flex-col items-center justify-end gap-16 rounded-2xl bg-puc-ink pb-10">
      <p className="text-sm text-zinc-300">Passe o mouse pelos ícones</p>
      <FloatingDock items={socialLinks} desktopClassName="dark:bg-puc-deep" />
    </section>
  );
}
