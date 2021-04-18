const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();

const upFilter = reaction => reaction.emoji.name === '⬆️';
const downFilter = reaction => reaction.emoji.name === '⬇️';

var keyValueArr = {};
var oneTimeOnly = false;

client.once('ready', () => {
    console.log('Bot is active!');
});

//print info to console for debugging
for (key in keyValueArr) {
    console.log(key, keyValueArr[key]);
}
for (val in keyValueArr) {
    console.log(val, keyValueArr[val]);
}

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
    else if (message.content.startsWith(`[ans]`)) {
        
    }
    else if (message.content.startsWith(`[answers]`)) {

    }
    else if (message.content.startsWith(`[score]`)) {
        
    }
    else {

    }

    //counts upvote and downvote reactions for 15 seconds
    message.awaitReactions(upFilter, { time: 15000 })
        .then(collected => collected.map(s => console.log(`Collected ${s.count}`)));
    message.awaitReactions(downFilter, { time: 15000 })
        .then(collected => collected.map(s => console.log(`Collected ${s.count}`)));
});

//keep at end of file
client.login(token)