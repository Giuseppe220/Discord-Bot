const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'commanddeny',
	description: 'either locks or unlocks a command from a channel',
	usage: '[command] [(mention channel)/false]',
	adminOnly:true,
	guildOnly: true,
	aliases: ['deny','cdeny','channeldeny'],
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
			const commandLock = await discordDatabase.getCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
			if(args.length===1){
			if(commandLock){
					memberMessage.push(`${command.name} is currently locked out of <#${commandLock.channel}>`);
				}else{
					memberMessage.push(`${command.name} is currently not locked out of any channels`);
				}
			}else if(args[1]==='false'){
				denyChannels = [];
				try{
					commandDenyChannels = commandLock.channel.split(',')
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
				await discordDatabase.removeCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				await discordDatabase.addCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${denyChannels.join(',')}"}`));
				memberMessage.push(`${command.name} is no longer locked out of a channel`);
			}
			else{
				commandDenyChannels=[]
				try{
					commandDenyChannels = commandLock.channel.split(',');
				}catch{}
				commandDenyChannels.push(message.mentions.channels.first().id);
				await discordDatabase.addCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${CommandDenyChannels.join(',')}"}`));
				memberMessage.push(`${command.name} is now locked out of ${message.mentions.channels.first()}`);
			}
		}else{
			try{
				message.delete({timeout:4000});
			}catch{}
			return message.reply('I am unable to process your request').then(sentMessage => sentMessage.delete({timeout:10000})).catch();
		}
		setTimeout(() =>{
				message.reply(memberMessage.join(' ')).then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
		},2000);
	},
};
