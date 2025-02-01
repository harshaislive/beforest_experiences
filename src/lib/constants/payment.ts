export const PAYMENT_STATUS = {
    PENDING: 'pending',
    SUCCESS: 'completed',
    FAILED: 'failed'
} as const;

export const PAYMENT_MESSAGES = {
    [PAYMENT_STATUS.PENDING]: 'Your payment is currently being processed. This page will automatically refresh to show the latest status.',
    [PAYMENT_STATUS.SUCCESS]: 'Your payment has been confirmed and your experience booking is complete.',
    [PAYMENT_STATUS.FAILED]: 'There was an issue processing your payment. Please try again or contact support if the issue persists.'
} as const;

export const PAYMENT_TITLES = {
    [PAYMENT_STATUS.PENDING]: 'Payment Processing',
    [PAYMENT_STATUS.SUCCESS]: 'Experience Confirmation',
    [PAYMENT_STATUS.FAILED]: 'Payment Failed'
} as const;

export const PAYMENT_EMOJIS = {
    [PAYMENT_STATUS.PENDING]: '🕒',
    [PAYMENT_STATUS.SUCCESS]: '✅',
    [PAYMENT_STATUS.FAILED]: '❌'
} as const;

export const PAYMENT_NEXT_STEPS = {
    [PAYMENT_STATUS.PENDING]: [
        'Please wait while we process your payment',
        'This page will automatically refresh to show the latest status',
        'Do not close this page until the payment is complete'
    ],
    [PAYMENT_STATUS.SUCCESS]: [
        'Save your experience booking ID for future reference',
        'Arrive at the venue 15 minutes before the experience starts',
        'Contact us if you have any questions'
    ],
    [PAYMENT_STATUS.FAILED]: [
        'Try making the payment again',
        'If the issue persists, please contact our support team',
        'We\'re here to help resolve any payment issues'
    ]
} as const;

export type PaymentStatusType = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS]; 