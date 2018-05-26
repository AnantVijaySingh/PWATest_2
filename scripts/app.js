if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('./service-worker.js').then(function(registration) {
            // Registration was successful
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // registration failed :(
            console.log('ServiceWorker registration failed: ', err);
        });
    });
}


var app = {
    data: []
};

// Counters

function counters() {
    if (!!localStorage.getItem('visits')) {
        localStorage.setItem('visits', JSON.parse(localStorage.getItem('visits')) + 1);
        const date = new Date(Date.now());
        const obj = {
            time: date.toUTCString(),
            visits: localStorage.getItem('visits'),
            addToHomePrompt: false
        };
        var array = JSON.parse(localStorage.getItem('myData'));
        array.push(obj);
        localStorage.setItem('myData', JSON.stringify(array));

    } else {
        localStorage.setItem('visits', JSON.stringify(1));
        const date = new Date(Date.now());
        const obj = {
            time: date.toUTCString(),
            visits: localStorage.getItem('visits'),
            addToHomePrompt: false
        };
        const array = [obj];
        localStorage.setItem('myData',JSON.stringify(array));
    }

    addUI();
};


counters();

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
});


window.addEventListener('appinstalled', (evt) => {
    alert('Custom alert: app intstalled');
});

var intervalID = window.setInterval(()=> {
    if (!!deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        deferredPrompt.userChoice
            .then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        clearInterval(intervalID);
        logAddToHomescreenEvent();
    }
},3000);

function logAddToHomescreenEvent() {
    console.log('function triggering correctly');
    var array = JSON.parse(localStorage.getItem('myData'));
    array[array.length - 1].addToHomePrompt = true;
    localStorage.setItem('myData', JSON.stringify(array));
    console.log('logged add to home screen prompt');
    console.log(array);
    const list = document.getElementById('list');
    list.innerHTML = '';
    addUI();
}

function addUI() {
    const list = document.getElementById('list');
    JSON.parse(localStorage.getItem('myData')).map((data) => {
        var itemData = JSON.stringify(data);
        var text = document.createTextNode(itemData);
        var item = document.createElement('li');
        item.appendChild(text);
        list.appendChild(item);
    });
}



