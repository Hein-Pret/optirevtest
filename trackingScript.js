(function() {
    // Generate a unique ID for the visitor
    const generateUUID = () => {
        let d = new Date().getTime();
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    // Get UTM parameters from the URL
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

    // Push data to the Google Sheets via Google App Script
    const pushDataToEndpoint = (data) => {
        const googleAppScriptURL = "https://script.google.com/macros/s/AKfycbznYENcV0cOHkzlgos5Sw5JYM34agJywswT3-eK1-RPnQzaDBSuSsG8MPI8qf8Qh-HI/exec";
        fetch(googleAppScriptURL, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    };

    // Main Function
    const main = () => {
        const visitorID = generateUUID();
        const utmParameters = getUTMParameters();

        const pageVisit = {
            type: 'page_visit',
            url: window.location.href,
            timestamp: new Date().toISOString(),
            visitorID,
            ...utmParameters
        };

        pushDataToEndpoint(pageVisit);

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
                pushDataToEndpoint(formSubmission);
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
