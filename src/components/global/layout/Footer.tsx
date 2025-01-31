'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NewsletterModal from '../Modals/NewsletterModal';
import { subscribeToNewsletter } from '@/lib/supabase';
import { useLocations } from '@/hooks/useLocations';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/beforestfarming/',
    icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/beforestfarming',
    icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/14587499',
    icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@BeforestFarming',
    icon: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z'
  },
  {
    name: 'Website',
    url: 'https://www.beforest.co',
    icon: 'M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9'
  }
];

export default function Footer() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscriptionMessage, setSubscriptionMessage] = useState('');
  const [subscriptionSuccess, setSubscriptionSuccess] = useState(true);
  const { locations, isLoading: isLoadingLocations } = useLocations();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const { success, message } = await subscribeToNewsletter(email, { source: 'footer' });
      setSubscriptionSuccess(success);
      setSubscriptionMessage(message);
      setIsModalOpen(true);
      if (success) {
        setEmail('');
      }
    } catch (error) {
      console.error('Failed to subscribe:', error);
      setSubscriptionSuccess(false);
      setSubscriptionMessage('Failed to subscribe. Please try again later.');
      setIsModalOpen(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <footer className="bg-gradient-to-b from-deep-brown to-deep-brown-light text-soft-beige">
        {/* Newsletter Section */}
        <div className="max-w-7xl mx-auto pt-16 pb-8 px-4 sm:px-6 lg:px-8">
          <div className="bg-deep-brown-light/30 rounded-2xl p-8 backdrop-blur-sm">
            <div className="max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-bold mb-2 text-soft-beige">Join Our Newsletter</h2>
              <p className="text-soft-beige/80 mb-6">
                Stay updated with our latest experiences and community stories.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-deep-brown text-soft-beige rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta text-sm min-w-0"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-terracotta text-soft-beige rounded-lg hover:bg-terracotta-light transition-colors text-sm font-medium flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                  {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto pb-16 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-soft-beige/10">
            {/* Logo and Description */}
            <div className="md:col-span-4 space-y-6">
              <Image 
                src="https://beforest.co/wp-content/uploads/2024/10/23-Beforest-Black-with-Tagline.png"
                alt="Beforest"
                width={120}
                height={40}
                className="h-10 w-auto invert"
              />
              <p className="text-soft-beige/80 text-sm leading-relaxed">
                Crafting transformative collective experiences in India&apos;s most enchanting locations. 
                Join us in nurturing nature, community, and personal growth.
              </p>
              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-soft-beige/80 hover:text-soft-beige transition-colors"
                    aria-label={social.name}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d={social.icon} />
                    </svg>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {/* Destinations */}
              <div className="space-y-4">
                <h3 className="text-base uppercase tracking-wider text-soft-beige font-medium">Destinations</h3>
                <ul className="space-y-3">
                  {isLoadingLocations ? (
                    <li className="text-soft-beige/60 text-sm">Loading locations...</li>
                  ) : locations.length > 0 ? (
                    locations.map((location) => (
                      <li key={location.id}>
                        <Link
                          href={`/${location.slug}`}
                          className="text-soft-beige/80 hover:text-soft-beige transition-colors text-sm flex items-center gap-2 group"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-150 transition-transform" />
                          {location.name}
                        </Link>
                      </li>
                    ))
                  ) : (
                    <li className="text-soft-beige/60 text-sm">No locations available</li>
                  )}
                </ul>
              </div>

              {/* Legal */}
              <div className="space-y-4">
                <h3 className="text-base uppercase tracking-wider text-soft-beige font-medium">Legal</h3>
                <ul className="space-y-3">
                  <li>
                    <Link
                      href="/privacy"
                      className="text-soft-beige/80 hover:text-soft-beige transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-150 transition-transform" />
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="text-soft-beige/80 hover:text-soft-beige transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-150 transition-transform" />
                      Terms & Conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/refund"
                      className="text-soft-beige/80 hover:text-soft-beige transition-colors text-sm flex items-center gap-2 group"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-terracotta group-hover:scale-150 transition-transform" />
                      Refund Policy
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-base uppercase tracking-wider text-soft-beige font-medium">Contact</h3>
                <ul className="space-y-3 text-sm text-soft-beige/80">
                  <li className="flex items-start gap-2">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="font-medium text-soft-beige">Hyderabad Office</p>
                      <p>126, Road Number 11,</p>
                      <p>ICRISAT Colony, Jubilee Hills</p>
                      <p>Hyderabad, Telangana 500033</p>
                    </div>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +91 89779 45351
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Mon – Fri (9:00 – 18:00)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-16 pt-8 border-t border-soft-beige/10 text-center text-soft-beige/60">
            <p className="text-sm">© {mounted ? new Date().getFullYear() : ''} Beforest. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <NewsletterModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        success={subscriptionSuccess}
        message={subscriptionMessage}
      />
    </>
  );
}
