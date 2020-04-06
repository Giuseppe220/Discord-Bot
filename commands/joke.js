const fs = require('fs');
const Discord = require('discord.js');
const jokeUsers = new Discord.Collection();

module.exports = {
	name: 'joke',
	args: true,
	description: 'joke',
	aliases: ['jokes','joker'],
	permission: false,
	cooldown: 2,
	execute(message, args) {
		jokeDir = `./joke`;
		jokeAnswerDir = `./jokeAnswers`
		if(args[0] === 'new'){
			jokes = fs.readdirSync(jokeDir);
			randomJoke = Math.floor((Math.random() * jokes.length));
			jokeFile = `${jokeDir}/${jokes[randomJoke]}`;
			//console.log(riddleFile);
			joke = fs.readFileSync(jokeFile,'utf8');
			if(!joke.length){
				return;
			}
			else{
				message.channel.send(joke);
			}
			jokeUsers.set(message.author.id,jokes[randomJoke]);
		}
		else if(!args.length&&!jokeUsers.has(message.author.id)){
			message.reply('want a new joke? use "!joke new"');
			}
		else{
			jokeUsersAnswers = jokeUsers.get(message.author.id);
			if(!jokeUsers.has(message.author.id)){message.reply('want a new joke? use "!joke new"'); return;}
			jokeAnswerFile = `${jokeAnswerDir}/${jokeUsersAnswers}`;
			//console.log(riddleUsers.get(message.author.id));
			//console.log(riddleUsers.entries());
			jokeAnswerOrginal = fs.readFileSync(jokeAnswerFile,'utf8');
			jokeAnswer = jokeAnswerOrginal;
			//console.log(riddleAnswer);
			if(args.join(' ').toLowerCase() === jokeAnswer.toLowerCase()){
				message.channel.send(`Correct, the answer was ${jokeAnswerOrginal}`);
				jokeUsers.delete(message.author.id);
			}
			else if(jokeAnswer.toLowerCase().startsWith("a")){
				jokeAnswer = jokeAnswer.split(/ +/);
				jokeAnswer.shift();
				if(args.join(' ').toLowerCase() === jokeAnswer.join(' ').toLowerCase()){
				message.channel.send(`Correct, the answer was ${jokeAnswerOrginal}!`);
				jokeUsers.delete(message.author.id);
			}
			}
			else{
				message.channel.send(`Try Again`);
			}
		}
	},
};
