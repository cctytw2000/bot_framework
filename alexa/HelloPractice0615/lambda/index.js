const Alexa = require("alexa-sdk");
const APP_ID = "amzn1.ask.skill.ddc4aee5-408d-4c73-a1e3-e665a05ab8d0";

exports.handler = function(event,context,callback){
    var alexa = Alexa.handler(event,context,callback);
    alexa.appid = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    "HelloIntent":function(){
        this.emit(":tell","Hello,Master can i help you?");
    },
    "LaunchRequest":function(){
        this.emit(":tell","Welcome To My country .hello,master can i help you?")
    }
};