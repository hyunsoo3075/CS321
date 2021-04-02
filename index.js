const Discord = require('Discord.js')
let que = require('./Question.js');
let users =  require('./User.js');
let Question = que.Question;
let User =  users.User;

const {prefix, token} = require('./config.json')
const client = new Discord.Client();

const upFilter = reaction => reaction.emoji.name === '';


var namedict = {};
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
    return Math.random().toString(36).substr(2, 6);
  }

/*This interval go through messages in the channel and add them to a list
if not already.
I also move the member indexing and upvote counting to this loop*/
/*
setInterval(function() {
    //Stuff for members
    
    client.guilds.cache.forEach((guild) => {
        console.log(guild.name);
        guild.fetch().then((members) =>{
            if(!(members in memberdict))
            {
                memberdict[members] = 0;
            }
        })
    });
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
*/

client.on('message', message => {
    if(questionStart.includes(message.content.split(" ")[0].toLowerCase()))  {
        if(!(message in questions))
        {
            unique = getUID();
            while(unique in questions) {
                unique = getUID();
            }
            question = new Question(unique);
            questions[unique] = question;
            message.reply(`The above question UID is ${unique}`);
        }
    }
    else if (answerStart.includes(message.content.split(" ")[0].toLowerCase())) {
        if(message.content.split(" ")[1] in questions) {
            questions[message.content.split(" ")[1]].addAnswer(message);
        if(!(message.author.username.toLowerCase() in namedict)) {
            namedict[message.author.username.toLowerCase()] = new User(message.author);
            }
        }
        else{
            message.reply("Invalid Question UID");
        }
    }  
    else if ("score:" == (message.content.split(" ")[0].toLowerCase()))
    {
        if(message.content.split(" ")[1].toLowerCase() in namedict) {
            score = namedict[message.content.split(" ")[1].toLowerCase()].getPoint();
            message.reply(`${message.content.split(" ")[1]}'s score: ${score }`);
        }
        else {
            message.reply(`Invalid username`);
        }
    }
    else if ("answers:" == (message.content.split(" ")[0].toLowerCase()))
    {
        if(message.content.split(" ")[1] in questions) {
            message.reply(`${message.content.split(" ")[1]}' answers: \n${questions[message.content.split(" ")[1]].getAnswers()}`);
        }
        else {
            message.reply(`Invalid question UID`);
        }
    }
});

client.on('messageReactionAdd', async (reaction, user) => {
	// When we receive a reaction we check if the reaction is partial or not
    
	if (reaction.partial) {
		// If the message this reaction belongs to was removed the fetching might result in an API error, which we need to handle
		try {
			await reaction.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
			// Return as `reaction.message.author` may be undefined/null
			return;
		}
	}
    // Now the message has been cached and is fully available
    if(reaction.message.content.split(" ")[1] in questions) {
        if(reaction.emoji.name == '⬆️') {
            namedict[reaction.message.author.username.toLowerCase()].addPoint();
        }
        if(reaction.emoji.name == '⬇️') {
            namedict[reaction.message.author.username.toLowerCase()].subtractPoint();
        }
    }    
});


//keep at end of file
client.login(token)