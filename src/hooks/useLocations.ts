import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export interface Location {
  id: number;
  name: string;
  slug: string;
  is_active: boolean;
}

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase
          .from('locations')
          .select('id, name, slug, is_active')
          .eq('is_active', true)
          .order('name');

        if (error) throw error;

        setLocations(data || []);
      } catch (err) {
        console.error('Error fetching locations:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch locations');
      } finally {
        setIsLoading(false);
      }
    }

    fetchLocations();
  }, []);

  return { locations, isLoading, error };
} 