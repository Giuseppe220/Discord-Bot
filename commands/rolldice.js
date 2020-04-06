function roll(numberOfDice,number,dieSides){
    return new Promise(resolve=>{
        do{
			randomize = Math.floor((Math.random() * (numberOfDice * dieSides)) + 1);
		}while(randomize < numberOfDice||randomize===number);
        resolve(randomize);
    });
}

module.exports = {
	name: 'roll',
	description: 'roll a die or dice',
	aliases: ['rd','dice','rolldie','die','rolldice','diceroll'],
	usage: '(number of sides) (number of dice)',
	permission: false,
	cooldown: 5,
	execute(message, args) {
		if(args.length === 2){
			warning = ''
			if(parseInt(args[0],10) < 0){
				dieSides = 6
				warning = warning + 'number of sides has been reset to default'
			}
			else{
				dieSides = parseInt(args[0],10);
			}
			if(parseInt(args[1],10) < 1){
				numberOfDice = 1
				if(parseInt(args[0],10) < 1){
					warning = warning + '\nnumber of dice have been reset to default'
				}
				else{
					warning = warning + 'number of dice has been reset to default'
				}
			}
			else{
				numberOfDice = parseInt(args[1],10);
			}
			if(warning !== ''){
				message.reply(warning).then(sentWarning=>sentWarning.delete({timeout:10000}));
			}
		}
		else if(args.length === 1){
			warning = ''
			if(parseInt(args[0],10) < 1){
				dieSides = 6
				warning = warning + 'number of sides has been reset to default'
			}
			else{
				dieSides = parseInt(args[0],10);
			}
			numberOfDice = 1
			if(warning !== ''){
				message.reply(warning).then(sentWarning=>sentWarning.delete({timeout:30000}));
			}
		}
		else{
			numberOfDice = 1
			dieSides = 6
		}
		if(numberOfDice > 1){
			msg = `rolling ${numberOfDice} d${dieSides}s...`
		}
		else{
			msg = `rolling a d${dieSides}...`
		}
		timeout = Math.floor((Math.random() * 7) + 4)*1000;
		message.channel.send(msg).then(async sentMessage => {
			let randomize = 0;
			do{
				randomize = Math.floor((Math.random() * (numberOfDice * dieSides)) + 1);
			}while(randomize < numberOfDice);
			let number = await roll(numberOfDice,randomize,dieSides);
			interval = setInterval(async () =>{
				sentMessage.edit(msg+'\n\n'+number);
				number = await roll(numberOfDice,number,dieSides);
			},750);
			setTimeout(() =>{
				clearInterval(interval);
				sentMessage.edit(`${message.member} you rolled a ${randomize}`).then(()=>{
					message.channel.send(`${message.member} you rolled a ${randomize}`).then(sentMessage=>{
						sentMessage.delete({timeout:250});
					});
				});
			},timeout);
		});
	},
};
