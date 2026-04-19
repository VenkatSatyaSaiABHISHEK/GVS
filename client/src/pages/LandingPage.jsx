import React from 'react';
import Navbar from '@/components/Landing/Navbar';
import HeroSection from '@/components/Landing/HeroSection';
import PromoBanner from '@/components/Landing/PromoBanner';
import CategoryCards from '@/components/Landing/CategoryCards';
import TopHiringInstitutions from '@/components/Landing/TopHiringInstitutions';
import FeaturedInstitutions from '@/components/Landing/FeaturedInstitutions';
import VideoSection from '@/components/Landing/VideoSection';
import CareerSection from '@/components/Landing/CareerSection';
import EventsSection from '@/components/Landing/EventsSection';
import PlatformStats from '@/components/Landing/PlatformStats';
import CallToAction from '@/components/Landing/CallToAction';
import Footer from '@/components/Landing/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PromoBanner />
      <CategoryCards />
      <TopHiringInstitutions />
      <FeaturedInstitutions />
      <VideoSection />
      <CareerSection />
      <EventsSection />
      <PlatformStats />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default LandingPage;