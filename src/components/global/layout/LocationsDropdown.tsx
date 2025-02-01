'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useLocations } from '@/contexts/LocationContext';
import { getRandomIcon } from '@/config/locationIcons';

interface LocationsDropdownProps {
    className?: string;
}

export default function LocationsDropdown({ className = "text-sm" }: LocationsDropdownProps) {
    const { locations, isLoading } = useLocations();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [locationIcons, setLocationIcons] = useState<Record<string, { name: string; path: string }>>({});

    useEffect(() => {
        // Assign random icons to locations when they load
        if (locations && locations.length > 0) {
            const icons = locations.reduce((acc, location) => {
                acc[location.slug] = getRandomIcon();
                return acc;
            }, {} as Record<string, { name: string; path: string }>);
            setLocationIcons(icons);
        }
    }, [locations]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    if (isLoading) {
        return (
            <div className={`text-deep-brown/50 flex items-center gap-2 ${className}`}>
                <svg className="animate-spin h-4 w-4 text-terracotta" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Loading locations...
            </div>
        );
    }

    if (!locations || locations.length === 0) {
        return <div className={`text-deep-brown/50 ${className}`}>No locations available</div>;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 text-deep-brown hover:text-terracotta transition-colors font-medium tracking-wide ${className}`}
                aria-expanded={isOpen}
            >
                <span>Locations</span>
                <svg
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            <div
                className={`absolute top-full left-0 mt-2 w-56 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition-all duration-200 ${
                    isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 -translate-y-2 pointer-events-none'
                }`}
            >
                <div className="py-2">
                    {locations.map((location) => {
                        const icon = locationIcons[location.slug];
                        return (
                            <Link
                                key={location.slug}
                                href={`/${location.slug}`}
                                className={`flex items-center gap-3 px-4 py-3 text-deep-brown hover:bg-sage-50 transition-colors ${className}`}
                                onClick={() => setIsOpen(false)}
                            >
                                <svg
                                    className="w-5 h-5 text-terracotta"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={1.5}
                                        d={icon?.path}
                                    />
                                </svg>
                                <span className="font-medium">{location.name}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </div>
    );
} 