module.exports = {
	name: 'slowmode',
	description: 'change slowmode rate',
	usage: '[slowmode rate in seconds]',
	adminOnly:true,
	cooldown: 5,
	guildOnly: true,
	async execute(message, args) {
		if(message.member.hasPermission('MANAGE_ROLES','MENTION_EVERYONE','MANAGE_MESSAGES')){
			message.channel.setRateLimitPerUser(parseInt(args[0],10));
			message.delete({timeout:2000});
		}
	},
};
