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
var calendar_event_template = require('./Calendar-event');

console.log(calendar_event_template.templates[0]);

var app = apiai("acbaa2a1dc224492be9e3a55548f503a");
// var responseAPI = response.result.parameters
//
// var request = app.textRequest("cuantos eventos hay para hoy", {
//     sessionId: '<unique session id>'
// });
//
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
//
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
});

// Connect to the Slack Bot
controller.spawn({
  token:"xoxb-179220163349-IUevu7WzWV1M9TXZ7HYHjHQB"
  //token: process.env.token
}).startRTM(function(err) {
  if (err) {
    throw new Error(err);
  }
});

controller.on(['direct_mention','direct_message'],function(bot,message){
    console.log(message.text);

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

// Primer parametro que tu quieres que el bot responda al mensaje. Segundo parametro - en donde tu quieres que bot "escuche" al mensaje del primer parametro.
controller.hears(['hello','hi'],['direct_message','direct_mention','mention'],function(bot,message) {
    // El bot envia el mensaje que tu le especifique en el segundo parametro
    console.log("helooo");
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

controller.hears(['question me'], 'direct_mention', function(bot,message) {

  // start a conversation to handle this response.
  bot.startConversation(message,function(err,convo) {

    convo.addQuestion('How are you?',function(response,convo) {

      convo.say('Cool, you said: ' + response.text);
      convo.next();

    },{},'default');

  })

});

controller.hears(['question'], 'direct_mention', function(bot,message) {

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


controller.hears('interactive', 'direct_mention', function(bot, message) {

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


controller.hears('cli', 'direct_mention', function(bot, message) {

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

controller.hears('button2', 'direct_mention', function(bot, message) {
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

controller.hears('button3', 'direct_mention', function(bot, message) {
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


controller.hears('button4', 'direct_mention', function(bot, message) {
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

controller.hears('menu', 'direct_mention', function(bot, message) {
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
