var express = require('express');
var app = express();
var spawn = require('child_process').spawn;

var net = spawn('../net/NetApp/bin/Debug/NetApp.exe');

net.stdout.on('data', function(data){
    console.log('Recibi de .NET este mensaje: ' + data.toString());

});

app.get('/', function(req, res){
    console.log("recibi una solicitud" + req.query.movimiento + "," + req.query.saltar);
    net.stdin.write(req.query.movimiento + "," + req.query.saltar + "," + req.query.acelerar + "\r\n");
    res.send("HI")

});

app.use(express.static('public'));

app.listen(3000, function(){
    console.log("se levanto el servidor")
});