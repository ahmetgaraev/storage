let aggregationTypes = ['sum', 'min', 'max', 'avg']
let socket = io()

socket.on('data', (data) => {
    updateTable(data)
})

function setColorCell(cell, value) {
    if (!cell || isNaN(value)) {
        return console.error('setColor not found cell', cell , 'or value', value)
    }

    let backColor = 'rgb(255, 255, 255)'
    let textColor = '#000000'
    if (value >= -1 && value < 0) {
        backColor = 'rgba(255, 140, 0, ' + Math.abs(value) + ')'
    }
    if (value > 0 && value < 1 ) {
        backColor = 'rgba(0, 0, 0, ' + Math.abs(value) + ')'
        textColor = '#ffffff'
    }
    cell.style['background-color'] = backColor
    cell.style['color'] = textColor
}
function updateTable(data) {
    let tbl = document.getElementById('table')
    for (let i = 0; i < data.length; i++) {
        let id = document.getElementById(data[i].id)

        if (id) {
            function changeLineValue() {
                for (let key in data[i]) {
                    let tr = document.getElementById(id)
                    let entity = ''
                    if (key == 'id') {
                        entity = 'Entity'
                    }

                    let td = document.getElementById(data[i].id + '_' + key)
                    td.innerHTML = entity + data[i][key]
                    setColorCell(td, data[i][key])
                    if (!isNaN(key.slice(1))) {
                        updateTotal(document.getElementById('totalType'  + key.slice(1)).value, key.slice(1))
                    }
                }
            }
            changeLineValue()
        } else {
            function createLine() {
                let tr = document.createElement('tr')
                tbl.insertRow(-1)
                tr.id = data[i].id

                for (let key in data[i]) {
                    let td = document.createElement('td')
                    td.id = data[i].id + '_' + key
                    let entity = ''
                    if (key == 'id') {
                        entity = 'Entity'
                    }
                    td.appendChild(document.createTextNode(entity + data[i][key]))
                    setColorCell(td, data[i][key])
                    tr.appendChild(td)
                    if (!isNaN(key.slice(1))) {
                        updateTotal(document.getElementById('totalType'  + key.slice(1)).value, key.slice(1))
                    }
                }
                tbl.prepend(tr)
            }
            createLine()
        }
    }
}

function updateTotal(type, property) {
    // console.log('updateTotal', type, property)
    type = type || 'sum';
    let totalResult = 0;
    let array = [];

    for (let i = 0; i < 20; i++) {
        let element = document.getElementById(i + '_p' + property)
        if (element) {
            let value = Number(element.innerHTML)
            array.push(value)
        }
    }

    if (type == 'sum') {
        array.forEach(element => totalResult += element)
    }
    if (type == 'min') {
        totalResult = Math.min.apply(null, array)
    }
    if (type == 'max') {
        totalResult = Math.max.apply(null, array)
    }
    if (type == 'avg') {
        array.forEach(element => totalResult += element)
        totalResult = totalResult/array.length
    }

    document.getElementById('totalValue' + property).innerHTML = totalResult;
}

function tableCreate() {
    let body = document.getElementsByTagName('body')[0]
    let tbl = document.createElement('table')
    tbl.id = 'table'
    tbl.style['border-collapse'] = 'collapse'
    tbl.setAttribute('border', '1')
    let tbdy = document.createElement('tbody')
    tbl.appendChild(tbdy)
    body.appendChild(tbl)
    
    function addTotalLine() {
        let tr = document.createElement('tr')
        tr.id = 'total'
        let td = document.createElement('td')
        td.appendChild(document.createTextNode('ИТОГО:'))
        tr.appendChild(td)

        for (let i = 0; i < 20; i++) {
            let td = document.createElement('td')

            let totalValue = document.createElement('div')
            totalValue.id = 'totalValue' + (i + 1)
            td.appendChild(totalValue)

            let array = ["sum", "min","max","avg"];

            let selectList = document.createElement("select")
            selectList.onchange = function(data) {
                updateTotal(aggregationTypes[data.target.selectedIndex], (i + 1))
            }
            selectList.id = 'totalType' + (i + 1)
            td.appendChild(selectList)

            for (let j = 0; j < array.length; j++) {
                let option = document.createElement("option")
                option.value = array[j];
                option.text = array[j];
                selectList.appendChild(option)
            }
            tr.appendChild(td)
        }
        tbl.appendChild(tr)
    }
    addTotalLine()
}
tableCreate()
