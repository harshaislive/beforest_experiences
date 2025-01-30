// Types matching database schema
export interface RegistrationPricingDetail {
    pricing_id: string;
    quantity: number;
    amount: number;
}

export interface RegistrationFoodDetail {
    food_option_id: string;
    quantity: number;
    amount: number;
}

export interface BookingData {
    // Maps to users table
    personal_info: {
        full_name: string;
        email: string;
        phone: string;
    };
    // Maps to registrations table
    booking_details: {
        event_id: string;
        total_amount: number;
        // Maps to registration_pricing_details table
        pricing: RegistrationPricingDetail[];
        // Maps to registration_food_details table
        food: RegistrationFoodDetail[];
        // Additional booking details stored in jsonb booking_details column
        dietary_restrictions?: string;
        emergency_contact: {
            name: string;
            phone: string;
            relation: string;
        };
    };
}

export type PaymentStatus = 'pending' | 'completed' | 'failed'; 