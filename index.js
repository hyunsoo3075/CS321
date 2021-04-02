const Discord = require('Discord.js')
const {prefix, token} = require('./config.json')
const client = new Discord.Client()

var questions = []
var users = []
var initialized = false

function question(ID, answers, content, link) {
    this.ID = ID
    this.answers = answers
    this.content = content
    this.link = link
}

function user(name) {
    this.name = name
    this.points = 0
}

client.once('ready', () => {
    console.log('Ready!')
})

client.on('message', message => {
    if (message.author.bot) return  //disregard all messages that come from bots (including this one)

    /* obtains a list of all users in the discord server.*/
    if (!initialized) {
        const list = client.guilds.cache.get('361157955498016788')
        list.members.cache.forEach(member => users.push(new user(member.user.username)))
        initialized = true;
    }  
    
    /* executes when a user wishes to ask a question.
     * usage: "[Question] <message>".
     * automatically generates a unique 6 digit ID 0-9a-z.
     * creates a new question and adds it to the array of all questions.*/
	if (message.content.startsWith(`[Question]`)) {
        var msg = message.content.slice(11, message.length)
        message.react('⬆️')
            .then(() => message.react('⬇️'))
            .catch(() => console.error('One of the emojis failed to react.'))
        var newQuestion = new question((Math.random().toString(36)+'00000000000000000').slice(2, 8), [], msg, message.url)
        questions.push(newQuestion)
        message.channel.send("Question ID: " + newQuestion.ID + ". Answer by starting your message with [Answer] " + newQuestion.ID)
        message.channel.send(questions[0].link)
    }

    /* executes when a user wishes to answer a question.
     * usage: "[Answer] <question ID> <message>".
     * slices 6 characters from the original message to obtain the code.
     * slices the rest of the original message to obtain the answer.
     * gets pushed onto an array of other answers that answer the same question.*/
    else if (message.content.startsWith(`[Answer]`)) {
        var code = message.content.slice(9, 15)
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

    /* executes when a user wishes to lookup how many points they or another user has.
     * searches users array for username and prints number of points associated with
     * that username. 
     * Example usage: !points DrMario64
     * it IS case sensitive and does not require the hashtag and numbers.*/
    else if (message.content.startsWith('!points')) {
        var msg = message.content.slice(8, message.length)
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == msg) {
                message.channel.send(users[i].name + " has " + users[i].points + " point(s)")
                return
            }
        }
        message.channel.send("user not found, please use the users discord username without the hashtag or numbers and use correct cases")
    }

    else if (message.content.startsWith('!help')) {
        message.channel.send("To ask a question type: '[Question] <content>'.  **Example**: [Question] how do I print something in Java?.\nTo answer a question type: '[Answer] <question ID> <content>'.  **Example**: [Answer] 123456 System.out.println(\"Hello World!\");\nTo access point values type: '!points <username>.  **Example**: !points DrMario64.")
    }
});

/* executes when a reaction is added (even by the bot).
 * if an upvote was added, increment users' points
 * if a downvote was added, decrement the user's points. */
client.on('messageReactionAdd', reaction => {
    if(reaction.emoji.name == '⬆️') {
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == reaction.message.author.username) users[i].points++
        }
    }
    if(reaction.emoji.name == '⬇️') {
        for (var i = 0; i < users.length; i++) {
            if (users[i].name == reaction.message.author.username) users[i].points--
        }
    }
})

/* executes when a reaction is removed by a user.
 * if an upvote was removed, decrement users' points
 * if a downvote was removed, increment the user's points. */
client.on('messageReactionRemove', reaction => {
    if(reaction.emoji.name == '⬆️') {
        for (var i = 0; i < users.length; i++) {    //iterate through list of all users to find the user who sent the original message
            if (users[i].name == reaction.message.author.username) users[i].points--
        }
    }
    if(reaction.emoji.name == '⬇️') {
        for (var i = 0; i < users.length; i++) {    //iterate through the list of all users to find the user who sent the original message
            if (users[i].name == reaction.message.author.username) users[i].points++
        }
    }
})


/*                                                            OBSERVATIONS
 * ---------------------------------------------------------------------------------------------------------------------------------------
 * Someone could repeatedly post questions and answer them for infinite points.
 * */

 /*                                                               TODO
  * --------------------------------------------------------------------------------------------------------------------------------------
  * Implement a search function that allows you to search by keyword.
  * Save links to questions and answers so the bot can post them when they are being searched for/requested.*/
client.login(token)