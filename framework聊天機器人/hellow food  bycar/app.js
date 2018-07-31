var restify = require('restify');
var builder = require('botbuilder');
var menuItems = require('./menuConfig.json');

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
        session.replaceDialog('mainMenu')
    }

]);
bot.dialog('orderDrink',[
    function (session) {
        session.dialogData.orders = {item:"drink"};
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
bot.dialog('mainMenu',[
    function(session,args){
        var promptText;
        if (args && args.reprompt){
            promptText = "請問你要再點甚麼"
        }else{
            promptText = "請問你要點甚麼"
            session.conversationData.orders = new Array();
        }
        builder.Prompts.choice(session,promptText,menuItems,{listStyle:builder.ListStyle.button});
    },
    function(session,results){
        var dialogID = menuItems[results.response.entity];
        if (results.response.entity == "結帳"){
            session.replaceDialog(dialogID)
        }else{
            session.beginDialog(dialogID)
        }
    },
    function(session,results){
        var order = results.response;
        var msg ;
        if (order.item == "drink"){
            msg = `<br>${order.drinkitem}${order.drinkmuch}杯${order.height}<br>冰熱:${order.ice}<br>甜度:${order.sweet}`;
        }else if (order.item == "food"){
            msg = `<br>${order.foodName}共${order.FoodNumber}份`;
        }
        session.send("你剛剛點了:<br>%s",msg);
        session.conversationData.orders.push(order);
        session.replaceDialog("mainMenu",{reprompt:true});
    },
]);
bot.dialog('checkOut',[
    function(session){
        session.beginDialog("shipmants")
    },
    function(session,results){
        var shipmant = results.response;
        var orders = session.conversationData.orders;
        var ordersText="";
        orders.forEach(orders => {
        if(orders.item == "drink"){
            ordersText +=`<br>${orders.drinkitem}<br>${orders.drinkmuch}杯<br>${orders.height}冰熱:${orders.ice}甜度:${orders.sweet}`;
        }else if (orders.item == "food"){
            ordersText +=`<br>${orders.foodName}<br>共${orders.FoodNumber}份`
        }  
     });  
        var shipmantText = `訂購人:<br>${shipmant.Name}<br>${shipmant.Tel}<br>${shipmant.address}`;    
        session.endConversation("%s<br>訂單明細:%s",shipmantText,ordersText);
    }
]);
bot.dialog('orderFood',[
    function(session){
        session.dialogData.orders={item:"food"}
        builder.Prompts.text(session,"請問要點甚麼餐點?");
    },
    function(session , results){
        session.dialogData.orders.foodName = results.response;
        builder.Prompts.number(session,"請問你要幾份?");
    },
    function(session,results){
        session.dialogData.orders.FoodNumber = results.response;
        session.endDialogWithResult({
            response:session.dialogData.orders
        });
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
            response:session.dialogData.shipmants});
    }

]);