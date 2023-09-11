# optirevtest

Two branches 
Main: Holds the tracking script 
Server: Holds all the server related items, API keys etc 

**Important**
Need to delete all the API keys for Google etc as they are currently publicly visible for testing as much simpler 

Simplistic flow: 
  One-line script embedded in Webflow
  Triggers the CDN(Delivr) hosted trackingscript.js on main branch
  Trackingsript.js runs and send the payload to the server
  Server receives the payload and formats the data in to the expected format that the Google API is expecting it 
  Server and GoogleAPI interact and push it to the Google sheet https://docs.google.com/spreadsheets/d/1SOKgncyW8J32k72PUNbh3m0k4FQnWE-UP_rO7nnYjH8/edit#gid=0 
  
