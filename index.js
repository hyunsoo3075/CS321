const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client()

const upFilter = reaction => reaction.emoji.name === '⬆️'

//var keyValueArr = {}
var questions = []
var users = []
var initialized = false
var ID = 1
var memCount

function question(ID, answers, topAnswer) {
    this.ID = ID
    this.answers = answers
    this.topAnswer = topAnswer
}

function user(name, points) {
    this.name = name
    this.points = points
}

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {
    if (message.author.bot) return  //disregard all messages that come from bots (including this one)
    if (!initialized) {
        const list = client.guilds.cache.get('361157955498016788')
        memCount = list.memberCount;
        list.members.cache.forEach(member => users.push(new user(member.user.username), 0))
        //list.members.cache.forEach(member => keyValueArr[member] = 0)
        //list.members.cache.forEach(member => console.log(member.user.username));
        //console.log(users)
        initialized = true;
    }  
    
	if (message.content.startsWith(`[Question]`)) {
        message.react('⬆️')
            .then(() => message.react('⬇️'))
            .catch(() => console.error('One of the emojis failed to react.'))
        var newQuestion = new question((Math.random().toString(36)+'00000000000000000').slice(2, 8), [], 0)
        questions.push(newQuestion)
        message.channel.send("Question ID: " + newQuestion.ID + ". Answer by starting your message with [Answer] " + newQuestion.ID)
        //console.log((Math.random().toString(36)+'00000000000000000').slice(2, 8))
        //console.log(questions[0].ID)
    }

    else if (message.content.startsWith(`[Answer]`)) {
        var code = message.content.slice(9, 15)
        //console.log(code)
        var msg = message.content.slice(15, message.length)
        console.log(msg)
        for (var i = 0; i < questions.length; i++) {
            if (questions[i].ID == code) {
                questions[i].answers.push(msg)
                message.react('⬆️')
                    .then(() => message.react('⬇️'))
                    .catch(() => console.error('One of the emojis failed to react.'))
                return
            }
        }
        message.channel.send("incorrect question code. Example usage: '[Answer] 123456 you missed a semicolon on line 8'")
    }

    //counts upvote reactions for 5 seconds
    /*message.awaitReactions(upFilter, { time: 5000 })
        .then(collected => collected.map(s => console.log(`Collected ${s.count}`)));*/
});

client.on("messageReactionAdd", reaction => {
    console.log(reaction.message.author.username)
})

client.on("messageReactionRemove", reaction => {
    console.log("reaction removed!")
})

client.login(token)