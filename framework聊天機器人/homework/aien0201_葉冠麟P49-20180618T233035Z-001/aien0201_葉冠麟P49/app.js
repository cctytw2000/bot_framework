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
        builder.Prompts.text(session, "訂房人大名")
    },
    function (session, results) {
        session.dialogData.Name = results.response;
        builder.Prompts.number(session, "訂房人電話")
    },
    function (session, results) {
        session.dialogData.Tel = results.response;
        builder.Prompts.choice(session, "要定的房型", ["經濟房", "豪華房", "總統房"], { listStyle: builder.ListStyle.button })
    },
    function (session, results) {
        session.dialogData.room = results.response.entity;
        builder.Prompts.number(session, "幾位大人")
    },
    function (session, results) {
        session.dialogData.big = results.response;
        builder.Prompts.number(session, "有小孩嗎")
    },
    function (session, results) {
        session.dialogData.small = results.response;
        builder.Prompts.time(session, "請問入住時間");
    },
    function (session, results) {
        session.dialogData.intime = builder.EntityRecognizer.resolveTime([results.response])
        builder.Prompts.time(session, "請問退房時間");
    },

    function (session, results) {
        session.dialogData.outtime = builder.EntityRecognizer.resolveTime([results.response])
        session.endDialog(`hi ${session.dialogData.Name}<br>您的連絡電話${session.dialogData.Tel}<br>${session.dialogData.room}<br>您有${session.dialogData.big}位大人${session.dialogData.small}位小孩<br>入住時間：${session.dialogData.intime}<br>退房時間：${session.dialogData.outtime.getMonth() + 1}/${session.dialogData.outtime.getDate()} ${session.dialogData.outtime.getHours()}:${session.dialogData.outtime.getMinutes()}`)
    }
]);

