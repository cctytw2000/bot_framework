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

var bot = new builder.UniversalBot(connector,function(session){
    var msg = session.message.text
    session.send("寶寶%s，只是寶寶不說",msg);
});