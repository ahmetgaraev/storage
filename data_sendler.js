'use strict'

const http = require('http');

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function getNewData() {
    let params = 'id=' + getRandomInt(20);
    for (let i = 1; i < 21; i ++) {
        let value = Math.random();
        params += '&p' + i + '=' + (getRandomInt(2) ? '' : '-') + value
    }
    return params
}

function sendData(data) {
    let post_options = {
        host: 'localhost',
        port: '3000',
        path: '/update',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    let post_req = http.request(post_options, function(res) {
        res.setEncoding('utf8');
        res.on('data', function (chunk) {
            console.log('Response: ' + chunk);
        });
    });
    post_req.write(data);
    post_req.end();
}

setInterval( () => {
    sendData(getNewData());
}, 100)
