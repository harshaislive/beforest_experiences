import { createClient } from '@supabase/supabase-js';
import PhonepeGateway from './phonepepg';
import { Database } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

export class PaymentService {
    private phonepeGateway: PhonepeGateway;
    private supabase;

    constructor(config: {
        merchantId: string;
        saltKey: string;
        saltIndex: number;
        isDev?: boolean;
        supabaseUrl: string;
        supabaseKey: string;
    }) {
        this.phonepeGateway = new PhonepeGateway({
            merchantId: config.merchantId,
            saltKey: config.saltKey,
            saltIndex: config.saltIndex,
            isDev: config.isDev
        });

        this.supabase = createClient<Database>(
            config.supabaseUrl,
            config.supabaseKey
        );
    }

    private generateTransactionId(): string {
        // Generate a shorter UUID (first 8 chars) and combine with timestamp
        const shortUuid = uuidv4().split('-')[0];
        const timestamp = Date.now().toString(36); // Base36 timestamp
        return `PH${timestamp}${shortUuid}`;
    }

    private async rollbackTransaction(transactionId: string) {
        try {
            // Delete payment transaction
            await this.supabase
                .from('payment_transactions')
                .delete()
                .eq('id', transactionId);

            // Log the rollback
            await this.supabase
                .from('payment_status_logs')
                .insert({
                    transaction_id: transactionId,
                    status: 'failed',
                    response_data: { message: 'Transaction rolled back due to error' }
                });
        } catch (error) {
            console.error('Rollback error:', error);
            // We don't throw here as this is already error handling
        }
    }

    async initiatePayment(params: {
        registrationId: string;
        amount: number;
        userId: string;
        mobileNumber?: string;
    }) {
        let transactionId: string | null = null;

        try {
            transactionId = this.generateTransactionId();

            // Convert amount to paise (1 rupee = 100 paise)
            const amountInPaise = Math.round(params.amount * 100);

            // Create payment transaction record
            const { data: transaction, error: transactionError } = await this.supabase
                .from('payment_transactions')
                .insert({
                    registration_id: params.registrationId,
                    transaction_id: transactionId,
                    amount: params.amount, // Store original amount in rupees
                    status: 'pending'
                })
                .select()
                .single();

            if (transactionError) {
                throw new Error(`Failed to create transaction: ${transactionError.message}`);
            }

            // Update registration with transaction ID
            const { error: registrationError } = await this.supabase
                .from('registrations')
                .update({ 
                    transaction_id: transactionId,
                    payment_status: 'pending'
                })
                .eq('id', params.registrationId);

            if (registrationError) {
                await this.rollbackTransaction(transaction.id);
                throw new Error(`Failed to update registration: ${registrationError.message}`);
            }

            // Log initial status
            await this.supabase
                .from('payment_status_logs')
                .insert({
                    transaction_id: transaction.id,
                    status: 'pending',
                    response_data: { message: 'Payment initiation started' }
                });

            // Ensure we have valid URLs for redirect and callback
            const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
            const redirectUrl = new URL(`/api/payment/callback/${transactionId}`, baseUrl).toString();
            const callbackUrl = new URL('/api/webhooks/phonepe', baseUrl).toString();

            console.log('Initiating payment with amount:', {
                originalAmount: params.amount,
                amountInPaise,
                transactionId,
                redirectUrl,
                callbackUrl
            });

            // Initiate payment with PhonePe using amount in paise
            const paymentResponse = await this.phonepeGateway.initPayment({
                amount: amountInPaise,
                merchantTransactionId: transactionId,
                merchantUserId: params.userId,
                redirectUrl,
                callbackUrl,
                mobileNumber: params.mobileNumber
            });

            if (!paymentResponse.success) {
                // If payment initiation failed but it's retryable, don't roll back
                if (paymentResponse.shouldRetry) {
                    console.log('Payment failed but is retryable:', paymentResponse);
                    return {
                        success: false,
                        error: paymentResponse.message || 'Payment initiation failed',
                        shouldRetry: true,
                        retryAfter: 3000, // Shorter retry delay for better UX
                        code: paymentResponse.code
                    };
                }

                // If it's not retryable, roll back and return error
                await this.rollbackTransaction(transaction.id);
                throw new Error(`Payment initiation failed: ${paymentResponse.message}`);
            }

            // Verify we have the required data
            if (!paymentResponse.data?.paymentUrl) {
                await this.rollbackTransaction(transaction.id);
                throw new Error('Invalid payment response: Missing payment URL');
            }

            // Log successful initiation
            await this.supabase
                .from('payment_status_logs')
                .insert({
                    transaction_id: transaction.id,
                    status: 'pending',
                    response_data: paymentResponse.data
                });

            return {
                success: true,
                data: {
                    ...paymentResponse.data,
                    transactionId: transaction.id,
                    redirectUrl: paymentResponse.data.paymentUrl
                }
            };
        } catch (error: any) {
            console.error('Payment initiation error:', error);

            // If we have a transaction ID but failed later, try to roll back
            if (transactionId) {
                await this.rollbackTransaction(transactionId);
            }

            // Check if the error has retry information
            const shouldRetry = error.shouldRetry || (error.response?.data?.shouldRetry) || false;
            const retryAfter = error.retryAfter || 3000;

            return {
                success: false,
                error: error.message,
                shouldRetry: shouldRetry,
                retryAfter: retryAfter,
                code: error.code || 'PAYMENT_ERROR'
            };
        }
    }

    async checkPaymentStatus(transactionId: string) {
        try {
            const { data: transaction, error } = await this.supabase
                .from('payment_transactions')
                .select(`
                    *,
                    registration:registrations (
                        id,
                        payment_status,
                        total_amount
                    )
                `)
                .eq('id', transactionId)
                .single();

            if (error) throw new Error(`Failed to fetch transaction: ${error.message}`);

            return {
                success: true,
                data: transaction
            };
        } catch (error: any) {
            console.error('Payment status check error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    async handlePaymentCallback(payload: any, signature: string) {
        try {
            // Verify signature first
            if (!this.phonepeGateway.verifyWebhookSignature(payload, signature)) {
                throw new Error('Invalid webhook signature');
            }

            const transactionId = payload.merchantTransactionId;
            const isSuccess = payload.code === 'PAYMENT_SUCCESS';

            // Call the new stored procedure to update payment status
            const { error } = await this.supabase.rpc('update_payment_status', {
                p_transaction_id: transactionId,
                p_status: isSuccess ? 'completed' : 'failed',
                p_response: payload
            });

            if (error) {
                console.error('Payment status update error:', error);
                throw new Error(`Failed to update payment status: ${error.message}`);
            }

            return { success: true };
        } catch (error: any) {
            console.error('Payment callback handling error:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
} 