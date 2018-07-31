const Alexa = require("alexa-sdk");
const APP_ID = "amzn1.ask.skill.b89a6340-09e4-4e36-9681-71603f7492d0";

exports.handler = function(event,context,callback){
    var alexa = Alexa.handler(event,context,callback);
    alexa.appid = APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
var handlers = {
    "AnswerIntent":function(){
        var course = this.event.request.intent.slots.Course.value;
        if(course == "artificial intelligence engineer")
        {
            console.log("Course Matched!");
            this.emit(":tell","<say-as interpret-as='interjection'>bingo</say-as>")
        }else
        {
            console.log("Course not Matched!");
            this.emit(":tell","<say-as interpret-as='interjection'>oh boy , you guess that  "+course+" . but in fact is artificial intelligence engineer!</say-as>");
        }
    },
    "LaunchRequest":function(){
        this.emit(":ask","Welcome To My quiz .Do you know which program is most popular?Java developer,App developer,or artificial intelligence engineer?");
    }
};