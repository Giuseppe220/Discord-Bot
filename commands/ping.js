module.exports = {
	name: 'ping',
	description: 'Ping!',
	permission: false,
	cooldown: 10,
	execute(message, args) {
		if(args.length === 1&& args[0].toLowerCase()==="mention"){
			setTimeout(coinflip =>{
				message.reply(`was mentioned to test their notification settings`);
			},
			60000)
		}
		else{
			message.channel.send('Pong');
		}
	},
};