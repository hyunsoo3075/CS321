<<<<<<< Updated upstream
const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client();

const upFilter = reaction => reaction.emoji.name === '⬆️';

var keyValueArr = {};
var oneTimeOnly = false;

client.once('ready', () => {
    console.log('Bot is on!');
});

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

//keep at end of file
=======
const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client()

const upFilter = reaction => reaction.emoji.name === '⬆️'

var keyValueArr = {}
var initialized = false
var memCount

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {
    if (!initialized) {
        const list = client.guilds.cache.get('361157955498016788')
        memCount = list.memberCount;
        list.members.cache.forEach(member => keyValueArr[member] = 0)
        //list.members.cache.forEach(member => console.log(member.user.username));
        //console.log(keyValueArr)
        initialized = true;
    }  
    
	if (message.content.startsWith(`[Question]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'))
            .catch(() => console.error('One of the emojis failed to react.'))
    } 
    else if (message.content.startsWith(`[Answer]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'))
            .catch(() => console.error('One of the emojis failed to react.'))
    }

    //counts upvote reactions for 5 seconds
    /*message.awaitReactions(upFilter, { time: 5000 })
        .then(collected => collected.map(s => console.log(`Collected ${s.count}`)));*/
});

client.on("messageReactionAdd", reaction => {
    console.log(reaction.message.author.username)
})

>>>>>>> Stashed changes
client.login(token)