'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useLocations } from '@/contexts/LocationContext';
import LocationsDropdown from './LocationsDropdown';

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

  // Prevent hydration issues
  if (!mounted) {
    return null;
  }

  return (
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
            <LocationsDropdown />
            <Link
              href="/events"
              className="text-deep-brown hover:text-terracotta transition-colors font-medium text-sm tracking-wide"
            >
              Events
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
              href="/events"
              className="btn-primary text-sm tracking-wide flex items-center gap-2 group"
            >
              View Upcoming Events
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
            className="md:hidden p-2.5 rounded-lg bg-deep-brown/5 text-deep-brown hover:bg-deep-brown hover:text-soft-beige transition-all relative z-50"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            <span className="sr-only">Toggle menu</span>
            {mobileMenuOpen ? (
              <svg
                className="h-5 w-5"
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
                className="h-5 w-5"
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

        {/* Mobile Menu */}
        <div
          className={`md:hidden fixed inset-x-0 top-20 bg-soft-beige/95 backdrop-blur-md transition-all duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 -translate-y-4 pointer-events-none'
          }`}
        >
          <nav className="py-6 space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-4">
              <LocationsDropdown />
              <Link
                href="/events"
                className="block text-deep-brown hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Events
              </Link>
              <Link
                href="/about"
                className="block text-deep-brown hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="block text-deep-brown hover:text-terracotta transition-colors font-medium py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/events"
                className="block w-full text-center btn-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                View Upcoming Events
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
