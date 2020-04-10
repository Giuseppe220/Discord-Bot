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
		if(message.guild.me.roles.highest.position<message.member.roles.highest.position){
			if(args.length===1){
				const commandLock = await discordDatabase.getCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				if(commandLock){
					memberMessage.push(`${command.name} is currently locked to <#${commandLock.channel}>`);
				}else{
					memberMessage.push(`${command.name} is currently not locked to any channel`);
				}
			}else if(args[1]==='false'){
				await discordDatabase.removeCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				memberMessage.push(`${command.name} is no longer locked to a channel`);
			}
			else{
				await discordDatabase.addCommandLock(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${message.mentions.channels.first().id}"}`));
				memberMessage.push(`${command.name} is now locked to ${message.mentions.channels.first()}`);
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
