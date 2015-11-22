function sleepFor( sleepDuration ){
    var now = new Date().getTime();
    while(new Date().getTime() < now + sleepDuration){ /* do nothing */ }
}

function pushToArray(arr, data, callback) {
    arr.push(data);
    callback()
}

function add() {
    pushToArray(arr, Math.floor(Math.random() * 10), function() {
        console.log(arr);
        console.log('current item:  ' + gen.next().value);
    })
}

function* spitter(arr){
    while(true) {
        var x = arr.shift()
        yield x;
    }
}

var arr = [];
var gen = spitter();
while (true) {
    add();
    sleepFor(300);
}
