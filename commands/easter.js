module.exports = {
	name: 'easter',
	description: 'happy easter everyone',
	permission: false,
	cooldown: 3600,
	execute(message, args) {
		message.channel.send('@everyone have a Happy Easter!');
	},
};
