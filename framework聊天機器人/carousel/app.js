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

var bot = new builder.UniversalBot(connector, function (session) {
    var msg = new builder.Message(session);
    msg.attachmentLayout(builder.AttachmentLayout.carousel);
    msg.attachments([
        new builder.HeroCard(session)
            .title("紅茶")
            .subtitle("好喝的紅茶")
            .text("紅茶是全發酵的茶葉，在發酵的過程中，茶葉的茶鞣質經氧化而生成鞣質紅，不僅使茶葉色澤烏黑，水色葉底紅亮，并且使茶葉的香氣和滋味也發生了變化，具有水果香氣和醇厚滋味，與綠茶截然不同。")
            .images([
                builder.CardImage.create(session, "http://salon-demain.com/dieting/wp/wp-content/uploads/2010/10/%E7%B4%85%E8%8C%B6.jpg")])
            .buttons([
                builder.CardAction.imBack(session, "紅茶中杯", "中杯-$30元"),
                builder.CardAction.postBack(session, "紅茶,大杯,1", "大杯-$50元"),
                builder.CardAction.openUrl(session, "http://big5.wiki8.com/hongcha_116091/", "詳細介紹")]),
        new builder.HeroCard(session)
            .title("奶茶")
            .subtitle("好喝的奶茶")
            .text("紅茶是全發酵的茶葉，在發酵的過程中，茶葉的茶鞣質經氧化而生成鞣質紅，不僅使茶葉色澤烏黑，水色葉底紅亮，并且使茶葉的香氣和滋味也發生了變化，具有水果香氣和醇厚滋味，與綠茶截然不同。")
            .images([
                builder.CardImage.create(session, "http://pic6.nipic.com/20100308/3101644_093826095802_2.jpg")])
            .buttons([
                builder.CardAction.imBack(session, "奶茶中杯", "中杯-$30元"),
                builder.CardAction.postBack(session, "奶茶,大杯,1", "大杯-$50元"),
                builder.CardAction.openUrl(session, "http://big5.wiki8.com/hongcha_116091/", "詳細介紹")]),
        new builder.HeroCard(session)
            .title("綠茶")
            .subtitle("好喝的綠茶")
            .text("紅茶是全發酵的茶葉，在發酵的過程中，茶葉的茶鞣質經氧化而生成鞣質紅，不僅使茶葉色澤烏黑，水色葉底紅亮，并且使茶葉的香氣和滋味也發生了變化，具有水果香氣和醇厚滋味，與綠茶截然不同。")
            .images([
                builder.CardImage.create(session, "http://2.bp.blogspot.com/-LOtqTfJNOR4/T9W-cljWpwI/AAAAAAAAAEI/RDiyV_EXcMg/s1600/pepperminttea.jpg")])
            .buttons([
                builder.CardAction.imBack(session, "綠茶中杯", "中杯-$30元"),
                builder.CardAction.postBack(session, "綠茶,大杯,1", "大杯-$50元"),
                builder.CardAction.openUrl(session, "http://big5.wiki8.com/hongcha_116091/", "詳細介紹")])

    ]);
    session.endDialog(msg);
});