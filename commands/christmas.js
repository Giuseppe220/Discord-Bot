module.exports = {
	name: 'christmas',
	aliases:['xmas'],
	description: 'merry christmas everyone',
	permission: false,
	guild:'572964285488300052',
	cooldown: 3600,
	execute(message, args) {
		message.channel.send('@everyone Merry Christmas to those that celebrate it!');
	},
};
