"use strict";


function getVin() {
    console.log("getVin ...");
    return Promise.reject(new Error("get vin fail"));
}

function retry(fn, times, delay) {
    return new Promise(function(resolve, reject) {
        var error;
        var attempt = function() {

            if (times == 0) {
                reject(error);
            } else {
                fn().then(resolve)
                    .catch(function(e){
                        times--;
                        error = e;
                        setTimeout(function(){attempt()}, delay);
                    });
            }
        };
        attempt();
    });
}


// retry(getVin, -1, 5000);

function delay(time) {
    return new Promise(function(resolve) {
        setTimeout(resolve, time);
    });
}

function timeout(promise, time) {
    return Promise.race([promise, delay(time).then(function() {
        throw new Error("Operation time out");
    })]);
}

function getKey() {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve("success");
        }, 10000);
    })
}

// timeout(getKey(), 5000).then(function(value) {
//     console.log("get key success: " + value);
// }).catch(function(err) {
//     console.log("get key error: " + err);
// });

function getKeyWithTimeout() {
    return timeout(getKey(), 5000);
}

retry(getKeyWithTimeout, 3, 10000).then(function(value) {
    console.log("getKey: " + value);
}).catch(function(err) {
    console.log("getKey error: " + err);
});
