const
    restify = require('restify'),
    config = require('config'),
    builder = require('botbuilder'),
    apiAIRecognizer = require('api-ai-recognizer'),
    request = require('request');


const DIALOGFLOW_CLIENT_ACCESS_TOKEN = config.get('dialogFlowClientAccessToken');
const APP_ID = config.get('app_id');
const APP_PASSWORD = config.get('app_password');

var recognizer = new apiAIRecognizer(DIALOGFLOW_CLIENT_ACCESS_TOKEN);

var intents = new builder.IntentDialog({
    recognizers: [recognizer]
});
var server = restify.createServer();

server.listen(process.env.port || process.env.PORT || 3978,
    function () {
        console.log('%s listen to %s', server.name, server.url);
    }
);

var connector = new builder.ChatConnector({
    appId:APP_ID,
    appPassword : APP_PASSWORD
});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

bot.dialog('/', intents);

intents.matches('Summit Final Project', function (session, args) {
    var checkAction = builder.EntityRecognizer.findEntity(args.entities, "actionIncomplete");
    var studentIDobject = {};
    var studentNameobject = {};
    var studentWebSiteobject = {};
    if (checkAction.entity) {
        var myFulfillment = builder.EntityRecognizer.findEntity(args.entities, "fulfillment");
        session.send(myFulfillment.entity);
    } else {
        studentIDobject = builder.EntityRecognizer.findEntity(args.entities, "StudentID");
        studentNameobject = builder.EntityRecognizer.findEntity(args.entities, "StudentName");
        studentWebsiteobject = builder.EntityRecognizer.findEntity(args.entities, "StudentWebsite");
        session.send("好的!%s,你的學號%s,你的期末作業網址是%s.馬上幫你登記", studentNameobject.entity, studentIDobject.entity, session.message.text);
        summitToSheetDB(studentIDobject.entity, studentNameobject.entity, session.message.text, session)
    }
});

intents.matchesAny(['Default Fallback Intent', 'Default Welcome Intent', 'None'], function (session, args) {
    session.send("想交作業嗎?請說「我想要上傳作業」，「我想要交作業」一類的，謝謝您~~");
});

function summitToSheetDB(sID, sName, sUrl, session) {
    console.log(sID, sName, sUrl);
    request({
        uri: 'https://sheetdb.io/api/v1/5b3091731ef90',
        json: true,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: {
            "data": [{
                "Number": sID,
                "Name": sName,
                "Website": sUrl
            }]
        }
    }, function (error, response, body) {
        if (!error && response.statusCode == 201) {
            session.send("作業上傳完成!");
        } else {
            console.log(error);
        }
    });
}