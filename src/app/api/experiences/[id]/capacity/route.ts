import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    }
);

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { data: experience, error } = await supabase
            .from('experiences')
            .select('total_capacity, current_participants')
            .eq('id', params.id)
            .single();

        if (error) {
            console.error('Error fetching experience capacity:', error);
            return NextResponse.json(
                { error: 'Failed to fetch capacity', details: error.message },
                { status: 500 }
            );
        }

        if (!experience) {
            return NextResponse.json(
                { error: 'Experience not found' },
                { status: 404 }
            );
        }

        const available = experience.total_capacity - experience.current_participants;
        const total = experience.total_capacity;

        return NextResponse.json({
            capacity: {
                available,
                total
            }
        });
    } catch (error) {
        console.error('Unexpected error checking capacity:', error);
        return NextResponse.json(
            { 
                error: 'An unexpected error occurred',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
} 