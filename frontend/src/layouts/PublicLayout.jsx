import Navbar from "../components/navbar/Navbar";
import Footer from "../components/home/Footer";

export default function PublicLayout({ children }) {
  return (
    <>
      <div className="aurora" aria-hidden="true" />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative">
        {children}
      </main>
      <Footer />
    </>
  );
}
