import { hasCustomerSessionCookie } from "@/lib/customer/session-cookie";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileStickyBar } from "./MobileStickyBar";
import { WhatsAppFloat } from "./WhatsAppFloat";

export async function SiteShell({ children }: { children: React.ReactNode }) {
  const signedIn = await hasCustomerSessionCookie();
  return (
    <>
      <Header signedIn={signedIn} />
      <main className="flex flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileStickyBar />
      <WhatsAppFloat />
    </>
  );
}
