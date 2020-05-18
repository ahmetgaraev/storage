'use strict'
let express = require('express')
let app = express()
let http = require('http').Server(app)
let io = require('socket.io')(http)

let storage = []
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

app.use(express.json())
app.use(express.urlencoded())

app.post('/update', async (req, res) => {
    if (!req || !req.body || !req.body.id) {
        return res.status(400).send('Fill in the parameters');
    }
    saveData(req.body)
    io.sockets.emit('data', storage);
    res.send();
})

app.get('/', function(req, res){
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/js/index.js', function(req, res){
    res.sendFile(__dirname + '/public/js/index.js');
});

io.on('connection', function(socket) {
    socket.emit('data', storage);
})

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
