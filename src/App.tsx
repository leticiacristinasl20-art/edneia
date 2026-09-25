/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ConfettiCanvas, ConfettiRef } from './components/ConfettiCanvas';
import { BalloonsOverlay } from './components/BalloonsOverlay';
import { HeaderNav } from './components/HeaderNav';
import { HeroSection } from './components/HeroSection';
import { TributesCarousel } from './components/TributesCarousel';
import { PhotoGalleryCarousel } from './components/PhotoGalleryCarousel';
import { TripAndWishesSection } from './components/TripAndWishesSection';
import { BirthdayCandleInteractive } from './components/BirthdayCandleInteractive';
import { GoldenGuestbook } from './components/GoldenGuestbook';
import { PromptModal } from './components/PromptModal';
import { FooterSection } from './components/FooterSection';
import { celebrationAudio } from './utils/audio';

export default function App() {
  const confettiRef = useRef<ConfettiRef | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState<boolean>(false);
  const [balloonTriggerKey, setBalloonTriggerKey] = useState<number>(0);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);

  const handleTriggerConfetti = () => {
    confettiRef.current?.fire();
  };

  const handleToggleMusic = () => {
    if (isMusicPlaying) {
      celebrationAudio.stop();
      setIsMusicPlaying(false);
    } else {
      celebrationAudio.playBirthdayMelody(() => {
        setIsMusicPlaying(false);
      });
      setIsMusicPlaying(true);
    }
  };

  const handleStartMusic = () => {
    celebrationAudio.playBirthdayMelody(() => {
      setIsMusicPlaying(false);
    });
    setIsMusicPlaying(true);
  };

  const handleLaunchBalloons = () => {
    setBalloonTriggerKey((prev) => prev + 1);
    handleTriggerConfetti();
    celebrationAudio.playChime();
  };

  const handleScrollToMessages = () => {
    const el = document.getElementById('mensagens');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    return () => {
      celebrationAudio.stop();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFF8F8] text-slate-800 font-sans selection:bg-rose-200 selection:text-rose-900 relative">
      {/* Dynamic Confetti Canvas */}
      <ConfettiCanvas ref={confettiRef} />

      {/* Interactive Balloons Overlay on Launch & Re-trigger */}
      <BalloonsOverlay
        key={balloonTriggerKey}
        onTriggerConfetti={handleTriggerConfetti}
        onStartMusic={handleStartMusic}
        isMusicPlaying={isMusicPlaying}
      />

      {/* Top Bar Navigation */}
      <HeaderNav
        isMusicPlaying={isMusicPlaying}
        onToggleMusic={handleToggleMusic}
        onLaunchBalloons={handleLaunchBalloons}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* Main Story Flow */}
      <main>
        {/* Hero Section */}
        <HeroSection
          onScrollToMessages={handleScrollToMessages}
          onTriggerConfetti={handleTriggerConfetti}
        />

        {/* Family Tributes Carousel */}
        <TributesCarousel
          onTriggerConfetti={handleTriggerConfetti}
        />

        {/* Photo Gallery Carousel with Polaroid & Upload */}
        <PhotoGalleryCarousel
          onTriggerConfetti={handleTriggerConfetti}
        />

        {/* Trips & Dreams Section */}
        <TripAndWishesSection
          onTriggerConfetti={handleTriggerConfetti}
        />

        {/* Interactive Candle Section */}
        <BirthdayCandleInteractive
          onTriggerConfetti={handleTriggerConfetti}
        />

        {/* Golden Guestbook Mural */}
        <GoldenGuestbook
          onTriggerConfetti={handleTriggerConfetti}
        />
      </main>

      {/* Footer Section */}
      <FooterSection
        onScrollToTop={handleScrollToTop}
        onTriggerConfetti={handleTriggerConfetti}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
      />

      {/* Prompt Modal */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
      />
    </div>
  );
}
