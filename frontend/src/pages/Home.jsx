import PublicLayout from "../layouts/PublicLayout";
import Seo from "../components/seo/Seo";
import Hero from "../components/home/Hero";
import RoleMarquee from "../components/home/RoleMarquee";
import Features from "../components/home/Features";
import TemplateShowcase from "../components/home/TemplateShowcase";
import HowItWorks from "../components/home/HowItWorks";
import FAQ from "../components/home/FAQ";
import CTA from "../components/home/CTA";

export default function Home() {
  return (
    <PublicLayout>
      {/* JSON-LD for this page is written into the static HTML at build time */}
      <Seo />
      <Hero />
      <RoleMarquee />
      <Features />
      <TemplateShowcase />
      <HowItWorks />
      <FAQ />
      <CTA />
    </PublicLayout>
  );
}
