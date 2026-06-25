import Navbar from "../components/navbar/Navbar";
import Hero from "../components/home/Hero";
import Features from "../components/home/Features";
import TemplateShowcase from "../components/home/TemplateShowcase";
import HowItWorks from "../components/home/HowItWorks";
import Footer from "../components/home/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <TemplateShowcase />
      <HowItWorks />
      <Footer />
    </>
  );
}