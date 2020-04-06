module.exports = {
	name: 'boom',
	description: 'causes an explosion',
	permission: false,
	cooldown: 5,
	execute(message, args) {
		message.channel.send(':bomb:').then(sentMessage => {
		randomize = Math.floor((Math.random() * 60) + 1)*1000;
		setTimeout(async coinflip =>{
				await sentMessage.edit(':boom:');
		},randomize);
		});
	},
};
