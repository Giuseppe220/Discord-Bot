module.exports = {
	name: 'cointoss',
	description: 'flip a coin',
	aliases: ['cf','coinflip'],
	permission: false,
	cooldown: 5,
	execute(message, args) {
		message.channel.send('flipping coin now...').then(sentMessage => {
		randomize = Math.floor((Math.random() * 51) + 1);
		setTimeout(async coinflip =>{
			if(randomize===1){
				await sentMessage.edit('Your Witcher appreciates your coin');
				return;
			}else if(randomize<26){
				await sentMessage.edit('the coin landed on tails');
				return;
			}else{
				await sentMessage.edit('the coin landed on heads');
				return;
			}
		},1500)})
	},
};
