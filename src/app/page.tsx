"use client";
import EventListSection from "./components/EventListSection";
import HeroSection from "./components/HeroSection";
import FeaturesSection from "./components/FeaturesSection";
import CTASection from "./components/CTASection";
import Navbar from "@/components/NavBar";
import Divider from "@/components/Divider";
import DevTransactionSimulator from "./components/DevTransactionSim";

export default function Home() {
  return (
    <>
      {/* Arco - start */}

      {/* Arco - end */}

      {/* Eky - start */}
      <DevTransactionSimulator />
      <HeroSection />
      <Divider variant="arrow" />
      <EventListSection />
      <Divider variant="circles" />
      <FeaturesSection />
      <Divider variant="circles" />
      <CTASection />
      <Divider variant="circles" />

      {/* Eky - end */}
    </>
  );
}
