
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
        session.send('歡迎光臨花花名宿')
        session.beginDialog('booking')
    },
    function(session,results){
        session.dialogData.orders = results.response;
        session.beginDialog('Customer')
    },
    function(session,results){
        var Customer = results.response
        var orders = session.dialogData.orders;
        session.endDialog(`hi ${Customer.Name}<br>您的聯絡電話：${Customer.Tel}<br>您定的房型是${orders.room}<br>您有${orders.big}位大人${orders.small}位小孩<br>入住時間為：${orders.intime}<br>退房時間為：${orders.outtime}`)
    }]
);
bot.dialog('booking',[
    function (session) {
        session.dialogData.orders = {};
        builder.Prompts.choice(session, "需要的房型",["經濟房","豪華房","總統房"],{ listStyle: builder.ListStyle.button })
    }, function (session, results) {
        session.dialogData.orders.room = results.response.entity;
        builder.Prompts.number(session, "幾位大人呢")
    }, function (session, results) {
        session.dialogData.orders.big = results.response;
        builder.Prompts.number(session, "幾位小孩呢")
    },
    function (session, results) {
        session.dialogData.orders.small = results.response;
        builder.Prompts.time(session, "請問入住時間");
    },
    function (session, results) {
        var response = results.response;
        session.dialogData.orders.intime = builder.EntityRecognizer.resolveTime([response]);
        builder.Prompts.time(session,"請問退房時間");
    },
    function(session,results){
        var response = results.response;
        session.dialogData.orders.outtime = builder.EntityRecognizer.resolveTime([response]);
        session.endDialogWithResult({
            response:session.dialogData.orders
        })
    }
    
]);
bot.dialog('Customer',[
    function (session) {
        session.dialogData.Customer={};
        builder.Prompts.text(session, "訂房大名")
    },
    function (session, results) {
        session.dialogData.Customer.Name = results.response;
        builder.Prompts.number(session, "訂房電話")
    },
    function(session,results){
        session.dialogData.Customer.Tel = results.response;
        session.endDialogWithResult({
            response:session.dialogData.Customer
        });
    }

]);