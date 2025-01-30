'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { Location } from '@/lib/types';
import { getLocations } from '@/lib/supabase';

interface LocationContextType {
    locations: Location[];
    isLoading: boolean;
    error: string | null;
    refreshLocations: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<{
        locations: Location[];
        isLoading: boolean;
        error: string | null;
    }>({
        locations: [],
        isLoading: true,
        error: null,
    });

    const loadLocations = async () => {
        try {
            setState(prev => ({ ...prev, isLoading: true, error: null }));
            const data = await getLocations();
            setState({
                locations: data || [],
                isLoading: false,
                error: null,
            });
        } catch (error) {
            console.error('Error loading locations:', error);
            setState(prev => ({
                ...prev,
                isLoading: false,
                error: 'Failed to load locations',
            }));
        }
    };

    useEffect(() => {
        loadLocations();
    }, []);

    return (
        <LocationContext.Provider
            value={{
                ...state,
                refreshLocations: loadLocations,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
}

export function useLocations() {
    const context = useContext(LocationContext);
    if (context === undefined) {
        throw new Error('useLocations must be used within a LocationProvider');
    }
    return context;
} 