const discordDatabase = require(`${process.cwd()}/dbhandler`);

module.exports = {
	name: 'balance',
	description: 'states user\'s balance',
	usage: '(member)',
	guildOnly: true,
	cooldown: 5,
	async execute(message, args) {
		Roulette = await discordDatabase.getGuildMemberCurrentAmount(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}"}`));
		let points = 0;
		if(Roulette){
			points = Roulette.points;
		}
		if((args[0]==='points'||args[0]==='point')&&message.mentions.members.size===1){
			const member = message.mentions.members.first();
			Roulette = await discordDatabase.getGuildMemberCurrentAmount(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}"}`));
			let points = 0;
			if(Roulette){
				points = Roulette.points;
			}
			return message.channel.send(`${member.displayName} has ${points} point(s)`);			
		}else if(args[0]==='points'||args[0]==='point'){
			return message.channel.send(`${message.member} you have ${points} point(s)`);
		}
	}
}
