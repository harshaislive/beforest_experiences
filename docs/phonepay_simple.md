Integrate PhonePe Gateway in Node.js Next.js with 3 Lines of Code
Fathah KA
Fathah KA

·
Follow

2 min read
·
Jul 9, 2024
1





Integrating a payment gateway can be a complex task, but with the new phonepepg npm package, you can integrate the PhonePe Payment Gateway into your server-side application in just three simple lines. Whether you’re using Node.js or frameworks like Next.js, or other SSR supported frameworks this package makes the process incredibly straightforward.

Why PhonePe?
PhonePe is one of India’s leading digital payment platforms, offering a seamless and secure way to handle transactions. By integrating PhonePe into your application, you can provide users with a trusted and familiar payment option, enhancing their experience and potentially increasing conversion rates.

If you don’t have a Phonepe Business account you can onboard yourself within 2 minutes.
CLICK HERE TO SET UP PHONEPE

Getting Started
First, you need to install the phonepepg package. Open your terminal and run:

npm i phonepepg
https://www.npmjs.com/package/phonepepg

Usage
Step 1: Import and Configure the Gateway
Start by importing the PhonepeGateway class and configuring it with your merchant ID and salt key. You can specify whether you're in development or production mode by setting the isDev flag.

import PhonepeGateway from 'phonepepg';

const gateway = new PhonepeGateway({
    merchantId: 'MYMERCHANTID',
    saltKey: 'XXXXXXXXXXXXXXXXXXX',
    isDev: true // Set to false for production
});
Step 2: Initialize the Payment
To initiate a payment, call the initPayment method with the required parameters: amount, transactionId, userId, redirectUrl, and callbackUrl.

const resp = await gateway.initPayment({
    amount: 100,
    transactionId: 'TR12345',
    userId: 'userid',
    redirectUrl: 'https://mysite.com/payredirect',
    callbackUrl: 'https://mysite.com/callback'
});
Step 3: Handle the Response
The initPayment method will return a response that you can use to handle the payment process. Depending on your needs, you might want to redirect the user, log the transaction, or perform other actions based on the response.

Conclusion
Integrating the PhonePe Payment Gateway into your server-side application has never been easier. With the phonepepg package, you can complete the integration in just three lines of code, making the process quick and efficient. Try it out today and provide your users with a seamless payment experience.

By following these simple steps, you’ll be able to integrate the PhonePe Payment Gateway into your application with minimal effort.

Happy coding! ⚡