// const Client = require("@veryfi/veryfi-sdk");
// require("dotenv").config();
// // Setting up my Veryfi API credentials
// const clientId = process.env.CLIENT_ID;
// const clientSecret = process.env.CLIENT_SECRET;
// const username = process.env.USERNAME;
// const apiKey = process.env.API_KEY;
// let client = new Client(clientId, clientSecret, username, apiKey);
// // process_document() is a method that takes in a file path and returns a promise with the response data extracted from the document
// const processDocument = async (imgUrl: string) => {
//   const response = await client.process_document_url(imgUrl);
//   return response;
// };
// // get_documents() is a method that returns a promise with the response data of all the documents that have been processed
// // const response = async () =>
// //     await client.get_documents();
// // response().then((data) => console.log(data));
// module.exports = { processDocument };
// INPUT Data
var ocrText =
    "হাই-কেয়ার জেনারেল হসপিটাল লিঃ\nH Hi-CARE GENERAL HOSPITAL LTD.\nda\tHI-CARE\t\t\t\taddress of your health\n\nInv No\t: 135894\tHN No\t: 1808250009\tPID\t: 1808001013 Bed No\t: 407 (B)(MW)\nP Name\t: Mr. Riad\t\tGender\t: Male\tAge: 17Y\nD Date\t: 26/08/2018\tFloor\t:\t3rd\tUnder Dr.\t: Dr. Mahmud Khan\n\nHematology Report\nEstimations are carried out by SYSMEX 5--Part Diff. Automated Hematology Analyzer (Model: XS 800i)\n\nTest Name\t\t\tResult\t\tNormal Range\nHemoglobin\t\t15.3 g/dL\tAdult (Male: 13-18 g/dL Female: 11-16 g/dL\nESR: Westergreen Method\t06 mm/1st hour\tMale: 0-10, Female: 0-20 mm/1st hour\nTotal Count\nTotal Count (TC) of WBC\t14.8 10^3/uL\tOM-1Y: 10-26 10^3/uL, >1Y: 5-15 10^3/uL\nDifferential Count\nNeutrophils\t\t\t84%\tChild: 25-66%, Adult: 40 - 75%\nLymphocytes\t\t\t10%\tChild: 25-62%, Adult: 20-50%\nMonocytes\t\t\t03 %\tChild: 03-07%, Adult: 4.0 -7.5%\nEosinophils\t\t\t03%\tChild: 01-03%, Adult: 01-06%\nBasophils\t\t\t00%\t0-1%\nOthers\nTotal Count (TC) Of RBC\t5.60 10^6/uL\tNew Born: 6-7 10^6/uL, Adult: 3.8-5.3 10^6/uL\nPCV/HCT\t\t\t41.5 %\t38 - 48%\nMCV\t\t\t\t74.1 fL 80-100 fL\nMCH\t\t\t\t27.3 pg 26-31 pg\nMCHC\t\t\t\t36.9 g/dL 31.0-37.0 g/dL\nRDW-SD\t\t\t37.8\tfL\t42.5 3.5 fL\nRDW-CV\t\t\t14.1\t% 12.8 ± 1.2%\nY\nTotal PLT Count\t\t327 10^3/uL 150-400 10^3/uL\n\n\tf\n\tDr. Md. Ali Abdullah Rafique\n\tMBBS,DCP (BSMMU), M Phil (Clinical Pathology)\nTechnologist\t\t\t\t\tSr. Consultant\n\tHi-Care General Hospital Ltd.";
// OUTPUT Data
var data = {
    Hemoglobin: "12.1 g/dL",
    "ESR: Westergreen Method": "04 mm/1st hour",
    "Total Count": "12.9 10^3/uL",
    Neutrophils: "76%",
    Lymphocytes: "14%",
    Monocytes: "05 %",
    Eosinophils: "05%",
    Basophils: "00%",
    "Total Count (TC) Of RBC": "4.34 10^6/uL",
    "PCV/HCT": "32.7%",
    MCV: "75.3 fL",
    MCH: "27.9 pg",
    MCHC: "37.0 g/dL",
    "RDW-SD": "36.5 fL",
    "RDW-CV": "13.6 %",
    "Total PLT Count": "277 10^3/uL",
};
function extractNumber(str) {
    const regex = /[+-]?\d+(\.\d+)?/g;
    const match = str.match(regex);
    return match ? parseFloat(match[0]) : null;
}
function parseHematologyReport(ocrText) {
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
    const data = {};
    for (const [key, pattern] of Object.entries(patterns)) {
        const match = ocrText.match(pattern);
        if (match) {
            data[key] = extractNumber(match[1]);
        }
    }

    return data;
}



var extractedData = parseHematologyReport(ocrText);
console.log(extractedData);
