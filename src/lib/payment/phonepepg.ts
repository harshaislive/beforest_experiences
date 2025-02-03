import { createHash, createHmac, timingSafeEqual } from 'crypto';
import axios from 'axios';

class PhonePeError extends Error {
    code: string;
    shouldRetry: boolean;

    constructor(message: string, code: string = 'UNKNOWN_ERROR', shouldRetry: boolean = false) {
        super(message);
        this.name = 'PhonePeError';
        this.code = code;
        this.shouldRetry = shouldRetry;
    }
}

interface PhonePeConfig {
    merchantId: string;
    saltKey: string;
    saltIndex: number;
    isDev?: boolean;
}

interface PaymentRequest {
    amount: number;
    merchantTransactionId: string;
    merchantUserId: string;
    redirectUrl: string;
    callbackUrl: string;
    mobileNumber: string;
    deviceContext?: {
        deviceOS: 'ANDROID' | 'IOS' | 'WEB';
    };
}

interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
    code?: string;
    shouldRetry?: boolean;
}

async function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class PhonepeGateway {
    private config: PhonePeConfig;
    private baseUrl: string;
    private maxRetries = 5;
    private initialRetryDelay = 2000;
    private maxRetryDelay = 32000;

    constructor(config: PhonePeConfig) {
        // Validate config
        if (!config.merchantId || !config.saltKey) {
            console.error('PhonePe config validation failed:', {
                hasMerchantId: !!config.merchantId,
                hasSaltKey: !!config.saltKey,
                merchantIdLength: config.merchantId?.length,
                saltKeyLength: config.saltKey?.length,
                saltIndex: config.saltIndex,
                isDev: config.isDev
            });
            throw new Error('Invalid PhonePe configuration: Missing required credentials');
        }

        this.config = config;
        this.baseUrl = config.isDev 
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/hermes';

        console.log('PhonePe Gateway initialized:', {
            merchantId: config.merchantId,
            saltKeyLength: config.saltKey.length,
            saltIndex: config.saltIndex,
            isDev: config.isDev,
            baseUrl: this.baseUrl,
            environment: config.isDev ? 'sandbox' : 'production'
        });
    }

    private generateChecksum(payload: string): string {
        console.log('Generating checksum with:', {
            payloadLength: payload.length,
            saltKeyLength: this.config.saltKey.length,
            saltIndex: this.config.saltIndex,
            merchantId: this.config.merchantId
        });

        const data = payload + "/pg/v1/pay" + this.config.saltKey;
        const sha256 = createHash('sha256').update(data).digest('hex');
        const checksum = `${sha256}###${this.config.saltIndex}`;

        console.log('Generated checksum:', {
            checksumLength: checksum.length,
            saltIndex: this.config.saltIndex,
            checksum: checksum
        });

        return checksum;
    }

    verifyWebhookSignature(payload: any, signature: string): boolean {
        try {
            const data = JSON.stringify(payload);
            const expectedSignature = createHmac('sha256', this.config.saltKey)
                .update(data)
                .digest('hex');

            return timingSafeEqual(
                Buffer.from(signature),
                Buffer.from(expectedSignature)
            );
        } catch (error) {
            console.error('Webhook signature verification error:', error);
            return false;
        }
    }

    private calculateRetryDelay(attempt: number): number {
        const exponentialDelay = Math.min(
            this.maxRetryDelay,
            this.initialRetryDelay * Math.pow(2, attempt - 1)
        );
        const jitter = exponentialDelay * 0.2 * (Math.random() - 0.5);
        return Math.floor(exponentialDelay + jitter);
    }

    private shouldRetryError(error: any): boolean {
        if (!error.response) return false;

        const status = error.response.status;
        const errorCode = error.response?.data?.code;

        return (
            status === 429 ||
            status === 408 ||
            status === 500 ||
            status === 502 ||
            status === 503 ||
            status === 504 ||
            errorCode === 'INTERNAL_SERVER_ERROR' ||
            errorCode === 'SERVICE_UNAVAILABLE' ||
            errorCode === 'GATEWAY_ERROR'
        );
    }

    private async makeRequest(url: string, data: any, headers: any, attempt = 1): Promise<any> {
        try {
            console.log('Making PhonePe request:', {
                url,
                headers: {
                    ...headers,
                    'X-MERCHANT-ID': headers['X-MERCHANT-ID']
                },
                attempt
            });

            const response = await axios.post(url, data, { 
                headers,
                timeout: 30000 // 30 second timeout
            });
            
            console.log('PhonePe response:', {
                status: response.status,
                success: response.data.success,
                code: response.data.code,
                message: response.data.message
            });

            return response;
        } catch (error: any) {
            console.error('PhonePe request error:', {
                status: error.response?.status,
                data: error.response?.data,
                attempt,
                message: error.message
            });

            if (this.shouldRetryError(error) && attempt < this.maxRetries) {
                const delay = this.calculateRetryDelay(attempt);
                console.log(`Request failed. Retrying in ${delay}ms (attempt ${attempt} of ${this.maxRetries})`);
                await sleep(delay);
                return this.makeRequest(url, data, headers, attempt + 1);
            }

            throw new PhonePeError(
                error.response?.data?.message || error.message,
                error.response?.data?.code || 'UNKNOWN_ERROR',
                attempt < this.maxRetries
            );
        }
    }

    async initPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            // Construct the complete payload with required PhonePe fields
            const payload = {
                merchantId: this.config.merchantId,
                merchantTransactionId: request.merchantTransactionId,
                merchantUserId: request.merchantUserId,
                amount: request.amount,
                redirectUrl: request.redirectUrl,
                redirectMode: "POST",
                callbackUrl: request.callbackUrl,
                paymentInstrument: {
                    type: "PAY_PAGE"
                },
                mobileNumber: request.mobileNumber?.replace(/[^0-9]/g, '')
            };

            // Add debug logging for payload
            console.log('Constructing payment payload:', {
                merchantId: this.config.merchantId,
                amount: request.amount,
                merchantTransactionId: request.merchantTransactionId,
                baseUrl: this.baseUrl
            });

            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const checksum = this.generateChecksum(base64Payload);
            const url = `${this.baseUrl}/pg/v1/pay`;

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': this.config.merchantId
            };

            const requestBody = {
                request: base64Payload
            };

            console.log('Making PhonePe request with:', {
                url,
                headers: {
                    ...headers,
                    'X-VERIFY': `${checksum.substring(0, 10)}...`,
                },
                requestBody
            });

            const response = await this.makeRequest(url, requestBody, headers);
            
            // Extract the payment URL from the response
            const paymentUrl = response.data.data?.instrumentResponse?.redirectInfo?.url;
            
            if (!paymentUrl) {
                throw new PhonePeError(
                    'No payment URL received from PhonePe',
                    'INVALID_RESPONSE',
                    true
                );
            }

            return {
                success: response.data.success,
                code: response.data.code,
                message: response.data.message,
                data: {
                    ...response.data.data,
                    paymentUrl
                }
            };
        } catch (error: any) {
            console.error('Payment initiation error:', error.response?.data || error);
            
            // Check if this is a retryable error
            const isRetryable = this.shouldRetryError(error);
            const errorCode = error.response?.data?.code || error.code || 'UNKNOWN_ERROR';
            const errorMessage = error.response?.data?.message || error.message;

            return {
                success: false,
                code: errorCode,
                message: errorMessage,
                shouldRetry: isRetryable,
                data: error.response?.data
            };
        }
    }

    async verifyCredentials(): Promise<boolean> {
        try {
            console.log('Verifying PhonePe credentials:', {
                merchantId: this.config.merchantId,
                saltKeyLength: this.config.saltKey.length,
                saltIndex: this.config.saltIndex,
                isDev: this.config.isDev,
                baseUrl: this.baseUrl
            });

            // Create a minimal test payload
            const testPayload = {
                merchantId: this.config.merchantId,
                merchantTransactionId: `TEST-${Date.now()}`,
                merchantUserId: 'TEST-USER',
                amount: 100, // 1 rupee
                redirectUrl: 'http://localhost:3000/test',
                redirectMode: "POST",
                callbackUrl: 'http://localhost:3000/test',
                paymentInstrument: {
                    type: "PAY_PAGE"
                }
            };

            const base64Payload = Buffer.from(JSON.stringify(testPayload)).toString('base64');
            const checksum = this.generateChecksum(base64Payload);
            const url = `${this.baseUrl}/pg/v1/pay`;

            const headers = {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum,
                'X-MERCHANT-ID': this.config.merchantId
            };

            const requestBody = {
                request: base64Payload
            };

            const response = await this.makeRequest(url, requestBody, headers);
            return response.data.success === true;
        } catch (error) {
            console.error('Credential verification failed:', error);
            return false;
        }
    }
}

export default PhonepeGateway; 