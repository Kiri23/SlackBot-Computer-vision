/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Send a message with attachments
* Send a message via direct message (instead of in a public channel)

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node demo_bot.js

# USE THE BOT:

  Find your bot inside Slack to send it a direct message.

  Say: "Hello"

  The bot will reply "Hello!"

  Say: "Attach"

  The bot will send a message with a multi-field attachment.

  Send: "dm me"

  The bot will reply with a direct message.

  Make sure to invite your bot into other channels using /invite @<my bot>!

# EXTEND THE BOT:

  Botkit has many features for building cool and useful bots!

  Read all about it here:

    -> http://howdy.ai/botkit

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


// Library to interact with the slack api
var Botkit = require('botkit');
var apiai = require ("apiai");
// to make the http request to the microsoft vision api
var request = require('request');

// I use APIAI for natural language processing.
   // The bot will know what you are asking him without to do validation to look for specific word in the chat.
var app = apiai("<USE-YOUR-OWN-APIAI-KEY");
console.log("hello heroku");
// console.log(app);
// var responseAPI = response.result.parameters
//
// var request = app.textRequest("cuantos eventos hay para hoy", {
//     sessionId: '<unique session id>'
// });
// console.log(request);
//
// request.on('response', function(response) {
//   var responseAPI = response.result.parameters
//   console.log(responseAPI);
//   console.log(responseAPI['date']);
//   console.log(responseAPI['date-period']);
//   // console.log(responseAPI.date['date-period']);
//   if (responseAPI.time){
//     console.log("tiempo");
//   }else if (responseAPI['date-period']){
//     console.log("date-period");
//   }else if (responseAPI['date']){
//     console.log("date");
//   }
//    console.log("Evento: "+response.result.parameters.Event+"\n" +
//                 "tiempo: " + response.result.parameters.time
//  );
// });
//
// request.on('error', function(error) {
//    console.log(error);
// });
// //
// request.end();


// Uncoment this si quieres poner el token por el terminal
/* if (!process.env.token) {
  console.log('Error: Specify token in environment');
  process.exit(1);
} */

var controller = Botkit.slackbot({
 debug: false,
 stats_optout: true,
 interactive_replies: true
}).configureSlackApp(
  {
    clientId: "YOUR OWN CLIENT ID ",
    clientSecret: "YOUR OWN CLIENT SERET",
    scopes: ['bot'],
  }
);

// Connect to the Slack Bot -
// This token in combination with the computer vision api token is  the only thing that you need if you want to test the computer vision api you can ignore the next tree if you only want to test the computer vision api
// This token connect to your slack team and you can start interacting with the bot
controller.spawn({
  token:"YOUR TOKEN "
  //token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

// Node.JS Cognitive service vision API
// Set the headers

// This method made a call to the Computer vision to make a prediction about the image
function visionAPI(url,bot,message) {
  // console.log("la url:",url);
  var options = { method: 'POST',
    url: 'https://westus.api.cognitive.microsoft.com/vision/v1.0/analyze',
    qs:
     { visualFeatures: 'Description',
       language: 'en',
       'subscription-key': 'YOUR COMPUTER VISION API TOKEN ' },
    headers:
     { 'postman-token': 'YOUR TOKEN ',
       'cache-control': 'no-cache',
       'content-type': 'application/json' },
    body: { url: url.toString() },
    json: true };

    // Make Http post call
    request(options, function (error, response, body) {
        // console.log("body",body);
        var prediction = body.description.captions[0].text
        var confidence = body.description.captions[0].confidence * 100
        // console.log(prediction);
        // console.log(confidence);
        var messageSent = "I think this is `"+prediction+ "` and I am `"+confidence+"`% sure";
        bot.reply(message,messageSent)
    });
}

//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//   // var parsedData = JSON.parse(response);
//   var str = "Describe this image         http://i.imgur.com/MCiibwX.jpg";
//   var stru = str.toUpperCase();
//   var strw = str.replace(/ +/g, "");
//   console.log(strw);
//   var res = str.slice(19);
//   // console.log(res);
//   var res2 = str.match(/(https?:\/\/[^\s]+)/g);
//   // console.log(res2[0]);
//   str2 = "Describe this image http://i.imgur.com/MCiibwX.jpg "
//   stru2 = str2.toUpperCase()
//   strw2 = str.replace(/ +/g, "");
//   console.log(strw2);
//   if (strw.localeCompare(strw2) == 0){
//     console.log("son igules");
//   }else{
//     console.log("algo fallo");
//   }
//
//   console.log(body.description.captions[0].text);
//
//   // http://i.imgur.com/MCiibwX.jpg
// });

// set up a botkit app to expose oauth and webhook endpoints
controller.setupWebserver(5005,function(err,webserver) {

  // set up web endpoints for oauth, receiving webhooks, etc.
  controller
    .createHomepageEndpoint(controller.webserver)
    .createOauthEndpoints(controller.webserver,function(err,req,res) { "https://bots.api.ai/slack/69052107-e13e-4c6c-9a72-446a8450a7f7/webhook"})
    .createWebhookEndpoints(controller.webserver);

});

// When a user say this run the callback function
controller.on('interactive_message_callback', function(bot, message) {
  // Interactive message
  bot.replyInteractive(message, {
       text: '...',
       attachments: [
           {
               title: 'My buttons',
               callback_id: '123',
               attachment_type: 'default',
               actions: [
                   {
                       "name":"yes",
                       "text": "Yes!",
                       "value": "yes",
                       "type": "button",
                   },
                   {
                      "text": "No!",
                       "name": "no",
                       "value": "delete",
                       "style": "danger",
                       "type": "button",
                       "confirm": {
                         "title": "Are you sure?",
                         "text": "This will do something!",
                         "ok_text": "Yes",
                         "dismiss_text": "No"
                       }
                   }
               ]
           }
       ]
   });

});


// Make a call to the natural lnaguage processing api
controller.on(['direct_mention','direct_message'],function(bot,message){
    console.log(message.text + "mensaje");

    var request = app.textRequest(message.text, {
        sessionId: '<unique session id>'
    });


    request.on('response', function(response) {
      // console.log(response);
      var responseAPI = response.result.parameters
      console.log(responseAPI);

      //console.log(response.result.parameters.date-period);
      // console.log(response.result.parameters.date-period);

      var time;
      if (responseAPI){
        if (responseAPI.time){
          console.log("tiempo");
          time = responseAPI.time
        }else if (responseAPI['date-period']){
          console.log("date-period");
          time = responseAPI['date-period']
        }else if (responseAPI['date']){
          time = responseAPI['date']
          console.log("date");
        }
         bot.reply(message,"Evento: "+response.result.parameters.Event+"\n" +
                      "tiempo: " + time
       )
     }

    });

    request.on('error', function(error) {
       console.log(error);
    });

    request.end();

});

// Where the magig happen for the prediction of a image
controller.on(['direct_mention','direct_message'],function(bot,message){
    // First verify if the text enter by the user in the chat is the same as this Base string
    var baseStr = "Describe this image" ;
    // avoid case sensitive
    var baseStr2 = baseStr.toUpperCase();
    // replace any white space between word
    var baseStr3 = baseStr2.replace(/ +/g, "");

    // message.text - is the message enter by the user in the chat repeat the same procces as above
    var compareStr = message.text
    // Todo fix - dont convert the url to uppercase. The url has to be the same as the user enter for the computer vision to procces
    var compareStr2 = compareStr.toUpperCase()
    // replace any white space
    var compareStr3 = compareStr2.replace(/ +/g, "");

    // reverse String to eliminate the URL and made the if statement to check is this sentence contain "Describe this image". If this sentence contain "describe this image" the do another validation to check if it contain an url. then make the call to the Computer vision api. The below line convert the string to a array
    var reverse = compareStr3.split("");
    // console.log("reverse",reverse);
    // reverse the string with a built in method
    var reverse2 = reverse.reverse();
    // Join again the string from an array
    var reverse3 = reverse2.join("");
    // eliminate the part that contain an url. The url will always contain a "< and > " because that is how slack return the message enter by the user
    var strUrlR = reverse3.split(">")
    // console.log(strUrlR[1]);

    // console.log("reverse ", reverse3);
    // reverse again the url
    var reverse4 = reverse2.reverse();
    // make a string out of an array of string.Note the url is still in reverse order.
    var reverse5 = reverse4.join("");
    // console.log("bien ",reverse5);

    // URL Bien. This part will put the url in the right order.The code above check if there is a string in the 'strUrlR[1]'.I do this for validation purpose if the user dont inted to use the computer vision api the code below will scratch because strUrlR[1] is null
    if(strUrlR[1]){
      // Convert the string to array
       var strUrl = strUrlR[1].split("");
       // console.log(strUrl);
       // Reverse the string. Is going to have this order: https:// ....
       var strUrl2 = strUrl.reverse();
       // Make the string out of an array
       var strUrl2 = strUrl.join("");
       console.log("url derecha ",strUrl2);
       // eliminate the last part of the string that is a "<". In line 305 I remove the ">" part of the string. That's one of the purpose why I rverse the string.
       var compareStr4 = strUrl2.slice(0,17);
     }
    // console.log(compareStr4);
    // console.log(baseStr3);


    // console.log(compareStr3);
    // Compare the string to chech if they are equals
    if (baseStr3.localeCompare(compareStr4) == 0){
      // bot.reply(message,"son iguales")
      // console.log("llegamos al loop");
      // console.log(compareStr3);
      // regex expression for verify for a https
      var res2 = compareStr3.match(/(HTTPS?:\/\/[^\s]+)/g);
      // console.log(res2);
      // Validation Check
      var res3 = res2[0].slice(0,-1);
      // console.log(res3.toString());
      // Validation again to check if the string contain an HTTP
      var containHttp = res3.toString().includes('HTTP',0);
      // console.log(containHttp);
      if (containHttp){
          // console.log("llegue procima llamada bot");
          // Make the Computer vision API
          visionAPI(res3.toLowerCase(),bot,message);
      }else{
        bot.reply(message,"Humm?. Parece que eso no es una URL. Trate de nuevo")
      }
    }

});

// Primer parametro que tu quieres que el bot responda al mensaje. Segundo parametro - en donde tu quieres que bot "escuche" al mensaje del primer parametro.
controller.hears(['hello','hii'],['direct_message','direct_mention'],function(bot,message) {
    // El bot envia el mensaje que tu le especifique en el segundo parametro
    console.log("helooo pqq");
    bot.reply(message,"Hello.");
});

controller.hears(['attach'],['direct_message','direct_mention'],function(bot,message) {

  var attachments = [];
  var attachment = {
    title: 'This is an attachment',
    color: '#FFCC99',
    fields: [],
  };

  attachment.fields.push({
    label: 'Field',
    value: 'A longish value',
    short: false,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachment.fields.push({
    label: 'Field',
    value: 'Value',
    short: true,
  });

  attachments.push(attachment);

  bot.reply(message,{
    text: 'See below...',
    attachments: attachments,
  },function(err,resp) {
    console.log(err,resp);
  });
});

controller.hears(['dm me'],['direct_message','direct_mention'],function(bot,message) {
  bot.startConversation(message,function(err,convo) {
    convo.say('Heard ya');
  });

  bot.startPrivateConversation(message,function(err,dm) {
    dm.say('Private reply!');
  });

});

controller.hears(["complex"],['direct_message',"mention","direct_mention"],function(bot,message) {

    // do something...

    // then respond with a message object
    //
    bot.reply(message,{
      text: "A more complex response",
      username: "Codetrotters Bot",
      icon_emoji: ":codetrotters1:",
    });

});

controller.hears(["tu"],['direct_message',"mention","direct_mention"],function(bot,message) {
        var reply_with_attachments = {
      'username': 'My bot' ,
      'text': 'This is a pre-text',
      'attachments': [
        {
          'fallback': 'To be useful, I need you to invite me in a channel.',
          'title': 'How can I help you?',
          'text': 'To be useful, I need you to invite me in a channel ',
          'color': '#7CD197'
        }
      ],
      'icon_url': 'http://lorempixel.com/48/48'
      }

      bot.reply(message, reply_with_attachments);
});

controller.hears(['question me'], ['direct_mention','direct_message'], function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('How are you?',function(response,convo) {

      convo.say('Cool, you said: ' + response.text);
      convo.next();

    },{},'default');

  })

});

controller.hears(['question'], ['direct_mention','direct_message'], function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('Shall we proceed Say YES, NO or DONE to quit.',[
      {
        pattern: 'done',
        callback: function(response,convo) {
          convo.say('OK you are done!');
          convo.next();
        }
      },
      {
         pattern: 'yes2',
        callback: function(response,convo) {
          // first, define a thread called `next_step` that we'll route to...
          bot.createConversation(message, function(err, convo) {

              // create a path for when a user says YES
              convo.addMessage({
                      text: 'You said yes! How wonderful.',
              },'yes_thread');

              // create a path for when a user says NO
              convo.addMessage({
                  text: 'You said no, that is too bad.',
              },'no_thread');

              // create a path where neither option was matched
              // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
              convo.addMessage({
                  text: 'Sorry I did not understand.',
                  action: 'default',
              },'bad_response');

              // Create a yes/no question in the default thread...
              convo.addQuestion('Do you like cheese?', [
                  {
                      pattern: 'yes',
                      callback: function(response, convo) {
                          convo.gotoThread('yes_thread');
                      },
                  },
                  {
                      pattern: 'no',
                      callback: function(response, convo) {
                          convo.gotoThread('no_thread');
                      },
                  },
                  {
                      default: true,
                      callback: function(response, convo) {
                          convo.gotoThread('bad_response');
                      },
                  }
              ],{},'default');

              convo.activate();
          });
      }
    },
      //
      // {
      //   pattern: bot.utterances.yes,
      //   callback: function(response,convo) {
      //     convo.say('Great! I will continue...');
      //     // do something else...
      //     // create an end state thread - This is the Threat
      //     convo.addMessage('This is the end!', 'the_end');
      //
      //     // now transition there with a nice message - Transition to the treat
      //     convo.transitionTo('the_end','Well I think I am all done.');
      //     convo.next();
      //
      //   }
      // },
      // {
      //   // pattern: bot.utterances.no,
      //   callback: function(response,convo) {
      //     convo.say('Perhaps later.');
      //     convo.say('because you say no');
      //     // do something else...
      //     convo.next();
      //   }
      // },
      // {
      //   default: true,
      //   callback: function(response,convo) {
      //     // just repeat the question
      //     convo.repeat();
      //     convo.next();
      //   }
      // }
    ],{},'default');

  })

});


controller.hears('interactive', ['direct_mention','direct_message'], function(bot, message) {

    bot.reply(message, {
        attachments:[
            {
                title: 'Do you want to interact with my buttons?',
                callback_id: '123',
                attachment_type: 'default',
                actions: [
                    {
                        "name":"yes",
                        "text": "Yes",
                        "value": "yes",
                        "type": "button",
                    },
                    {
                       "text": "No!",
                        "name": "no",
                        "value": "delete",
                        "style": "danger",
                        "type": "button",
                        "confirm": {
                          "title": "Are you sure?",
                          "text": "This will do something!",
                          "ok_text": "Yes",
                          "dismiss_text": "No"
                        }
                    }
                ]
            }
        ]
    });
});


controller.hears('cli', ['direct_mention','direct_message'], function(bot, message) {

bot.startConversation(message, function(err, convo) {

    convo.ask({
        "text": "New comic book alert!","attachments": [
        {
            "title": "The Further Adventures of Slackbot",
            "fields": [
                {
                    "title": "Volume",
                    "value": "1",
                    "short": true
                },
                {
                    "title": "Issue",
                    "value": "3",
            "short": true
                }
            ],
            "author_name": "Stanford S. Strickland",
            "author_icon": "http://a.slack-edge.com/7f18https://a.slack-edge.com/bfaba/img/api/homepage_custom_integrations-2x.png",
            "image_url": "http://i.imgur.com/OJkaVOI.jpg?1"
        },
        {
            "title": "Synopsis",
            "text": "After @episod pushed exciting changes to a devious new branch back in Issue 1, Slackbot notifies @don about an unexpected deploy..."
        },
        {
            "fallback": "Would you recommend it to customers?",
            "title": "Would you recommend it to customers?",
            "callback_id": "comic_1234_xyz",
            "color": "#3AA3E3",
            "attachment_type": "default",
            "actions": [
                {
                    "name": "recommend",
                    "text": "Recommend",
                    "type": "button",
                    "value": "recommend",
                    "confirm": {
                      "title": "Are you sure?",
                      "text": "This will do something!",
                      "ok_text": "Yes",
                      "dismiss_text": "No"
                    }
                },
                {
                    "name": "no",
                    "text": "No",
                    "type": "button",
                    "value": "bad",
                    "confirm": {
                      "title": "Are you sure?",
                      "text": "This will do something!",
                      "ok_text": "Yes",
                      "dismiss_text": "No"
                    }
                }
            ]
        }
    ]
},[
        {
            pattern: "yes",
            callback: function(reply, convo) {
                convo.say('FABULOUS!');
                convo.next();
                // do something awesome here.
            }
        },
        {
            pattern: "no",
            callback: function(reply, convo) {
                convo.say('Too bad');
                convo.next();
            }
        },
        {
            default: true,
            callback: function(reply, convo) {
                // do nothing
            }
        }
    ]);
});

});

controller.hears('button2', ['direct_mention','direct_message'], function(bot, message) {
        bot.reply(message,
          {
            "attachments": [
        {
           "fallback": "New ticket from Andrea Lee - Ticket #1943: Can't reset my password - https://groove.hq/path/to/ticket/1943",
           "pretext": "New ticket from Andrea Lee",
           "title": "Ticket #1943: Can't reset my password",
           "title_link": "https://groove.hq/path/to/ticket/1943",
           "text": "Help! I tried to reset my password but nothing happened!",
           "color": "#7CD197"
       }
   ]
  });

});

controller.hears('button3', ['direct_mention','direct_message'], function(bot, message) {
        bot.reply(message,
          {
    "attachments": [
        {
            "fallback": "ReferenceError - UI is not defined: https://honeybadger.io/path/to/event/",
            "text": "<https://honeybadger.io/path/to/event/|ReferenceError> - UI is not defined",
            "fields": [
                {
                    "title": "Project",
                    "value": "Awesome Project",
                    "short": true
                },
                {
                    "title": "Environment",
                    "value": "production",
                    "short": true
                }
            ],
            "color": "#F35A00"
        }
    ]
}



        );

});


controller.hears('button4', ['direct_mention','direct_message'], function(bot, message) {
        bot.reply(message,
          {
              "attachments": [
                  {
                      "fallback": "Network traffic (kb/s): How does this look? @slack-ops - Sent by Julie Dodd - https://datadog.com/path/to/event",
                      "title": "Network traffic (kb/s)",
                      "title_link": "https://datadog.com/path/to/event",
                      "text": "How does this look? @slack-ops - Sent by Julie Dodd",
                      "image_url": "https://datadoghq.com/snapshot/path/to/snapshot.png",
                      "color": "#764FA5"
                  }
              ]
          }



        );

});

controller.hears('menu', ['direct_mention','direct_message'], function(bot, message) {
        bot.reply(message,
          {
              "text": "I hope the tour went well, Mr. Wonka.",
              "response_type": "in_channel",
              "attachments": [
                  {
                      "text": "Who wins the lifetime supply of chocolate?",
                      "fallback": "You could be telling the computer exactly what it can do with a lifetime supply of chocolate.",
                      "color": "#3AA3E3",
                      "attachment_type": "default",
                      "callback_id": "select_simple_1234",
                      "actions": [
                          {
                              "name": "winners_list",
                              "text": "Who should win?",
                              "type": "select",
                              "data_source": "users"
                          }
                      ]
                  }
              ]
          }



        );

});


// SImple server para que funcione en heroku el bot

var express = require('express')
var a = express()

a.get('/', function (req, res) {
  res.send('Hello World!')
})

a.listen(process.env.PORT || 5000, function () {
  console.log('Example app listening on port 5000!')
})

// Prevent your app from sleeping in heroku
var http = require("http");
var countTime = 0

setInterval(function() {
   // this is the callback this function will run every 28 minutes
    countTime = countTime + 1;
    if(countTime <=30){
    http.get("http://codetrotterslackbot.herokuapp.com");
    console.log("countTime",countTime);
 }else if (countTime >=30 && countTime <= 60){          // else si es mayor que 30
   console.log("Do Nothing pasaron las 14 horas del dyno");
   console.log("countTime",countTime);
 }else if (countTime > 60) { // ya paso un dia rese hour dyno
   countTime = 0
   console.log("restoring dyno hours");
 }
}, 1680000); // every 28 minutes (1,680,000)
