var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();

server.listen(process.env.port || process.env.port || "3978", function () {
    console.log('%s listening to %s', server.name, server.url);
});

var connector = new builder.ChatConnector({
    appid: process.env.MicrosoftAppid,
    appPassword: process.env.MicrosoftAppPassword,
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, [
    function (session) {
        session.send('歡迎光臨台鐵')
        session.beginDialog('booking')
    },
    function(session,results){
        session.dialogData.orders = results.response;
        session.beginDialog('Customer')
    },
    function(session,results){
        var Customer = results.response
        var orders = session.dialogData.orders;
         session.endDialog(`${Customer.Name}你好<br>您的電話：${Customer.Tel}<br>你購買了${orders.tickets}張票`)
        

    }]
);
bot.dialog('booking',[
    function (session) {
        session.dialogData.orders = {};
        builder.Prompts.number(session, "需要的幾張票")
    }, 
    function(session,results){
        session.dialogData.orders.tickets = results.response;
        if (session.dialogData.orders.tickets > 6){
            session.send(`規定一個人只能購買6張票唷`)
            session.replaceDialog('booking')
        }
       
        else{
        session.endDialogWithResult({
            response:session.dialogData.orders })
        }
    }
]);
bot.dialog('Customer',[
    function (session) {
        session.dialogData.Customer={};
        builder.Prompts.text(session, "訂票大名")
    },
    function (session, results) {
        session.dialogData.Customer.Name = results.response;
        builder.Prompts.number(session, "訂票電話")
    },
    function(session,results){
        session.dialogData.Customer.Tel = results.response;
        session.endDialogWithResult({
            response:session.dialogData.Customer
        });
    }

]);