// Backend code to server for Alexa skill
// Skill name: Read_DHT
// By- Vishal C. Poddar

const express = require('express'),
    https = require('https'),
    fs = require('fs');
var bodyParser = require('body-parser')

const mqtt = require('mqtt');
var client  = mqtt.connect('mqtt://13.233.94.202:1883');
client.on('connect',()=>{
    console.log('MQTT connected');
});
var topic = 'for_nodeMCU';

var PORT = process.env.PORT || 8443;
var HOST = process.env.HOST || '';

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


    var options = {
        key: fs.readFileSync('ssl/privkey.pem'),
        ca: fs.readFileSync('ssl/fullchain.pem'),
        cert: fs.readFileSync('ssl/cert.pem')
    }

https.createServer(options, app).listen(PORT, HOST, null, function () {
    console.log('Server listening on port %d in %s mode', this.address().port, app.settings.env);
});

app.get('/', function (req, res) {
    res.send('Welcome on the secure server !');
});

app.post('/', (req, res) => {
    console.log(req.body.request.intent.slots.field);
    if (req.body.request.intent.slots.field.value == 'temperature') {
        var temp = fs.readFileSync("tempFile.txt");
        var tosend = "the temperature is " + temp
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": tosend,
                    "ssml": "<speak>"+tosend+"</speak>"
                }
            }
        });
    }
    else if (req.body.request.intent.slots.field.value == 'humidity') {
        var humi = fs.readFileSync("humiFile.txt");
        var tosend = "the humidity is " + humi
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": tosend,
                    "ssml": "<speak>"+tosend+"</speak>"
                }
            }
        });
    }
    else if(req.body.request.intent.slots.status.value=='on'&& req.body.request.intent.slots.device.value=='light'){
        client.publish(topic,'16,1');
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "your Light is getting on",
                    "ssml": "<speak>your Light is getting on</speak>"
                }
            }
        });
    }
    else if(req.body.request.intent.slots.status.value=='off'&& req.body.request.intent.slots.device.value=='light'){
        client.publish(topic,'16,0');
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "your Light is getting off",
                    "ssml": "<speak>your Light is getting off</speak>"
                }
            }
        });
    }
    else if(req.body.request.intent.slots.status.value=='on'&& req.body.request.intent.slots.device.value=='fan'){
        client.publish(topic,'15,1');
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "your fan is getting on",
                    "ssml": "<speak>your fan is getting on</speak>"
                }
            }
        });
    }
    else if(req.body.request.intent.slots.status.value=='off'&& req.body.request.intent.slots.device.value=='fan'){
        client.publish(topic,'15,0');
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "your fan is getting off",
                    "ssml": "<speak>your fan is getting off</speak>"
                }
            }
        });
    }
    else if(req.body.request.intent.slots.person.value=='coordinator'){
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "its Namrata Madam",
                    "ssml": "<speak>its namrata madam</speak>"
                }
            }
        });   
    }
    else if(req.body.request.intent.slots.person.value=='teacher'){
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "its tarun sir",
                    "ssml": "<speak>its tarun sir</speak>"
                }
            }
        });   
    }
    else if(req.body.request.intent.slots.person.value=='cr'){
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "its Pallav",
                    "ssml": "<speak>its Pallav</speak>"
                }
            }
        });   
    }
    else if(req.body.request.intent.slots.quality.value=='best'||req.body.request.intent.slots.quality.value=='coolest'||req.body.request.intent.slots.quality.value=='awesome'){
        res.json({
            "response": {
                "outputSpeech": {
                    "type": "PlainText",
                    "text": "its Internet of things",
                    "ssml": "<speak>its internet of things<amazon:effect name='whispered'>can you believe it</amazon:effect></speak>"
                }
            }
        });   
    }
});
