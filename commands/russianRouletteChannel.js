const fs = require('fs');
const Discord = require('discord.js');
let rouletteChannel = new Discord.Collection();
module.exports = {
	name: 'rouletteUnmutedChannel',
	description: 'The channel I will inform the user, that I muted due to my roulette game, that they are now no longer muted',
	args: true,
	usage: '(channel)/false',
	aliases: ['roulettechannel','ruc'],
	guildOnly: true,
	permission: ['SEND_MESSAGES','VIEW_CHANNEL'],
	cooldown: 5,
	execute(message, args) {
		const memberMessage = [];
		try{
			rouletteChannel = new Discord.Collection(JSON.parse(fs.readFileSync('servers/rouletteChannel.txt','utf8')));
		}catch{
			rouletteChannel = new Discord.Collection();
		}
		if(message.member.hasPermission('MANAGE_MESSAGES')){
			if(args[0].toLowerCase()==='status'){
					let srl = 'no channel';
					if (rouletteChannel.has(message.guild.id)) {
						srl = message.guild.channels.resolve(rouletteChannel.get(message.guild.id)).name;
					}
					try{
						message.delete({timeout:10000});
					}catch{}
					return message.reply(`${srl} is the server's roulette unmute mention channel`).then(sentMessage => sentMessage.delete({timeout:10000})).catch();
			}else if(message.mentions.channels.size!=1){
				return message.reply(`Please mention a single channel similar to ${message.channel}`);
			}
			if(rouletteChannel.has(message.guild.id)){
				if(args[0]==='false'){
					memberMessage.push(`${rouletteChannel.get(message.guild.id).name} is no longer the server's roulette unmute mention channel`);
				}else{
					memberMessage.push(`${rouletteChannel.get(message.guild.id).name} is no longer the server's roulette unmute mention channel and`);
				}
			}
			if(args[1]==='false'){
				try{
					rouletteChannel.delete(message.guild.id);
				}catch{}
			}
			else{
				rouletteChannel.set(message.guild.id,message.mentions.channels.first().id)
				memberMessage.push(`${message.mentions.channels.first().name} is now the server's roulette unmute mention channel`);
			}
		}else{
			try{
				message.delete({timeout:20000});
			}catch{}
			return message.reply('I am unable to process your request').then(sentMessage => sentMessage.delete({timeout:20000})).catch();
		}
		setTimeout(() =>{
				fs.writeFileSync('servers/rouletteChannel.txt',JSON.stringify([...rouletteChannel]));
				try{
					message.delete({timeout:10000});
				}catch{}
				message.reply(memberMessage.join(' ')).then(sentMessage => sentMessage.delete({timeout:10000})).catch();
			},
			2000)
	}
}
