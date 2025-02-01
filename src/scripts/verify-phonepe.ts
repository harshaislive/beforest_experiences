import * as dotenv from 'dotenv';
import PhonepeGateway from '../lib/payment/phonepepg';

// Load environment variables
dotenv.config();

async function verifyPhonePeCredentials() {
    const merchantId = process.env.PHONEPE_MERCHANT_ID;
    const saltKey = process.env.PHONEPE_SALT_KEY;
    
    if (!merchantId || !saltKey) {
        console.error('Missing required environment variables');
        return;
    }

    const config = {
        merchantId,
        saltKey,
        saltIndex: Number(process.env.PHONEPE_SALT_INDEX || '1'),
        isDev: true
    };

    console.log('Testing PhonePe credentials with config:', {
        merchantId: config.merchantId,
        saltKeyLength: config.saltKey.length,
        saltIndex: config.saltIndex,
        isDev: config.isDev
    });

    const gateway = new PhonepeGateway(config);
    
    try {
        const isValid = await gateway.verifyCredentials();
        if (isValid) {
            console.log('✅ PhonePe credentials verified successfully!');
        } else {
            console.log('❌ PhonePe credentials verification failed');
        }
    } catch (error) {
        console.error('Error verifying credentials:', error);
    }
}

// Run the verification
verifyPhonePeCredentials().catch(console.error); 