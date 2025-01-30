import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Database } from '@/lib/database.types';

export async function getRegistrationById(id: string) {
    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: registration, error } = await supabase
        .from('registrations')
        .select(`
            *,
            event:events (
                id,
                title,
                start_date,
                pricing_options,
                food_options
            )
        `)
        .eq('id', id)
        .single();

    if (error) {
        console.error('Error fetching registration:', error);
        return null;
    }

    return registration;
} 