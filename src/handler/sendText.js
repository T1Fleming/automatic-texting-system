async function getQuote() {
    console.log('defining axios...')
    const axios = require('axios');
    try {
        console.log('retrieving quote...')
        let res = await axios.get('https://quotes.rest/qod');
        console.log('Retrieved quote!')
        let data = res.data;
        const quote = data.contents.quotes[0].quote
        console.log(quote);

        return quote
    } catch (e) {
        console.log('error retrieving quote')
        console.log(e)
        return "Can't retrieve quote :("
    }
}

exports.handler = async (event) => {

    try {
        console.log('Loading variables...')
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const client = require('twilio')(accountSid, authToken);
        const patrick = process.env.KRUSTY_KRAB_NUMBER;
        const primarySenderNumber = process.env.PRRIMARY_SENDER_NUMBER;
        const chumBucketNumber = process.env.CHUM_BUCKET_NUMBER;
        const textMsgToSend = process.env.SMS_MSG;


        console.log('done')

        let resp;
        let myResp
        console.log('forming message...')
        // Form Message
        const finalMsg = `${textMsgToSend}\n\nHawn Bawn's Quote Of The Day:\n"${await getQuote()}"`
        console.log('Msg to send:', finalMsg)

        // Send Message
        resp = await client.messages
            .create({
                body: finalMsg,
                from: primarySenderNumber,
                to: patrick
            })
            .then(message => {
                console.log(message.sid)
            })

        myResp = await client.messages.create({
            body: finalMsg,
            from: primarySenderNumber,
            to: chumBucketNumber
        }).then(message => {
            console.log(message.sid)
            return "SUCCESS"
        });



        // const response = {
        //     statusCode: 200,
        //     body: JSON.stringify('Hello from Lambda!'),
        // };

        return myResp
    } catch (e) {
        console.log('Error:', e)
        return 'true'
    }
};
