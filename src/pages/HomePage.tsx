import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { ScrollingTicker } from '../components/ScrollingTicker';
import { NewArrivals } from '../components/NewArrivals';
import { StorySection } from '../components/StorySection';
import { LifestyleEditorial } from '../components/LifestyleEditorial';
import { CommunitySection } from '../components/CommunitySection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <ScrollingTicker />
      <NewArrivals />
      <StorySection />
      <LifestyleEditorial />
      <CommunitySection />
    </>
  );
}