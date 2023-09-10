const {google} = require('googleapis');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Load service account credentials
const keys = require('./path-to-your-service-account-json-file.json');

// Set up JWT (JSON Web Token) for authentication
const client = new google.auth.JWT(
  keys.client_email,
  null,
  keys.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

// Connect to Google Sheets API
const sheets = google.sheets({version: 'v4', auth: client});

app.use(bodyParser.json());

app.post('/postToSheet', (req, res) => {
  const data = req.body;

  // TODO: Process and structure your data here as needed

  // Append data to the sheet
  sheets.spreadsheets.values.append({
    spreadsheetId: 'YOUR_SPREADSHEET_ID',
    range: 'Sheet1', // or your sheet name
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [data]
    }
  }, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send('Error writing to Google Sheets');
    } else {
      res.status(200).send('Successfully wrote to Google Sheets');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
