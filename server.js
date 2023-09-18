const { google } = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Set up CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Load service account credentials
const keys = require('./googlesheetstest.json');

// Set up JWT (JSON Web Token) for authentication
const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

// Connect to Google Sheets API
const sheets = google.sheets({ version: 'v4', auth: client });

app.use(bodyParser.json());

app.post('/postToSheet', (req, res) => {
    const incomingData = req.body;

    // Reformat the data
    const formattedData = [
        incomingData.type || "",
        incomingData.url || "",
        incomingData.timestamp || "",
        incomingData.visitorID || "",
        incomingData.utm_source || "",
        incomingData.utm_medium || "",
        incomingData.utm_campaign || "",
        incomingData.utm_term || "",
        incomingData.utm_content || "",
        incomingData.name || "",
        incomingData.email || ""
      
    ];

    // Append data to the sheet
    sheets.spreadsheets.values.append({
        spreadsheetId: '1SOKgncyW8J32k72PUNbh3m0k4FQnWE-UP_rO7nnYjH8',
        range: 'Sheet1', // or your sheet name
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        resource: {
            values: [formattedData]
        }
    }, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send('Error writing to Google Sheets');
        } else {
            res.status(200).send('Successfully wrote to Google Sheets!');
        }
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
