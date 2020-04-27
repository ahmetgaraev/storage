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

setInterval( () => {
    http.get('http://localhost:3000/update?' + getNewData());
}, 100)