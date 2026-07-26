const axios = require('axios');

// Paste the key you just grabbed here to test it
const TEST_KEY = '6c890e308e404b9289ad9f9f459d6896';

async function verifyConnection() {
    try {
        const res = await axios.get('https://spoonacular.com', {
            params: { query: 'brinjal', apiKey: TEST_KEY, number: 1 }
        });
        console.log("✅ Success! API connected. Found dishes:", res.data.totalResults);
    } catch (err) {
        console.error("❌ Connection failed. Check your key status:", err.message);
    }
}
verifyConnection();
