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
        session.send('歡迎光臨COCO')
        session.beginDialog('orderDrink')
    },
    function(session,results){
        session.dialogData.orders = results.response;
        session.beginDialog('shipmants')
    },
    function(session,results){
        var shipmants = results.response
        var orders = session.dialogData.orders;
        if (orders.drinkmuch <= 10){
        session.endDialog(`hi ${shipmants.Name}<br>您的聯絡電話：${shipmants.Tel}<br>您的送貨地址：${shipmants.address}<br>您要點的飲料是${orders.drinkmuch}杯${orders.height}的${orders.drinkitem}<br>甜度是：${orders.sweet}<br>冰塊是：${orders.ice}<br>送達時間預計是：15分鐘之後`)
        }
        else {
        session.endDialog(`hi ${shipmants.Name}<br>您的聯絡電話：${shipmants.Tel}<br>您的送貨地址：${shipmants.address}<br>您要點的飲料是${orders.drinkmuch}杯${orders.height}的${orders.drinkitem}<br>甜度是：${orders.sweet}<br>冰塊是：${orders.ice}<br>送達時間預計是：30分鐘之後`)
        }
    }]
);
bot.dialog('orderDrink',[
    function (session) {
        session.dialogData.orders = {};
        builder.Prompts.text(session, "需要的飲料")
    }, function (session, results) {
        session.dialogData.orders.drinkitem = results.response;
        builder.Prompts.number(session, "需要幾杯呢")
    }, function (session, results) {
        session.dialogData.orders.drinkmuch = results.response;
        builder.Prompts.choice(session, "要大杯還是小杯呢", ["大杯", "小杯"], { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        session.dialogData.orders.height = results.response.entity;
        builder.Prompts.choice(session, "甜度", ["正常","少糖", "半糖","微糖", "無糖"], { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.orders.sweet = results.response.entity;
        builder.Prompts.choice(session, "溫度", ["正常冰","少冰","微冰", "去冰","溫飲","熱飲"], { listStyle: builder.ListStyle.button });
    },
    function(session,results){
        session.dialogData.orders.ice = results.response.entity;
        session.endDialogWithResult({
            response:session.dialogData.orders
        })
    }
    
]);
bot.dialog('shipmants',[
    function (session) {
        session.dialogData.shipmants={};
        builder.Prompts.text(session, "訂購人大名")
    },
    function (session, results) {
        session.dialogData.shipmants.Name = results.response;
        builder.Prompts.number(session, "訂購人電話")
    },
    function (session, results) {
        session.dialogData.shipmants.Tel = results.response;
        builder.Prompts.text(session, "送貨地址")
    },
    function(session,results){
        session.dialogData.shipmants.address = results.response;
        session.endDialogWithResult({
            response:session.dialogData.shipmants
        });
    }

]);