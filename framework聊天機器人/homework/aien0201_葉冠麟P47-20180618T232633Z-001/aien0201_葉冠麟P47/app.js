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
        session.send("歡迎光臨花花民宿")
        builder.Prompts.text(session,"訂購人姓名")
    },
    function (session, results) {
        session.dialogData.Name = results.response.entity;
        builder.Prompts.number(session, "訂購人電話")
    },
    function (session, results) {
        session.dialogData.Tel = results.response;
        builder.Prompts.text(session, "送貨地址")
    },
    function (session, results) {
        session.dialogData.address = results.response;
        builder.Prompts.text(session, "需要的飲料")
    }, function (session, results) {
        session.dialogData.drinkitem = results.response;
        builder.Prompts.choice(session, "需要幾杯呢", ["一杯", "二杯", "三杯", "四杯"], { listStyle: builder.ListStyle.button })
    }, function (session, results) {
        session.dialogData.drinkmuch = results.response.entity;
        builder.Prompts.choice(session, "要大杯還是小杯呢", ["大杯", "小杯"], { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        session.dialogData.height = results.response.entity;
        builder.Prompts.choice(session, "甜度", ["正常","少糖", "半糖","微糖", "無糖"], { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.sweet = results.response.entity;
        builder.Prompts.choice(session, "溫度", ["正常冰","少冰","微冰", "去冰","溫飲","熱飲"], { listStyle: builder.ListStyle.button });
    },
    function (session, results) {
        session.dialogData.ice = results.response.entity;
        builder.Prompts.time(session, "請問甚麼時間幫您送");
    },
    function (session, results) {
        session.dialogData.time = builder.EntityRecognizer.resolveTime([results.response])
        session.endDialog(`hi ${session.dialogData.Name}<br>您的聯絡電話：${session.dialogData.Tel}<br>您的送貨地址：${session.dialogData.address}<br>您要點的飲料是${session.dialogData.drinkmuch}${session.dialogData.height}的${session.dialogData.drinkitem}<br>甜度是：${session.dialogData.sweet}<br>冰塊是：${session.dialogData.ice}<br>送達時間預計是：${session.dialogData.time.getFullYear()}/${session.dialogData.time.getMonth() + 1}/${session.dialogData.time.getDate()} ${session.dialogData.time.getHours()}:${session.dialogData.time.getMinutes()}
    `)
    }]
);