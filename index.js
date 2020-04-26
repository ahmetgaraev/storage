'use strict'
let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);

let storage = [
    {
        id: '1',
        p1: 0,
        p2: 1,
        p3: 0,
        p4: 1,
        p5: 0,
        p6: 1,
        p7: 0,
        p8: 1,
        p9: 0,
        p10: 1,
        p11: 0,
        p12: 1,
        p13: 0,
        p14: 1,
        p15: 0,
        p16: 1,
        p17: 0,
        p18: 1,
        p19: 0,
        p20: 1
    },
    {
        id: '2',
        p1: 1,
        p2: 0,
        p3: 1,
        p4: 0,
        p5: 1,
        p6: 0,
        p7: 1,
        p8: 0,
        p9: 1,
        p10: 0,
        p11: 1,
        p12: 0,
        p13: 1,
        p14: 0,
        p15: 1,
        p16: 0,
        p17: 1,
        p18: 0,
        p19: 1,
        p20: 0
    },
]
let model = {
    'id': { type: 'String' },
    'p1': { type: 'Double', range: [-1, 1] },
    'p2': { type: 'Double', range: [-1, 1] },
    'p3': { type: 'Double', range: [-1, 1] },
    'p4': { type: 'Double', range: [-1, 1] },
    'p5': { type: 'Double', range: [-1, 1] },
    'p6': { type: 'Double', range: [-1, 1] },
    'p7': { type: 'Double', range: [-1, 1] },
    'p8': { type: 'Double', range: [-1, 1] },
    'p9': { type: 'Double', range: [-1, 1] },
    'p10': { type: 'Double', range: [-1, 1] },
    'p11': { type: 'Double', range: [-1, 1] },
    'p12': { type: 'Double', range: [-1, 1] },
    'p13': { type: 'Double', range: [-1, 1] },
    'p14': { type: 'Double', range: [-1, 1] },
    'p15': { type: 'Double', range: [-1, 1] },
    'p16': { type: 'Double', range: [-1, 1] },
    'p17': { type: 'Double', range: [-1, 1] },
    'p18': { type: 'Double', range: [-1, 1] },
    'p19': { type: 'Double', range: [-1, 1] },
    'p20': { type: 'Double', range: [-1, 1] }
}

app.get('/update', async (req, res) => {
    if (!req || !req.query || !req.query.id) {
        return res.status(400).send('Fill in the parameters');
    }
    saveData(req.query)
    io.sockets.emit('data', storage);
    res.send();
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});

io.on('connection', function(socket) {
    socket.emit('data', storage);
})

setInterval( () => {
    io.sockets.emit('data', storage);
}, 1000)

http.listen(3000, function(){
    console.log('listening on *:3000');
});

function getValidData(data) {
    let item = {}
    for (let key in data) {
        if (model[key] && model[key].type) {
            if (model[key].type == 'String') {
                item[ key ] = data[key]
            }
            if (model[key].type == 'Double' && !isNaN(data[key])) {
                if (data[key] >= model[key].range[0] && data[key] <= model[key].range[1]) {
                    item[ key ] = data[key]
                }
            }
        }
    }
    return item
}

function saveData(data) {
    let item = getValidData(data)
    
    for (let i = 0; i < storage.length; i++) { 
        if (storage[i]['id'] == item.id) {
            for (let key in item) {
                storage[i][key] = item[key]
            }
            return
        }
    }
    if (storage.length < 20 && Object.keys(item).length == 21)  {
        storage.push(item)
    }
}