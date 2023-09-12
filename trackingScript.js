(function() {
    // Function to generate a unique ID for the visitor (fallback if FingerprintJS fails)
    const generateUUID = () => {
        let d = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    // Function to get UTM parameters from the URL
    const getUTMParameters = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const utms = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
        const utmData = {};
        utms.forEach(utm => {
            if (urlParams.has(utm)) {
                utmData[utm] = urlParams.get(utm);
            }
        });
        return utmData;
    };

    // Function to push data to the server (which in turn pushes to Google Sheets)
    const pushDataToServer = (data) => {
        const serverEndpoint = 'https://trackingscriptserver-6cdf3586c9f4.herokuapp.com/postToSheet';
        fetch(serverEndpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).catch(error => console.error("Error sending data to server:", error));
    };

    // Main function
    const main = async () => {
        let visitorID = localStorage.getItem('visitorID');

        if (!visitorID) {
            try {
                const fp = await import('https://fpjscdn.net/v3/your-public-api-key').then(FingerprintJS => FingerprintJS.load());
                const result = await fp.get();
                visitorID = result.visitorId;
                localStorage.setItem('visitorID', visitorID);
            } catch (error) {
                console.error("Error with FingerprintJS:", error);
                visitorID = generateUUID();
                localStorage.setItem('visitorID', visitorID);
            }
        }

        const utmParameters = getUTMParameters();
        const pageVisit = {
            type: 'page_visit',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            visitorID,
            ...utmParameters
        };
        pushDataToServer(pageVisit);

        // Event Listener for form submissions
        document.body.addEventListener('submit', (e) => {
            if (e.target && e.target.tagName === 'FORM') {
                const formData = new FormData(e.target);
                const formSubmission = {
                    type: 'form_submission',
                    data: {},
                    timestamp: new Date().toISOString(),
                    visitorID,
                    ...utmParameters
                };
                formData.forEach((value, key) => {
                    formSubmission.data[key] = value;
                });
                pushDataToServer(formSubmission);
            }
        });
    };

    // Initialize
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        main();
    } else {
        window.addEventListener('DOMContentLoaded', main);
    }
})();

