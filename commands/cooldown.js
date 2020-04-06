const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'cooldown',
	description: 'reset command cooldown for a user',
	usage: '[user] [command]',
	adminOnly:true,
	guildOnly: true,
	aliases: ['cooldownremove','cdr','cooldownreset'],
	cooldown: 5,
	async execute(message, args) {
		const {commands} = message.client;

		if(message.mentions.members.size!=1){
			return message.reply('Please mention only one user. Thank You!').then(sentMessage => sentMessage.delete({timeout:10000})).catch()
		}
		if(args.length!=2){
			return message.reply('only one user and one command per call').then(sentMessage => sentMessage.delete({timeout:10000})).catch()
		}
		if(message.member.hasPermission('MANAGE_ROLES','MENTION_EVERYONE','MANAGE_MESSAGES')){
			let member = message.mentions.members.first();
			let name = args[1].toLowerCase();
			let command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
			
			if (!command) {
				return message.reply('that\'s not a valid command!');
			}else{
				await discordDatabase.removeTimeout(JSON.parse(`{"user_id":"${member.id}","command":"${command.name}","guild_id":"${message.guild.id}"}`));
			}
			try{
				message.delete({timeout:2000});
			}catch{}
			return message.channel.send(`${member}'s command cooldown for "${command.name}" has been reset`).then(sentMessage => sentMessage.delete({timeout:2000})).catch();
		}
	},
};
