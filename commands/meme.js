const {MessageAttachment} = require('discord.js');
const recursive = require("recursive-readdir");
const Attachment = MessageAttachment;
module.exports = {
	name: 'memes',
	description: 'posts memes',
	aliases: ['meme'],
	usage: '(meme type)',
	adminOnly: false,
	permission: false,
	cooldown: 60,
	execute(message, args) {
		if(!args.length){
			dir = `../CommandFiles/${message.guild.id}/meme`;
		}
		else if (args.length > 1){
			message.reply('too many arguments has been supplied');
			return;
		}
		else{
			dir = `../CommandFiles/memes/${args[0].toLowerCase()}`;
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
			attachment = new Attachment(`${files[randomMeme]}`);
			message.channel.send(attachment);
			}
		});
		//message.channel.send('Sorry no meme right now, Currently being worked on');
	},
};
