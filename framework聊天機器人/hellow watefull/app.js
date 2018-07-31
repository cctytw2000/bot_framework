var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();

server.listen(process.env.port || process.env.port || "3978",function(){
    console.log('%s listening to %s',server.name,server.url);
});

var connector = new builder.ChatConnector({
    appid:process.env.MicrosoftAppid,
    appPassword:process.env.MicrosoftAppPassword,
});
server.post('/api/messages',connector.listen());

var bot = new builder.UniversalBot(connector,[
    function(session){
    builder.Prompts.text(session,"what is your last name?")
},
    function(session,results){
    session.dialogData.lastName = results.response;
    builder.Prompts.text(session,"what is your first name?")
},
    function(session,results){
    session.dialogData.firstName = results.response;
    session.endDialog(`hi ${session.dialogData.lastName}${session.dialogData.firstName}
    What can I do for you?`)
    }]
);