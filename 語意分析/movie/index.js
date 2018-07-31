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
    let queryMovie = data.queryResult.parameters["MovieName"];
    // Go to OpenWeatherMap to get weather data
    let propertiesObject = {
        api_key: WEATHER_APP_ID,
        language: "zh-TW",
        query: queryMovie
    }


    request({
        uri: "http://api.themoviedb.org/3/search/movie?",
        json: true,
        qs: propertiesObject
    }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if(body.results.length == undefined ){
                res.json({fulfillmentText:"查不到此電影:"+queryMovie});
                }
            else if(body.results.length > 1){
                   for (var i = 0;i <= body.results.length;i++){
                      res.json({fulfillmentText:queryMovie + body.results[0]['title']});
                    }
            }
            else{
                res.json({fulfillmentText:queryMovie + body.results[0]['overview']});
            }
        }
        else {
            console.log("[themoviedb] failed");
        }
    });
});

app.listen(app.get('port'), function () {
    console.log('[app.listen] Node app is running on port', app.get('port'));
})
