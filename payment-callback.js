exports.handler = async function(event, context) {
    // This function handles PhonePe's callback
    const data = JSON.parse(event.body || '{}');
    
    console.log('Payment callback received:', data);
    
    // Here you can:
    // 1. Update your database
    // 2. Send confirmation emails
    // 3. Send WhatsApp notifications
    
    return {
        statusCode: 200,
        body: JSON.stringify({ 
            success: true,
            message: 'Callback received'
        })
    };
};