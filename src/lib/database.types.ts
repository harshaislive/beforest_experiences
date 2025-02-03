export interface Database {
    public: {
        Tables: {
            registrations: {
                Row: {
                    id: string;
                    user_id: string;
                    experience_id: string;
                    total_amount: number;
                    transaction_id: string | null;
                    payment_status: string;
                    payment_date: string | null;
                    booking_details: any;
                    created_at: string;
                    updated_at: string;
                    events: {
                        id: string;
                        title: string;
                        start_date: string;
                    };
                };
                Insert: {
                    id?: string;
                    user_id: string;
                    experience_id: string;
                    total_amount: number;
                    transaction_id?: string | null;
                    payment_status?: string;
                    payment_date?: string | null;
                    booking_details?: any;
                    created_at?: string;
                    updated_at?: string;
                };
                Update: {
                    id?: string;
                    user_id?: string;
                    experience_id?: string;
                    total_amount?: number;
                    transaction_id?: string | null;
                    payment_status?: string;
                    payment_date?: string | null;
                    booking_details?: any;
                    created_at?: string;
                    updated_at?: string;
                };
            };
            payment_transactions: {
                Row: {
                    id: string;
                    registration_id: string | null;
                    transaction_id: string;
                    amount: number;
                    status: 'pending' | 'completed' | 'failed';
                    payment_response: Record<string, any> | null;
                    created_at: string | null;
                    updated_at: string | null;
                };
                Insert: {
                    id?: string;
                    registration_id?: string | null;
                    transaction_id: string;
                    amount: number;
                    status?: 'pending' | 'completed' | 'failed';
                    payment_response?: Record<string, any> | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
                Update: {
                    id?: string;
                    registration_id?: string | null;
                    transaction_id?: string;
                    amount?: number;
                    status?: 'pending' | 'completed' | 'failed';
                    payment_response?: Record<string, any> | null;
                    created_at?: string | null;
                    updated_at?: string | null;
                };
            };
            events: {
                Row: {
                    id: string;
                    title: string;
                    start_date: string;
                    pricing_options: Array<{
                        id: string;
                        category: string;
                        price: number;
                        description: string;
                        max_quantity: number;
                    }>;
                    food_options: Array<{
                        id: string;
                        name: string;
                        description: string;
                        price: number;
                        max_quantity: number;
                        is_vegetarian: boolean;
                    }>;
                };
                Insert: {
                    id?: string;
                    title: string;
                    start_date: string;
                    pricing_options: Array<{
                        id: string;
                        category: string;
                        price: number;
                        description: string;
                        max_quantity: number;
                    }>;
                    food_options: Array<{
                        id: string;
                        name: string;
                        description: string;
                        price: number;
                        max_quantity: number;
                        is_vegetarian: boolean;
                    }>;
                };
                Update: {
                    id?: string;
                    title?: string;
                    start_date?: string;
                    pricing_options?: Array<{
                        id: string;
                        category: string;
                        price: number;
                        description: string;
                        max_quantity: number;
                    }>;
                    food_options?: Array<{
                        id: string;
                        name: string;
                        description: string;
                        price: number;
                        max_quantity: number;
                        is_vegetarian: boolean;
                    }>;
                };
            };
        };
        Views: {
            [_ in never]: never;
        };
        Functions: {
            [_ in never]: never;
        };
        Enums: {
            [_ in never]: never;
        };
    };
} 