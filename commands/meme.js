const fs = require('fs');
const discord = require('discord.js');
const recursive = require("recursive-readdir");
const https = require("https");
module.exports = {
	name: 'memes',
	description: 'posts memes',
	aliases: ['meme'],
	usage: '(meme type)',
	adminOnly: false,
	permission: false,
	cooldown: 40,
	execute(message, args) {
		if(!args.length){
			if(fs.existsSync(`./CommandFiles/${message.guild.id}`)){
				dir = `./CommandFiles/${message.guild.id}/memes`;
			}else{
				dir = `./CommandFiles/memes`;
			}
		}
		else if (args.length > 1){
			message.reply('too many arguments has been supplied');
			return;
		}
		else{
			dir = `./CommandFiles/memes/${args[0].toLowerCase()}`;
		}
		recursive(dir,(error,files) =>{
			if(error){
				console.log(error);
				message.reply('that meme type does not seem to be in my database');
				return;}
			if(!files.length){
				message.channel.send('Sorry no memes right now');
				//message.channel.send('upload some to the memes channel to populate my memes');
			}
			else{
			randomMeme = Math.floor((Math.random() * files.length));
			//attachment = new Attachment(`${dir}/${files[randomMeme]}`);
			attachment = new discord.MessageAttachment(`${files[randomMeme]}`);
			message.channel.send(attachment);
			}
		});
		//message.channel.send('Sorry no meme right now, Currently being worked on');
	},
};
