const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'prefix',
	description: 'mentions the current prefix and allows change with high enough permission',
	usage: 'true/false',
	cooldown: 5,
	async execute(message, args) {
		if(args.length!==0){
			if(message.guild.me.roles.highest.position<message.member.roles.highest.position) {
				if(args[0]!=="c!"){
					let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","prefix":"${args[0]}"}`));
					message.channel.send(`"${newPrefix.prefix}" has been set as my prefix`);
				}
				else{
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","prefix":null}`));
					message.channel.send(`"${prefix}" has been set as my prefix`);
				}
			}
			else{
				return message.reply("You do not have the necessary permissions to change the server's prefix");
			}
		}else{
			let newPrefix = "c!";
			let serverPrefix = await discordDatabase.getServer(message.guild.id);
			if(serverPrefix.prefix){
				newPrefix = serverPrefix.prefix;
			}
				
			message.channel.send(`My prefix is "${newPrefix}"`);
		}
		
	},
};
