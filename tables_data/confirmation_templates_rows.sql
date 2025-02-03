INSERT INTO "public"."confirmation_templates" ("id", "type", "title", "content", "is_active", "created_at", "updated_at") VALUES ('5da16d2f-0c96-43b9-b74c-752d53761482', 'payment_success', 'Payment Confirmation', '{"sections":[{"type":"heading","content":"Thank you for your payment!"},{"type":"paragraph","content":"Your payment has been successfully processed and your registration is now confirmed."},{"type":"heading","content":"Personal Information"},{"type":"list","content":"Name: {{name}}\\nEmail: {{email}}\\nPhone: {{phone}}"},{"type":"heading","content":"Event Information"},{"type":"list","content":"Event: {{event_title}}\\nLocation: {{location}}\\nDate: {{event_date}}"},{"type":"heading","content":"Payment Details"},{"type":"list","content":"Amount Paid: {{amount}}\\nTransaction ID: {{transaction_id}}"},{"type":"heading","content":"Booking Details"},{"type":"list","content":"Tickets: {{tickets}}\\nFood Items: {{food_items}}"},{"type":"paragraph","content":"A confirmation email has been sent to {{email}} with these details."},{"type":"paragraph","content":"If you have any questions, please contact our support team."}]}', 'true', '2025-01-29 20:51:36.703438+00', '2025-01-29 20:51:36.703438+00'), ('9585c71c-bbf8-4006-87ed-81728301ef03', 'payment_success', 'Payment Success', '{"sections":[{"type":"text","content":"Your payment has been processed successfully. Here are your booking details:"},{"type":"details","items":[{"label":"Event","value":"{{event_title}}"},{"label":"Amount Paid","value":"₹{{amount}}"},{"label":"Transaction ID","value":"{{transaction_id}}"},{"label":"Payment Date","value":"{{payment_date}}"}]},{"type":"text","content":"We've sent a confirmation email to your registered email address with all the details."},{"type":"text","content":"If you have any questions about your booking, please contact us at support@beforest.in"}]}', 'true', '2025-01-30 11:29:10.082653+00', '2025-01-30 11:29:10.082653+00'), ('b0c1d2e3-f4a5-3b4c-6d7e-0f1a2b3c4d5e', 'success_page', 'Booking Confirmed!', '{"date":null,"amount":null,"location":null,"booking_id":null,"event_name":null,"customer_name":null,"transaction_id":null,"booking_details":{"food":[],"pricing":[]}}', 'true', '2025-01-27 16:25:10.76961+00', '2025-01-27 16:25:10.76961+00'), ('c1d2e3f4-a5b6-4c5d-7e8f-1a2b3c4d5e6f', 'failure_page', 'Payment Failed', '{"booking_id":null,"event_name":null,"event_slug":null,"error_message":null,"transaction_id":null}', 'true', '2025-01-27 16:25:10.76961+00', '2025-01-27 16:25:10.76961+00'), ('dc87dcf7-daad-43ff-b25c-e096c1d5be7c', 'payment_failure', 'Payment Failed', '{"sections":[{"type":"text","content":"We apologize, but your payment could not be processed successfully."},{"type":"details","items":[{"label":"Event","value":"{{event_title}}"},{"label":"Amount","value":"₹{{amount}}"},{"label":"Error Message","value":"{{error_message}}"},{"label":"Transaction ID","value":"{{transaction_id}}"}]},{"type":"text","content":"Don't worry, your booking is still reserved. You can try the payment again or contact our support team for assistance."},{"type":"action","content":{"url":"/events/{{event_slug}}","text":"Try Payment Again"}},{"type":"text","content":"If you continue to face issues, please contact us at support@beforest.in or call us at +91-XXXXXXXXXX"}]}', 'true', '2025-01-30 11:29:34.882893+00', '2025-01-30 11:29:34.882893+00'), ('e6ebd732-e3c9-426c-b67b-516077400c64', 'payment_failure', 'Payment Failed', '{"sections":[{"type":"heading","content":"Payment Unsuccessful"},{"type":"paragraph","content":"We were unable to process your payment. No charges have been made to your account."},{"type":"list","content":"Event: {{event_title}}\\nAmount: ₹{{amount}}\\nTransaction ID: {{transaction_id}}"},{"type":"paragraph","content":"Please try again or contact our support team if you continue to experience issues."}]}', 'true', '2025-01-29 20:51:36.703438+00', '2025-01-29 20:51:36.703438+00');