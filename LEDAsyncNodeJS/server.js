// server
var http = require('http');
var fs = require('fs');

// RPi management
var uwp = require('uwp');
uwp.projectNamespace("Windows");
var gpioController = Windows.Devices.Gpio.GpioController.getDefault();
var GPIO4 = gpioController.openPin(4);
GPIO4.setDriveMode(Windows.Devices.Gpio.GpioPinDriveMode.output)
var currentValue = Windows.Devices.Gpio.GpioPinValue.low;
GPIO4.write(currentValue);

// Load index.html
var server = http.createServer(function (req, res) {
    fs.readFile('./index.html', 'utf-8', function (error, content) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(content);
    });
});

// socket.io
var io = require('socket.io')(server);
io.on('connection', function (socket) {
    socket.on('changeState', function () {
        var state = changeState();
        socket.emit('stateChanged', state);
    });
});

function changeState() {
    if (currentValue == Windows.Devices.Gpio.GpioPinValue.high)
        currentValue = Windows.Devices.Gpio.GpioPinValue.low;
    else
        currentValue = Windows.Devices.Gpio.GpioPinValue.high;

    GPIO4.write(currentValue);
    return currentValue;
}

server.listen(1337);