const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();

const upFilter = reaction => reaction.emoji.name === '';

var memberdict = {};
var oneTimeOnly = false;
var checkminutes = 1, checkthe_interval = checkminutes * 60 * 1000;
var interval

channels = [];//we might need list of text channels
var questions = {};
var answers = {};
questionStart= ['question', '[question]', 'que', '[q]'];
answerStart= ['answer', '[answer]', 'aswr', 'ans', '[a]'];

client.once('ready', function(msg) {
    console.log('Bot is on!');
});

function getChannel(fetch) 
{
try{
let c = client.channels.cache.array();
channels = [];
for (const channel of c) 
{
    if(channel.isText()){
    channels.push(channel);
    //console.log(channel.id);
    }
}}catch(err){
    console.log('array error')
    message.channel.send('An error occoured while getting the channels.')
    console.log(err)
}
return channels;
}

async function lots_of_messages_getter(channel, limit = 500) {
    sum_messages = [];
    let last_id;

    while (true) {
        const options = { limit: 100 };
        if (last_id) {
            options.before = last_id;
        }

        const messages = await channel.messages.fetch(options);
        sum_messages.push(...messages.array());
        last_id = messages.last().id;

        if (messages.size != 100 || sum_messages >= limit) {
            break;
        }
    }

    return sum_messages;
}

function getUID()  {
    // Math.random should be unique because of its seeding algorithm.
    // Convert it to base 36 (numbers + letters), and grab the first 9 characters
    // after the decimal.
    return '_' + Math.random().toString(36).substr(2, 9);
  }

/*This interval go through messages in the channel and add them to a list
if not already.
I also move the member indexing and upvote counting to this loop*/
setInterval(function() {
    //Stuff for members
    /*
    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);
        guild.fetch().then((members) =>{
            if(!(members in memberdict))
            {
                memberdict[members] = 0;
            }
        })
    });*/
    //Stuff for questions and answers
    getChannel()
    var i = 0;
    var m = channels.length;
    for(i; i < m; i++) {
        lots_of_messages_getter(channels[i], limit = 500).then(m => {
            var j = 0; 
            var l = m.length;
            for(j; j < l; j++) {
                message = m[j];
                if(questionStart.includes(m[j].content.split(" ")[0].toLowerCase()))  {
                    if(!(message in questions))
                    {
                        questions[message] = getUID();
                    }
                }
                else if (answerStart.includes(m[j].content.split(" ")[0].toLowerCase())) {
                    reactionUp = message.reactions.cache.get('⬆️');
                    reactionDown =  message.reactions.cache.get('⬇️');
                    upcount = 0;
                    downcount = 0;
                    if(reactionUp){
                        upcount = reactionUp.count;
                    }
                    if(reactionDown){
                        downcount = reactionDown.count;
                    }
                    if(message in answers) {
                        change  = (upcount-downcount) - answers[message];
                        answers[message] = (upcount- downcount);
                        memberdict[message.author] += change; 
                        
                    }
                    else {
                        answers[message] = (upcount - downcount);
                        if(!(message.author in memberdict)) {
                            memberdict[message.author] = (upcount - downcount);
                        }
                        else {
                        memberdict[message.author] += (upcount - downcount); 
                        }
                    }
                }
            }
        });
        
    }
  
    for (var key in questions){
        console.log( key, questions[key] );
      }
      for (var key in answers){
        console.log( key, answers[key] );
      }
      for (var key in memberdict){
        console.log( key, memberdict[key] );
      }
}, checkthe_interval);


client.on('message', message => {
    
	if (message.content.startsWith(`[Question]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'));
    } 
    else if (message.content.startsWith(`[Answer]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'));
    }

   
});

//keep at end of file
client.login(token)