const crypto = require('crypto');

exports.handler = async function(event, context) {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        const data = JSON.parse(event.body);
        const { amount, transactionId, phone } = data;
        
        // Your PhonePe credentials
        const CLIENT_ID = "SU2512291620289336999793";
        const CLIENT_SECRET = "ecd7d67e-03e0-4333-9ca1-9bfe0e105215";
        const MERCHANT_ID = "SU2512291620289336999793";
        
        // Create payload
        const payload = {
            merchantId: MERCHANT_ID,
            merchantTransactionId: transactionId,
            merchantUserId: `CUST_${phone.replace(/\D/g, '').slice(-10)}`,
            amount: amount * 100, // Convert to paise
            redirectUrl: `${process.env.URL}/payment-success.html?transactionId=${transactionId}&status=SUCCESS`,
            redirectMode: "REDIRECT",
            callbackUrl: `${process.env.URL}/.netlify/functions/payment-callback`,
            mobileNumber: phone.replace(/\D/g, ''),
            paymentInstrument: {
                type: "PAY_PAGE"
            }
        };

        // Encode payload to base64
        const base64Payload = Buffer.from(JSON.stringify(payload)).toString('base64');
        
        // Generate X-VERIFY header
        const stringToHash = base64Payload + '/pg/v1/pay' + CLIENT_SECRET;
        const xVerify = crypto.createHash('sha256').update(stringToHash).digest('hex') + '###1';
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                success: true,
                payload: base64Payload,
                xVerify: xVerify,
                merchantId: MERCHANT_ID
            })
        };
        
    } catch (error) {
        console.error('Payment initiation error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};