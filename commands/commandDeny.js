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
		if(message.guild.me.roles.highest.position<message.member.roles.highest.position){
			if(args.length===1){
				const commandLock = await discordDatabase.getCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				if(commandLock){
					memberMessage.push(`${command.name} is currently locked out of <#${commandLock.channel}>`);
				}else{
					memberMessage.push(`${command.name} is currently not locked out of any channels`);
				}
			}else if(args[1]==='false'){
				await discordDatabase.removeCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}"}`));
				memberMessage.push(`${command.name} is no longer locked out of a channel`);
			}
			else{
				await discordDatabase.addCommandDeny(JSON.parse(`{"command":"${command.name}","guild_id":"${message.guild.id}","channel":"${message.mentions.channels.first().id}"}`));
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
