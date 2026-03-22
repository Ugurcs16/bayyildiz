import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileStickyBar } from "./MobileStickyBar";
import { WhatsAppFloat } from "./WhatsAppFloat";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="flex flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
      <WhatsAppFloat />
    </>
  );
}
