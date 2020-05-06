const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'russianroulette',
	description: 'play russian roulette',
	aliases: ['roulette'],
	usage: '(amount in barrel max of 6)',
	permission: false,
	cooldown: 5,
	async execute(message, args) {
		const data = [];
		const now = Date.now();
		let muteRole = null;
		
		let Roulette = await discordDatabase.getRoulettePoints(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}"}`));
		const serverInfo = await discordDatabase.getServer(message.guild.id);

		let points = 0;
		if(Roulette){
			points = Roulette.points;
		}

		if((args[0]==='points'||args[0]==='point')&&message.mentions.members.size===1){
			const member = message.mentions.members.first();
			Roulette = await discordDatabase.getRoulettePoints(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}"}`));
			let points = 0;
			if(Roulette){
				points = Roulette.points;
			}
			return message.channel.send(`${member.displayName} has ${points} point(s)`);			
		}else if(args[0]==='points'||args[0]==='point'){
			return message.channel.send(`${message.member} you have ${points} point(s)`);
		}
		if(args.length!==0){
			if(!isNaN(args[0])){
				if(parseInt(args[0],10) > 6){
					ammo = 5;
					return message.reply('maximum is 6');
				}
				else if(parseInt(args[0],10) < 1){
					ammo = 1;
					return message.reply('minimum is 1');
				}
				else{
					ammo = parseInt(args[0],10);
				}
			}else{
				ammo=1;
			}
		}else{
			ammo = 1;
		}
		randomize = Math.floor(Math.random() * 6);
		if(randomize<ammo){
			data.push("Bang!");
			muteRole = message.guild.roles.cache.find(x => x.id === serverInfo.muteRoleID);
			if(muteRole.position>message.member.roles.highest.position||message.guild.ownerID!==message.member.id)&&muteRole){
			//if((!message.member.hasPermission('ADMINISTRATOR')&&!botOwner)&&muteRole){
				if(points>=8){
					points = points - 8;
					await discordDatabase.addRoulettePoints(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}","points":"${points}"}`));
					return message.channel.send(`Bang!\n${message.member} by moving faster then the bullet you dodged it just in time!`);
				}
				message.member.roles.add(muteRole).then(async member =>{
					const timestamp = await discordDatabase.getRoulette(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}"}`));
					let timeout = 600000;
					let plays = 1;
					if(timestamp){
						plays = timestamp.playTimes + 1;
						timeout = 600000 * plays;
					}
					muteTime = (now+timeout)-1000;
					await discordDatabase.addRoulette(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}","playTimes":"${plays}","mutedUntil":"${muteTime}","modMuted":"false"}`));
					if(ammo===6 && points>0){
						points = points - 1;
					}else if(points>0){
						for(let i = 0;i<ammo;i++){
							if(points>0){
								points = points - 1;
							}
							else{
								break;
							}
						}
					}
					await discordDatabase.addRoulettePoints(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}","points":"${points}"}`));
					data.push(`${member} You have been muted for ${timeout/60000} Minutes`);
				});
			}
		}else{
			data.push("Click!");
			discordDatabase.removeRoulette(JSON.parse(`{"user_id":"${message.member.id}","guild_id":"${message.guild.id}"}`));
			points = points + ammo;
			if(message.guild.me.roles.highest.position>message.member.roles.highest.position){
				await discordDatabase.addRoulettePoints(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${message.guild.id}","points":"${points}"}`));
			}
		}
		setTimeout(() =>{
				return message.channel.send(data,{split: true});
		},1500)
	},
};
