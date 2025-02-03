-- First, drop the existing type check constraint
ALTER TABLE confirmation_templates 
DROP CONSTRAINT IF EXISTS confirmation_templates_type_check;

-- Add new type check constraint with payment types
ALTER TABLE confirmation_templates 
ADD CONSTRAINT confirmation_templates_type_check 
CHECK (type IN ('success_page', 'failure_page', 'email', 'payment_success', 'payment_failure'));

-- Insert new payment templates
INSERT INTO confirmation_templates (type, title, content, is_active) VALUES
(
    'payment_success',
    'Payment Confirmation',
    jsonb_build_object(
        'sections', jsonb_build_array(
            jsonb_build_object(
                'type', 'heading',
                'content', 'Thank you for your payment!'
            ),
            jsonb_build_object(
                'type', 'paragraph',
                'content', 'Your payment has been successfully processed and your registration is now confirmed.'
            ),
            jsonb_build_object(
                'type', 'heading',
                'content', 'Registration Details'
            ),
            jsonb_build_object(
                'type', 'list',
                'content', E'Event: {{event_title}}\nDate: {{event_date}}\nAmount Paid: ₹{{amount}}\nTransaction ID: {{transaction_id}}'
            ),
            jsonb_build_object(
                'type', 'paragraph',
                'content', 'A confirmation email has been sent to {{email}} with these details.'
            ),
            jsonb_build_object(
                'type', 'paragraph',
                'content', 'If you have any questions, please contact our support team.'
            )
        )
    ),
    true
),
(
    'payment_failure',
    'Payment Failed',
    jsonb_build_object(
        'sections', jsonb_build_array(
            jsonb_build_object(
                'type', 'heading',
                'content', 'Payment Unsuccessful'
            ),
            jsonb_build_object(
                'type', 'paragraph',
                'content', 'We were unable to process your payment. No charges have been made to your account.'
            ),
            jsonb_build_object(
                'type', 'list',
                'content', E'Event: {{event_title}}\nAmount: ₹{{amount}}\nTransaction ID: {{transaction_id}}'
            ),
            jsonb_build_object(
                'type', 'paragraph',
                'content', 'Please try again or contact our support team if you continue to experience issues.'
            )
        )
    ),
    true
); 