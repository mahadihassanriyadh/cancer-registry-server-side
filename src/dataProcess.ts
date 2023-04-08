const Client = require("@veryfi/veryfi-sdk");
require("dotenv").config();

// Setting up my Veryfi API credentials
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const username = process.env.USERNAME;
const apiKey = process.env.API_KEY;

let client = new Client(clientId, clientSecret, username, apiKey);

// process_document() is a method that takes in a file path and returns a promise with the response data extracted from the document
const processDocument = async (imgUrl: string) => {
  const response = await client.process_document_url(imgUrl);
  return response;
};

// get_documents() is a method that returns a promise with the response data of all the documents that have been processed
// const response = async () =>
//     await client.get_documents();
// response().then((data) => console.log(data)); 

function extractNumber(str: string) {
    const regex = /[+-]?\d+(\.\d+)?/g;
    const match = str.match(regex);
    return match ? parseFloat(match[0]) : null;
}
function parseHematologyReport(ocrText: string) {
    // Define regular expression patterns for each type of test result
    const patterns = {
        hemoglobin: /Hemoglobin\s+([\d.]+ \w+).*\n/,
        esr: /ESR: Westergreen Method\s+([\d.]+ \w+).*\n/,
        totalWbc: /Total Count \(TC\) of WBC\s+([\d.]+ [\w/]+).*\n/,
        neutrophils: /Neutrophils\s+([\d.]+%).*\n/,
        lymphocytes: /Lymphocytes\s+([\d.]+%).*\n/,
        monocytes: /Monocytes\s+([\d.]+%).*\n/,
        eosinophils: /Eosinophils\s+([\d.]+%).*\n/,
        basophils: /Basophils\s+([\d.]+%).*\n/,
        totalRbc: /Total Count \(TC\) Of RBC\s+([\d.]+ [\w/]+).*\n/,
        pcv: /PCV\/HCT\s+([\d.]+%).*\n/,
        mcv: /MCV\s+([\d.]+ \w+).*\n/,
        mch: /MCH\s+([\d.]+ \w+).*\n/,
        mchc: /MCHC\s+([\d.]+ \w+).*\n/,
        rdwSd: /RDW-SD\s+([\d.]+ \w+).*\n/,
        rdwCv: /RDW-CV\s+([\d.]+%).*\n/,
        platelet: /Total PLT Count\s+([\d.]+ [\w/]+).*\n/,
    };

    // Match each test result using the regular expression patterns
    const data: any = {};
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = ocrText.match(pattern);
        if (match) {
            data[key] = extractNumber(match[0]);
        }
    }

    return data;
}

module.exports = { processDocument, parseHematologyReport };