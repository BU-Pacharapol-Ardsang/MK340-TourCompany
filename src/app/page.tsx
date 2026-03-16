import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TourSection from "@/components/TourSection";
import WhyUs from "@/components/WhyUs";
import ContactCTA from "@/components/ContactCTA";
import Footer from "@/components/Footer";
import { getTours } from "@/lib/tours";

export const revalidate = 300;

export default async function Home() {
  const tours = await getTours();

  return (
    <main className="overflow-hidden">
      <Navbar />
      <Hero />
      <TourSection tours={tours} />
      <WhyUs />
      <ContactCTA />
      <Footer />
    </main>
  );
}
