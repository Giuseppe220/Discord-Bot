const fs = require('fs');
const Discord = require('discord.js');
const riddleUsers = new Discord.Collection();

module.exports = {
	name: 'riddle',
	args: true,
	description: 'riddles',
	aliases: ['rdl'],
	permission: false,
	cooldown: 2,
	execute(message, args) {
		riddleDir = `./riddle`;
		riddleAnswerDir = `./riddleAnswers`
		if(args[0] === 'new'){
			riddles = fs.readdirSync(riddleDir);
			randomriddle = Math.floor((Math.random() * riddles.length));
			riddleFile = `${riddleDir}/${riddles[randomriddle]}`;
			//console.log(riddleFile);
			riddle = fs.readFileSync(riddleFile,'utf8');
			if(!riddle.length){
				return;
			}
			else{
				message.channel.send(riddle);
			}
			riddleUsers.set(message.author.id,riddles[randomriddle]);
		}
		else if(!args.length&&!riddleUsers.has(message.author.id)){
			message.reply('want a riddle? use "!riddle new"');
			}
		else{
			riddleUsersAnswers = riddleUsers.get(message.author.id);
			if(!riddleUsers.has(message.author.id)){message.reply('want a riddle? use "!riddle new"'); return;}
			riddleAnswerFile = `${riddleAnswerDir}/${riddleUsersAnswers}`;
			//console.log(riddleUsers.get(message.author.id));
			//console.log(riddleUsers.entries());
			riddleAnswerOrginal = fs.readFileSync(riddleAnswerFile,'utf8');
			riddleAnswer = riddleAnswerOrginal;
			//console.log(riddleAnswer);
			if(args.join(' ').toLowerCase() === riddleAnswer.toLowerCase()){
				message.channel.send(`Correct, the answer was ${riddleAnswerOrginal}`);
				riddleUsers.delete(message.author.id);
			}
			else if(riddleAnswer.toLowerCase().startsWith("a")){
				riddleAnswer = riddleAnswer.split(/ +/);
				riddleAnswer.shift();
				if(args.join(' ').toLowerCase() === riddleAnswer.join(' ').toLowerCase()){
				message.channel.send(`Correct, the answer was ${riddleAnswerOrginal}`);
				riddleUsers.delete(message.author.id);
			}
			}
			else{
				message.channel.send(`Try Again`);
			}
		}
	},
};
