import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TourSection from "@/components/TourSection";
import WhyUs from "@/components/WhyUs";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <TourSection />
      <WhyUs />
      <ContactCTA />
      <Footer />
    </main>
  );
}
