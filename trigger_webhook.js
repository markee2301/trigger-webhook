const https = require('https');

exports.handler = async function (context, event, callback) {
  // Make.com webhook URL
  const makeWebhookUrl = 'https://hook.us1.make.com/fqmne49856xl6q0eau8f2w2mwoswd8xx';

  try {
    // Helper function to send data to the Make.com webhook
    const triggerMakeWebhook = () => 
      new Promise((resolve, reject) => {
        const postData = JSON.stringify(event);

        const url = new URL(makeWebhookUrl);

        const options = {
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
          },
        };

        const req = https.request(options, (res) => {
          let responseData = '';
          res.on('data', (chunk) => (responseData += chunk));
          res.on('end', () => resolve(responseData));
        });

        req.on('error', (error) => reject(error));

        req.write(postData);
        req.end();
      });

    // Send the incoming data to the webhook
    console.log('Triggering Make.com webhook...');
    const response = await triggerMakeWebhook();
    console.log('Webhook response received:', response);

    // Return success response
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ message: 'Webhook triggered successfully', response }),
    });
  } catch (error) {
    console.error('Error triggering Make.com webhook:', error);

    // Return error response
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error triggering webhook', error: error.message }),
    });
  }
};
