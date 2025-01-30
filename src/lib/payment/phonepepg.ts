import axios from 'axios';
import crypto from 'crypto';

interface PhonePeConfig {
    merchantId: string;
    saltKey: string;
    saltIndex: number;
    isDev?: boolean;
}

interface PaymentRequest {
    merchantId: string;
    merchantTransactionId: string;
    merchantUserId: string;
    amount: number;
    redirectUrl: string;
    redirectMode: string;
    callbackUrl: string;
    paymentInstrument: {
        type: string;
    };
    mobileNumber?: string;
    deviceContext: {
        deviceOS: string;
    };
}

interface PaymentResponse {
    success: boolean;
    data?: any;
    error?: string;
    message?: string;
    code?: string;
}

export default class PhonepeGateway {
    private config: PhonePeConfig;
    private baseUrl: string;

    constructor(config: PhonePeConfig) {
        this.config = config;
        this.baseUrl = config.isDev 
            ? 'https://api-preprod.phonepe.com/apis/pg-sandbox'
            : 'https://api.phonepe.com/apis/hermes';
    }

    private generateChecksum(payload: string): string {
        const data = payload + "/pg/v1/pay" + this.config.saltKey;
        const sha256 = crypto.createHash('sha256').update(data).digest('hex');
        return `${sha256}###${this.config.saltIndex}`;
    }

    async initPayment(request: PaymentRequest): Promise<PaymentResponse> {
        try {
            const payload = {
                merchantId: this.config.merchantId,
                merchantTransactionId: request.merchantTransactionId,
                merchantUserId: request.merchantUserId,
                amount: request.amount,
                redirectUrl: request.redirectUrl,
                redirectMode: request.redirectMode,
                callbackUrl: request.callbackUrl,
                paymentInstrument: request.paymentInstrument,
                mobileNumber: request.mobileNumber,
                deviceContext: request.deviceContext
            };

            const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
            const checksum = this.generateChecksum(base64Payload);

            console.log('Debug - Payment Request:', {
                payload,
                base64Payload,
                checksum,
                url: `${this.baseUrl}/pg/v1/pay`
            });

            const response = await axios.post(
                `${this.baseUrl}/pg/v1/pay`,
                {
                    request: base64Payload
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-VERIFY': checksum,
                        'X-MERCHANT-ID': this.config.merchantId
                    }
                }
            );

            if (response.data.success === false) {
                return {
                    success: false,
                    error: response.data.code,
                    message: response.data.message,
                    data: response.data.data
                };
            }

            return {
                success: true,
                data: response.data
            };
        } catch (error: any) {
            console.error('PhonePe payment error:', error.response?.data || error);
            return {
                success: false,
                error: error instanceof Error ? error.toString() : 'Unknown error',
                message: error.response?.data?.message || error.message,
                code: error.response?.data?.code
            };
        }
    }
} 