"use strict";


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


