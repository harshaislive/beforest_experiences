import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Location } from '@/lib/types';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useLocations() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLocations = async () => {
            try {
                const { data, error } = await supabase
                    .from('locations')
                    .select('*')
                    .eq('is_active', true)
                    .order('name');

                if (error) throw error;
                setLocations(data || []);
            } catch (error) {
                console.error('Error fetching locations:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLocations();
    }, []);

    return { locations, isLoading };
} 