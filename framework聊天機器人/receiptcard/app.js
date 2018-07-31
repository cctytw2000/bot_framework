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
        var msg = new builder.Message(session);
        msg.attachments([
            new builder.ReceiptCard(session)
            .title("您的明細")
            .facts([
                builder.Fact.create(session,"john","訂購人"),
                builder.Fact.create(session,"3345678","電話"),
                builder.Fact.create(session,"台灣","配送地址"),
            ])
            .items([
                builder.ReceiptItem.create(session,'$20','紅茶X1中杯')
                .subtitle('去冰半糖'),
                builder.ReceiptItem.create(session,'$95',"蛋糕X2份")
            ])
            .total('$115')
        ])
session.endDialog(msg);
});