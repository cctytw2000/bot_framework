const Alexa = require("alexa-sdk");
const request = require("request")
const APP_ID = "amzn1.ask.skill.e8539093-6638-43be-8f4d-ff2c18c37d5e";

exports.handler = function(event,context,callback){
    var alexa = Alexa.handler(event,context,callback);
    alexa.appid = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var jokeDB = [
    "Two aerials meet on a roof - fall in love - get married.The ceremony was rubbish - but the reception was brilliant.",
    "I went to the zoo the other day, there was only one dog in it, it was ashitzu.",
    "Dyslexic man walks into a bra",
    "Police arrested two kids yesterday, one was drinking battery acid, theother was eating fireworks. They charged one - and let the other one off."
]
var handlers = {
    "GetNewJoke":function(){
        // var randomIndex = Math.floor(Math.random()*jokeDB.length);
        // this.emit(":tellWithCard",jokeDB[randomIndex],"Random joke",jokeDB[randomIndex]);
        var requestUri = {url:"http://api.icndb.com/jokes/random"};
        request(requestUri,(err,httpResponse,body)=>{
            var result = JSON.parse(body);
            var thisjoke = result.value.joke;
            this.emit(":tellWithCard",thisjoke,"Random joke",thisjoke);
        })

    },
    "LaunchRequest":function(){
        this.emit(":tell","Welcome To My joke.")
    }
};