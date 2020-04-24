const fs = require('fs');
const Discord = require('discord.js');
let textOnlyBlock = new Discord.Collection();
module.exports = {
	name: 'picturesrequired',
	description: 'prevents users from posting messages in a channel that requires pictures',
	args: true,
	usage: '(channel) [true/false]',
	aliases: ['nojusttext','njt'],
	guildOnly: true,
	permission: ['MANAGE_MESSAGES','VIEW_CHANNEL'],
	cooldown: 5,
	execute(message, args) {
		const memberMessage = [];
		try{
			textOnlyBlock = new Discord.Collection(JSON.parse(fs.readFileSync('servers/noTextOnly.txt','utf8')));
		}catch{
			textOnlyBlock = new Discord.Collection();
		}
		if(message.member.hasPermission('MANAGE_MESSAGES')){
			textBlock = []
			if(args[0].toLowerCase()==='status'){
					let srl = 'no channel';
					textBlock = [];
					if (textOnlyBlock.has(message.guild.id)) {
						textOnlyBlockChannels = textOnlyBlock.get(message.guild.id);
						textOnlyBlockChannels.forEach(textBlockChannels =>{
							textBlock.push(message.guild.channels.resolve(textBlockChannels).name);
						});
					}
					try{
						message.delete({timeout:10000});
					}catch{}
					textBlock.sort();
					if(textBlock.length){
						return message.reply(`${textBlock.join(', ')} is being managed to prevent text only postings`).then(sentMessage => sentMessage.delete({timeout:10000})).catch();
					}else{
						return message.reply(`${srl} is being managed to prevent text only postings`).then(sentMessage => sentMessage.delete({timeout:10000})).catch();
					}				
			}else if(message.mentions.channels.size!=1){
				return message.reply(`Please mention a single channel similar to ${message.channel}`);
			}
			if(textOnlyBlock.has(message.guild.id)){
				let channel = null;
				textOnlyBlockChannels = textOnlyBlock.get(message.guild.id);
				textOnlyBlockChannels.forEach(textBlockChannels =>{
					if(message.mentions.channels.first().id === message.guild.channels.resolve(textBlockChannels).id){
						channel = message.guild.channels.resolve(textBlockChannels);
					}else{
						textBlock.push(textBlockChannels);
					}
				});
				if(args[1]==='false'&&channel){
					memberMessage.push(`${channel.name} is no longer being managed`);
					textOnlyBlock.set(message.guild.id,textBlock)
				}
			}
			if(args[1]==='false'&&textOnlyBlock.get(message.guild.id).length===0){
				try{
					textOnlyBlock.delete(message.guild.id);
				}catch{}
			}
			else if(args[1]==='true'){
				if(textOnlyBlock.has(message.guild.id)){
					textBlock = textOnlyBlock.get(message.guild.id);
				}
				textBlock.push(message.mentions.channels.first().id);
				textOnlyBlock.set(message.guild.id,textBlock)
				memberMessage.push(`${message.mentions.channels.first().name} is now being managed to prevent text only postings`);
			}
		}else{
			try{
				message.delete({timeout:20000});
			}catch{}
			return message.reply('I am unable to process your request').then(sentMessage => sentMessage.delete({timeout:20000})).catch();
		}
		setTimeout(() =>{
				fs.writeFileSync('servers/noTextOnly.txt',JSON.stringify([...textOnlyBlock]));
				try{
					message.delete({timeout:10000});
				}catch{}
				message.reply(memberMessage.join(' ')).then(sentMessage => {
					sentMessage.delete({timeout:10000});
				}).catch();
			},
			2000)
	}
}
