module.exports = {
	name: 'pick',
	description: 'picks a random number from 1 to the number given',
	aliases: ['randompick'],
	usage: '(number of items to pick from)',
	permission: false,
	cooldown: 10,
	execute(message, args) {
		if(parseInt(args[0],10)<1){
			return message.channel.send(`you are asking me to pick a number that I can not pick from`);
		}
		if(parseInt(args[0],10)<2){
			return message.channel.send(`you only have one option to pick from so I pick ${args[0]}`);
		}
		number = parseInt(args[0],10);
		msg = 'picking a number';
		message.channel.send(msg).then(sentMessage => {
		randomize = Math.floor((Math.random() * number) + 1);
		setTimeout(coinflip =>{
			sentMessage.edit(`I pick ${randomize}`);
		},
		2000)})
	},
};
