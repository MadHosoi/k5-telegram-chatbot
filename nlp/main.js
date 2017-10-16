const request = require('request');

const Telegraf = require('telegraf');

const bot = new Telegraf(process.env.TOKEN);

bot.command('start', (ctx) => {
  console.log('start', ctx.from);
  ctx.reply('Welcome HOME!');
});

bot.command('hi', (ctx) => {
  console.log('hi', ctx.from);
  ctx.reply('Hi all!!');
});

bot.hears('Hi', (ctx) => {
  ctx.reply('Hola, como te llamas?');
});

bot.on('photo', (ctx) => {
    
    ctx.reply('He recibido una foto');
    
    ctx.state.url = "https://api.telegram.org/bot" + process.env.TOKEN + "/getFile?file_id=" + ctx.message.photo[0].file_id;

    request.get(ctx.state.url, function (error, response, body) {
      var data = "";
      if (!error && response.statusCode == 200) {
        data += body;
      }
      else {
        data += error;
      }
      //ctx.reply(data);
      var img = JSON.parse(data);
      ctx.reply(JSON.stringify(img));
      ctx.state.url = "https://api.telegram.org/file/bot" + process.env.TOKEN + "/" + img.result.file_path;
      request.get(ctx.state.url, function (error, response){//, body) {
        if (!error && response.statusCode == 200) {
          // En BODY está la imagen en binario.
          ctx.reply(
            JSON.stringify(response)
          );
        }
        else {
          //ERROR
          ctx.reply(error);
        }
      });
    });
    ctx.reply(ctx.state.url);
    //ctx.reply(JSON.stringify(ctx.message.photo));
});

//bot.startPolling();

const express = require("express");
const app = express();

app.use(bot.webhookCallback('/'));
app.set('view engine', 'pug');

app.get('/', function(req, res) {
  res.render('main', { 
    title: 'Chatbot App', 
    message: 'Welcome to Fujitsu Chatbot!!'
  });
  
});

app.listen(process.env.PORT || 3000, function () {
  console.log('App listening on port '+ (process.env.PORT !== undefined ? process.env.PORT : 3000) +'!');
});