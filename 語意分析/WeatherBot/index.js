'use strict';

const
    bodyParser = require('body-parser'),
    config = require('config'),
    express = require('express'),
    https = require('https'),
    request = require('request');

var app = express();
app.set('port', 5000);
//use body parsing middleware
app.use(bodyParser.json());
// serve images, css files, and JavaScript files in a directory named public
app.use(express.static('public'));

const WEATHER_APP_ID = config.get('weather_app_id');

//主程式運作邏輯
app.post('/webhook', function (req, res) {
    let data = req.body;
    let queryDate = data.queryResult.parameters.date;
    let queryCity = data.queryResult.parameters["geo-city"];
    // Go to OpenWeatherMap to get weather data
    let propertiesObject = {
        q: queryCity,
        APPID: WEATHER_APP_ID,
        units: 'metric'
    }


    request({
        uri: "http://api.openweathermap.org/data/2.5/weather?",
        json: true,
        qs: propertiesObject
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            res.json({
                fulfillmentText: "The weather in " + queryCity +
                    " is " + body.weather[0].description +
                    ". And the temperature is around " + body.main.temp
            });
        }
        else {
            console.log("[OpenWeatherMap] failed");
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('[app.listen] Node app is running on port', app.get('port'));
})