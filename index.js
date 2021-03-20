const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();

const upFilter = reaction => reaction.emoji.name === '⬆️';

var keyValueArr = {};
var oneTimeOnly = false;
var checkminutes = 1, checkthe_interval = checkminutes * 60 * 1000;
var interval

channels = [];//we might need list of text channels
questions = [];
answers = [];
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


setInterval(function() {
    getChannel()
    var i = 0;
    var m = channels.length;
    for(i; i < m; i++) {
        lots_of_messages_getter(channels[i], limit = 500).then(m => {
            var j = 0; 
            var l = m.length;
            for(j; j < l; j++) {
                if(questionStart.includes(m[j].content.split(" ")[0].toLowerCase()) && !questions.includes(m[j].content)) {
                    questions.push(m[j].content.substr(m[j].content.indexOf(" ") + 1));
                }
                else if (answerStart.includes(m[j].content.split(" ")[0].toLowerCase()) && !answers.includes(m[j].content)) {
                    answers.push(m[j].content.substr(m[j].content.indexOf(" ") + 1));
                }
            }
        });
        
    }
    console.log(questions.toString());
    console.log(answers.toString());
}, checkthe_interval);


/*
client.on('message', message => {
    if (oneTimeOnly == false) {
        const guild = client.guilds.cache.get('812773196381683732'); 
        var count = guild.memberCount;
        guild.members.cache.forEach(member => keyValueArr[member] = 0);
        console.log(keyValueArr);
        oneTimeOnly = true;
    }   
    
	if (message.content.startsWith(`[Question]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'));
    } 
    else if (message.content.startsWith(`[Answer]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'));
    }

    //counts upvote reactions for 15 seconds
    message.awaitReactions(upFilter, { time: 15000 })
        .then(collected => collected.map(s => console.log(`Collected ${s.count}`)));
});
*/
//keep at end of file
client.login(token)