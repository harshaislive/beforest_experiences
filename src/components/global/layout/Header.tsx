'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocations } from '@/contexts/LocationContext';
import LocationsDropdown from './LocationsDropdown';
import LocationSlider from './LocationSlider';

export default function Header() {
  const { locations, isLoading: isLoadingLocations } = useLocations();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle mounting state
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll events with throttling
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen
            ? 'bg-soft-beige/95 backdrop-blur-md shadow-sm'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center hover:opacity-90 transition-opacity relative z-50"
            >
              <Image 
                src="https://beforest.co/wp-content/uploads/2024/10/23-Beforest-Black-with-Tagline.png"
                alt="Beforest"
                width={120}
                height={40}
                className="w-[120px] h-auto object-contain"
                priority
                unoptimized
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <LocationsDropdown className="text-sm tracking-wide" />
              <Link
                href="/experiences"
                className="text-deep-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide"
              >
                Experiences
              </Link>
              <Link
                href="/about"
                className="text-deep-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-deep-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide"
              >
                Contact
              </Link>
              <Link
                href="/experiences"
                className="btn-primary text-sm tracking-wide flex items-center gap-2 group"
              >
                View Upcoming Experiences
                <svg 
                  className="w-4 h-4 transition-transform group-hover:translate-x-1" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2.5 rounded-lg text-deep-brown hover:text-terracotta transition-all relative z-50"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle menu"
            >
              <span className="sr-only">Toggle menu</span>
              {mobileMenuOpen ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          mobileMenuOpen ? 'opacity-100 z-40' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setMobileMenuOpen(false)}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`md:hidden fixed inset-y-0 right-0 w-full max-w-sm bg-soft-beige shadow-xl z-50 transition-transform duration-500 ease-in-out transform ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="h-full flex flex-col">
          {/* Close Button */}
          <div className="absolute top-6 right-6">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-deep-brown hover:text-terracotta transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto pt-24 px-6">
            <div className="space-y-8">
              {/* Navigation Links */}
              <div className="space-y-8">
                <div>
                  <LocationsDropdown className="text-xl font-medium" />
                </div>
                <Link
                  href="/experiences"
                  className="block text-deep-brown hover:text-terracotta transition-colors font-medium text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Experiences
                </Link>
                <Link
                  href="/about"
                  className="block text-deep-brown hover:text-terracotta transition-colors font-medium text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  className="block text-deep-brown hover:text-terracotta transition-colors font-medium text-xl"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
              </div>

              {/* Location Slider */}
              <LocationSlider onLocationClick={() => setMobileMenuOpen(false)} />
            </div>
          </div>
          <div className="p-6 border-t border-deep-brown/10">
            <Link
              href="/experiences"
              className="block w-full text-center btn-primary text-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              View Upcoming Experiences
            </Link>
          </div>
        </nav>
      </div>
    </>
  );
}
