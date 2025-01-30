# Supabase CMS Plan for Beforest Events Website

## Database Schema

### 1. Location Management

#### locations
- `id` (uuid, primary key)
- `slug` (text, unique) - URL friendly location name
- `name` (text) - Location display name
- `description` (text)
- `features` (jsonb) - Array of location features
- `highlights` (jsonb) - Key highlights of the location
- `is_active` (boolean)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### location_images
- `id` (uuid, primary key)
- `location_id` (uuid, foreign key to locations)
- `image_url` (text)
- `is_hero` (boolean)
- `order` (integer)
- `alt_text` (text)
- `created_at` (timestamp with time zone)

### 2. Event Management

#### events
- `id` (uuid, primary key)
- `location_id` (uuid, foreign key to locations)
- `slug` (text, unique)
- `title` (text)
- `description` (text)
- `start_date` (timestamp with time zone)
- `end_date` (timestamp with time zone)
- `total_capacity` (integer)
- `current_participants` (integer)
- `is_featured` (boolean)
- `status` (text) - ['upcoming', 'ongoing', 'completed', 'cancelled']
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### event_images
- `id` (uuid, primary key)
- `event_id` (uuid, foreign key to events)
- `image_url` (text)
- `is_hero` (boolean)
- `order` (integer)
- `alt_text` (text)
- `created_at` (timestamp with time zone)

#### event_pricing
- `id` (uuid, primary key)
- `event_id` (uuid, foreign key to events)
- `category` (text) - ['adult', 'child', 'camping_gear']
- `price` (decimal)
- `description` (text)
- `max_quantity` (integer)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### event_food_options
- `id` (uuid, primary key)
- `event_id` (uuid, foreign key to events)
- `name` (text)
- `description` (text)
- `price` (decimal)
- `max_quantity` (integer)
- `is_vegetarian` (boolean)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### 3. User Management

#### users
- `id` (uuid, primary key)
- `email` (text, unique)
- `full_name` (text)
- `phone` (text)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

### 4. Registration and Payment Management

#### registrations
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key to users)
- `event_id` (uuid, foreign key to events)
- `total_amount` (decimal)
- `phonepay_transaction_id` (text)
- `payment_status` (text) - ['pending', 'completed', 'failed']
- `payment_date` (timestamp with time zone)
- `booking_details` (jsonb) - Stores all booking choices
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### registration_pricing_details
- `id` (uuid, primary key)
- `registration_id` (uuid, foreign key to registrations)
- `pricing_id` (uuid, foreign key to event_pricing)
- `quantity` (integer)
- `amount` (decimal)
- `created_at` (timestamp with time zone)

#### registration_food_details
- `id` (uuid, primary key)
- `registration_id` (uuid, foreign key to registrations)
- `food_option_id` (uuid, foreign key to event_food_options)
- `quantity` (integer)
- `amount` (decimal)
- `created_at` (timestamp with time zone)

### 5. Confirmation Management

#### confirmation_templates
- `id` (uuid, primary key)
- `type` (text) - ['success_page', 'failure_page', 'email']
- `title` (text)
- `content` (jsonb) - Template content with variable placeholders
- `is_active` (boolean)
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### confirmation_variables
- `id` (uuid, primary key)
- `name` (text) - e.g., 'event_name', 'booking_id', 'amount'
- `description` (text)
- `example_value` (text)
- `created_at` (timestamp with time zone)

### 6. PhonePe Integration (Simplified)

#### phonepay_config
- `id` (uuid, primary key)
- `merchant_id` (text)
- `salt_key` (text)
- `is_production` (boolean) - false for development, true for production
- `redirect_url` (text) - Base URL for payment redirects
- `callback_url` (text) - Base URL for webhooks
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

#### payment_transactions
- `id` (uuid, primary key)
- `registration_id` (uuid, foreign key to registrations)
- `transaction_id` (text, unique) - Custom transaction ID for PhonePe
- `amount` (decimal)
- `status` (text) - ['pending', 'completed', 'failed']
- `payment_response` (jsonb) - Response from PhonePe
- `created_at` (timestamp with time zone)
- `updated_at` (timestamp with time zone)

## SQL Functions and Policies

### Row Level Security (RLS) Policies

1. Location and Event Management:
```sql
-- Allow public read access for active locations and events
CREATE POLICY "Public can view active locations"
ON locations FOR SELECT
USING (is_active = true);

-- Only admins can modify location data
CREATE POLICY "Admins can manage locations"
ON locations FOR ALL
USING (auth.role() = 'admin');
```

2. Registration Management:
```sql
-- Users can view their own registrations
CREATE POLICY "Users view own registrations"
ON registrations FOR SELECT
USING (auth.uid() = user_id);

-- Users can create registrations
CREATE POLICY "Users can create registrations"
ON registrations FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

### Functions

1. Event Registration:
```sql
-- Function to create a new registration with pricing and food details
CREATE OR REPLACE FUNCTION create_event_registration(
    p_user_id UUID,
    p_event_id UUID,
    p_pricing_details JSONB,
    p_food_details JSONB
)
RETURNS UUID AS $$
DECLARE
    v_registration_id UUID;
    v_total_amount DECIMAL := 0;
BEGIN
    -- Start transaction
    BEGIN
        -- Check event capacity
        IF NOT check_event_capacity(p_event_id, p_pricing_details) THEN
            RAISE EXCEPTION 'Event capacity exceeded';
        END IF;

        -- Calculate total amount
        SELECT calculate_registration_amount(p_pricing_details, p_food_details)
        INTO v_total_amount;

        -- Create registration
        INSERT INTO registrations (
            user_id, event_id, total_amount, payment_status,
            booking_details
        ) VALUES (
            p_user_id, p_event_id, v_total_amount, 'pending',
            jsonb_build_object(
                'pricing', p_pricing_details,
                'food', p_food_details
            )
        )
        RETURNING id INTO v_registration_id;

        -- Insert pricing details
        INSERT INTO registration_pricing_details (
            registration_id, pricing_id, quantity, amount
        )
        SELECT 
            v_registration_id,
            (detail->>'pricing_id')::UUID,
            (detail->>'quantity')::INTEGER,
            (detail->>'amount')::DECIMAL
        FROM jsonb_array_elements(p_pricing_details) detail;

        -- Insert food details
        INSERT INTO registration_food_details (
            registration_id, food_option_id, quantity, amount
        )
        SELECT 
            v_registration_id,
            (detail->>'food_option_id')::UUID,
            (detail->>'quantity')::INTEGER,
            (detail->>'amount')::DECIMAL
        FROM jsonb_array_elements(p_food_details) detail;

        RETURN v_registration_id;
    END;
END;
$$ LANGUAGE plpgsql;
```

2. Confirmation Template Processing:
```sql
-- Function to get confirmation template with populated variables
CREATE OR REPLACE FUNCTION get_populated_confirmation_template(
    p_type TEXT,
    p_registration_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_template RECORD;
    v_registration RECORD;
    v_content JSONB;
BEGIN
    -- Get template
    SELECT * INTO v_template
    FROM confirmation_templates
    WHERE type = p_type AND is_active = true
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Template not found for type: %', p_type;
    END IF;

    -- Get registration details with related data
    SELECT
        r.*,
        e.title as event_title,
        e.start_date,
        l.name as location_name,
        u.full_name,
        u.email,
        pt.transaction_id
    INTO v_registration
    FROM registrations r
    JOIN events e ON e.id = r.event_id
    JOIN locations l ON l.id = e.location_id
    JOIN users u ON u.id = r.user_id
    LEFT JOIN payment_transactions pt ON pt.registration_id = r.id
    WHERE r.id = p_registration_id;

    -- Populate template variables
    v_content = v_template.content;
    v_content = jsonb_set(v_content, '{event_name}', to_jsonb(v_registration.event_title));
    v_content = jsonb_set(v_content, '{location}', to_jsonb(v_registration.location_name));
    v_content = jsonb_set(v_content, '{date}', to_jsonb(v_registration.start_date));
    v_content = jsonb_set(v_content, '{customer_name}', to_jsonb(v_registration.full_name));
    v_content = jsonb_set(v_content, '{booking_id}', to_jsonb(v_registration.id));
    v_content = jsonb_set(v_content, '{amount}', to_jsonb(v_registration.total_amount));
    v_content = jsonb_set(v_content, '{transaction_id}', to_jsonb(v_registration.transaction_id));
    v_content = jsonb_set(v_content, '{booking_details}', v_registration.booking_details);

    RETURN jsonb_build_object(
        'title', v_template.title,
        'content', v_content
    );
END;
$$ LANGUAGE plpgsql;

3. Payment Processing:
```sql
-- Function to update payment status and confirm registration
CREATE OR REPLACE FUNCTION confirm_payment(
    p_registration_id UUID,
    p_phonepay_transaction_id TEXT,
    p_status TEXT
)
RETURNS VOID AS $$
BEGIN
    UPDATE registrations
    SET payment_status = p_status,
        phonepay_transaction_id = p_phonepay_transaction_id,
        payment_date = CASE 
            WHEN p_status = 'completed' THEN NOW()
            ELSE NULL
        END,
        updated_at = NOW()
    WHERE id = p_registration_id;

    -- Update event capacity if payment is completed
    IF p_status = 'completed' THEN
        UPDATE events e
        SET current_participants = current_participants + (
            SELECT COALESCE(SUM(quantity), 0)
            FROM registration_pricing_details
            WHERE registration_id = p_registration_id
        )
        FROM registrations r
        WHERE r.id = p_registration_id
        AND e.id = r.event_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
```

## Implementation Steps

1. Database Setup:
   - Create all tables with proper indexes
   - Set up RLS policies
   - Create necessary SQL functions
   - Set up triggers for automated timestamps

2. PhonePe Integration:
   - Install phonepepg package: `npm i phonepepg`
   - Configure environment variables:
     ```env
     PHONEPAY_MERCHANT_ID=your_merchant_id
     PHONEPAY_SALT_KEY=your_salt_key
     ```
   - Create payment routes:
     - /api/payment/initiate - For payment initialization
     - /api/payment/callback/[transactionId] - For PhonePe webhooks
     - /success - Success redirect page
     - /failure - Failure redirect page
   - Implement payment status tracking in Supabase
   - Set up error handling and logging

3. Content Management:
   - Set up location management
   - Configure event management
   - Implement media library
   - Set up pricing and food options

4. User Flow Implementation:
   - Location discovery
   - Event listing and filtering
   - Registration process
   - Payment integration
   - Confirmation system

5. Testing:
   - Test registration flow
   - Verify payment processing
   - Test capacity management
   - Validate booking confirmations

## Next.js Implementation

### Payment Gateway Setup
```typescript
// lib/phonepay.ts
import PhonepeGateway from 'phonepepg';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export const gateway = new PhonepeGateway({
    merchantId: process.env.PHONEPAY_MERCHANT_ID!,
    saltKey: process.env.PHONEPAY_SALT_KEY!,
    isDev: process.env.NODE_ENV === 'development'
});

export async function initiatePayment(registrationId: string) {
    const { data, error } = await supabase
        .from('registrations')
        .select('*, users(id), events(title)')
        .eq('id', registrationId)
        .single();

    if (error || !data) throw new Error('Registration not found');

    const transactionId = `TR${Date.now()}_${registrationId}`;
    
    // Create payment transaction record
    await supabase.from('payment_transactions').insert({
        registration_id: registrationId,
        transaction_id: transactionId,
        amount: data.total_amount,
        status: 'pending'
    });

    // Initialize PhonePe payment
    return await gateway.initPayment({
        amount: data.total_amount * 100, // Convert to paise
        transactionId: transactionId,
        userId: data.users.id,
        redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/redirect/${transactionId}`,
        callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback/${transactionId}`
    });
}
```

### API Routes

```typescript
// app/api/payment/initiate/route.ts
import { initiatePayment } from '@/lib/phonepay';

export async function POST(req: Request) {
    try {
        const { registrationId } = await req.json();
        const response = await initiatePayment(registrationId);
        return Response.json(response);
    } catch (error) {
        console.error('Payment initiation failed:', error);
        return Response.json(
            { error: 'Payment initialization failed' },
            { status: 500 }
        );
    }
}

// app/api/payment/callback/[transactionId]/route.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

export async function POST(
    req: Request,
    { params: { transactionId } }: { params: { transactionId: string } }
) {
    try {
        const payload = await req.json();
        const status = payload.code === 'PAYMENT_SUCCESS' ? 'completed' : 'failed';

        // Update payment transaction
        await supabase
            .from('payment_transactions')
            .update({
                status,
                payment_response: payload,
                updated_at: new Date().toISOString()
            })
            .eq('transaction_id', transactionId);

        // Update registration status
        if (status === 'completed') {
            const { data: transaction } = await supabase
                .from('payment_transactions')
                .select('registration_id')
                .eq('transaction_id', transactionId)
                .single();

            if (transaction) {
                await supabase
                    .from('registrations')
                    .update({
                        payment_status: 'completed',
                        payment_date: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', transaction.registration_id);
            }
        }

        return Response.json({ success: true });
    } catch (error) {
        console.error('Payment callback processing failed:', error);
        return Response.json(
            { error: 'Callback processing failed' },
            { status: 500 }
        );
    }
}
```

### Payment Status Pages

```typescript
// app/payment/redirect/[transactionId]/page.tsx
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default async function PaymentRedirect({
    params: { transactionId }
}: {
    params: { transactionId: string }
}) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { data: transaction } = await supabase
        .from('payment_transactions')
        .select('registration_id, status')
        .eq('transaction_id', transactionId)
        .single();

    if (transaction?.status === 'completed') {
        redirect(`/payment/success?registration=${transaction.registration_id}`);
    } else {
        redirect(`/payment/failure?registration=${transaction.registration_id}`);
    }
}

// app/payment/success/page.tsx
export default async function SuccessPage({
    searchParams
}: {
    searchParams: { registration: string }
}) {
    const { data: template } = await supabase
        .rpc('get_populated_confirmation_template', {
            p_type: 'success_page',
            p_registration_id: searchParams.registration
        });

    if (!template) {
        return <div>Error loading confirmation details</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{template.title}</h1>
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <div className="prose max-w-none">
                    {/* Event Details */}
                    <h2>Event Details</h2>
                    <p>Event: {template.content.event_name}</p>
                    <p>Location: {template.content.location}</p>
                    <p>Date: {new Date(template.content.date).toLocaleDateString()}</p>

                    {/* Booking Details */}
                    <h2>Booking Information</h2>
                    <p>Booking ID: {template.content.booking_id}</p>
                    <p>Transaction ID: {template.content.transaction_id}</p>
                    <p>Amount Paid: ₹{template.content.amount}</p>

                    {/* Customer Details */}
                    <h2>Customer Details</h2>
                    <p>Name: {template.content.customer_name}</p>

                    {/* Booking Choices */}
                    <h2>Your Choices</h2>
                    <div className="mt-4">
                        {template.content.booking_details.pricing.map((item: any) => (
                            <div key={item.pricing_id} className="mb-2">
                                <p>{item.category}: {item.quantity} x ₹{item.amount}</p>
                            </div>
                        ))}
                        {template.content.booking_details.food.map((item: any) => (
                            <div key={item.food_option_id} className="mb-2">
                                <p>{item.name}: {item.quantity} x ₹{item.amount}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// app/payment/failure/page.tsx
export default async function FailurePage({
    searchParams
}: {
    searchParams: { registration: string }
}) {
    const { data: template } = await supabase
        .rpc('get_populated_confirmation_template', {
            p_type: 'failure_page',
            p_registration_id: searchParams.registration
        });

    if (!template) {
        return <div>Error loading failure details</div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">{template.title}</h1>
            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="prose max-w-none">
                    <p>Event: {template.content.event_name}</p>
                    <p>Booking ID: {template.content.booking_id}</p>
                    <p>Transaction ID: {template.content.transaction_id}</p>
                    
                    <div className="mt-6">
                        <h2>What went wrong?</h2>
                        <p>Your payment was not successful. This could be due to:</p>
                        <ul>
                            <li>Insufficient funds</li>
                            <li>Bank server issues</li>
                            <li>Transaction timeout</li>
                        </ul>
                    </div>

                    <div className="mt-6">
                        <h2>What can you do?</h2>
                        <button
                            onClick={() => window.location.href = `/events/${template.content.event_slug}`}
                            className="bg-primary text-white px-6 py-2 rounded-lg"
                        >
                            Try Booking Again
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
import { createClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';

export default async function PaymentRedirect({
    params: { transactionId }
}: {
    params: { transactionId: string }
}) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_KEY!
    );

    const { data } = await supabase
        .from('payment_transactions')
        .select('status')
        .eq('transaction_id', transactionId)
        .single();

    if (data?.status === 'completed') {
        redirect('/payment/success');
    } else {
        redirect('/payment/failure');
    }
}
```

## Maintenance Considerations

1. Regular Backups:
   - Daily automated backups
   - Point-in-time recovery setup

2. Monitoring:
   - Track failed transactions
   - Monitor event capacities
   - Log payment processing errors

3. Security:
   - Regular security audits
   - API key rotation
   - SSL certificate management

## Notes

1. All tables use UUIDs for primary keys
2. Implement proper indexing for frequently queried fields
3. Use JSONB for flexible content structures
4. Implement proper error handling and logging
5. Follow security best practices for payment processing
6. Maintain audit logs for all critical operations
7. Implement rate limiting for registration endpoints
8. Use prepared statements to prevent SQL injection