const Client = require("@veryfi/veryfi-sdk");
require("dotenv").config();

// Setting up my Veryfi API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const username = process.env.USERNAME;
const apiKey = process.env.API_KEY;

let client = new Client(clientId, clientSecret, username, apiKey);

// process_document() is a method that takes in a file path and returns a promise with the response data extracted from the document
/* 
const response = async () =>
    await client.process_document("../assets/reports/hematology-report-1.jpg");
response().then((data) => console.log(data)); 
*/


// get_documents() is a method that returns a promise with the response data of all the documents that have been processed
const response = async () =>
    await client.get_documents();
response().then((data) => console.log(data)); 