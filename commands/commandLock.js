const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'commandlock',
	description: 'either locks or unlocks a command to a channel',
	usage: '[command] [(mention channel)/false]',
	adminOnly:true,
	guildOnly: true,
	aliases: ['lock','clock','channellock'],
	cooldown: 5,
	async execute(message, args) {
		const {commands} = message.client;
		const memberMessage = [];
		const command = commands.get(args[0]) || commands.find(c => c.aliases && c.aliases.includes(args[0]));
		if (!command||(command.guild !== guildID&&command.guild)) {
		        return message.reply('that\'s not a valid command!');
		}
		if(command.name==='commandlock'||command.name==='commanddeny'){
			return message.reply('this is the one of the only commands I can not lock');
		}
		if(message.guild.me.roles.highest.position<message.member.roles.highest.position||message.guild.ownerID===message.member.id){
			if(message.mentions.channels.first()){
				const commandLock = await discordDatabase.getCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				if(args.length===1){
					if(commandLock){
						memberMessage.push(`${command.name} is currently locked to <#${commandLock.channel.join(', ')}>`);
					}else{
						memberMessage.push(`${command.name} is currently not locked to any channels`);
					}
				}else if(args[1]==='false'){
					denyChannels = [];
					try{
						commandDenyChannels = CommandLock.channel.split(',')
					}catch{
						return message.reply('That command is not denied from any channel')
					}
					if(commandDenyChannels.includes(message.mentions.channels.first().id)){
						commandDenyChannels.forEach(denyChannel =>{
							if(denyChannel !== message.mentions.channels.first().id){
								denyChannels.push(denyChannel);
							}
						});
					}
					await discordDatabase.removeCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
					await discordDatabase.addCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${denyChannels.join(',')}"}`));
					memberMessage.push(`${command.name} is no longer locked to a channel`);
				}
				else{
					commandDenyChannels=[]
					try{
						commandDenyChannels = commandLock.channel.split(',');
					}catch{}
					commandDenyChannels.push(message.mentions.channels.first().id);
					await discordDatabase.addCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${CommendDenyChannels.join(',')}"}`));
					memberMessage.push(`${command.name} is now locked to ${message.mentions.channels.first()}`);
				}
			}else if(message.mentions.roles.first()){
				const commandLock = await discordDatabase.getCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				if(args.length===1){
					if(commandLock){
						memberMessage.push(`${command.name} is currently locked to <@&${commandLock.channel.join(', ')}>`);
					}else{
						memberMessage.push(`${command.name} is currently not locked out of any roles`);
					}
				}else if(args[1]==='false'){
					denyChannels = [];
					try{
						commandDenyChannels = CommandLock.channel.split(',')
					}catch{
						return message.reply('That command is not denied from any channel')
					}
					if(commandDenyChannels.includes(message.mentions.roles.first().id)){
						commandDenyChannels.forEach(denyChannel =>{
							if(denyChannel !== message.mentions.roles.first().id){
								denyChannels.push(denyChannel);
							}
						});
					}
					await discordDatabase.removeCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
					await discordDatabase.addCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${denyChannels.join(',')}"}`));
					memberMessage.push(`${command.name} is no longer locked to ${message.mentions.roles.first().name}`);
				}
				else{
					commandDenyChannels=[]
					try{
						commandDenyChannels = commandLock.channel.split(',');
					}catch{}
					commandDenyChannels.push(message.mentions.roles.first().id);
					await discordDatabase.addCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${CommendDenyChannels.join(',')}"}`));
					memberMessage.push(`${command.name} is now locked to ${message.mentions.roles.first().name}`);
				}
			}
		}else{
			try{
				message.delete({timeout:4000});
			}catch{}
			return message.reply('I am unable to process your request').then(sentMessage => sentMessage.delete({timeout:10000})).catch();
		}
		setTimeout(() =>{
				message.channel.send(`${message.author}, ${memberMessage.join(' ')}`).then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
		},2000);
	},
};
