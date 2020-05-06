const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'modrussianroulette',
	description: 'play russian roulette for another user',
	aliases: ['modroulette'],
	usage: '[member mention]',
	permission: 'MANAGE_ROLES',
	cooldown: 5,
	guildOnly: true,
	adminOnly:true,
	async execute(message, args) {
		const data = [];
		const now = Date.now();
		const memberCooldown = 3600000;
		
		const server = await discordDatabase.getServer(message.guild.id);
		
		if(!server){
			return message.reply('Please tell me what role is your muted role').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}else if(!server.muteRoleID){
			return message.reply('Please tell me what role is your muted role').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		
		let rouletteMember = message.mentions.members.first();
		
		let botOwner = false;
		
		if(!message.member.hasPermission('MANAGE_ROLES','MENTION_EVERYONE')){
			return;
		}
		
		const modRoulette = await discordDatabase.getModRoulette(JSON.parse(`{"member_id":"${rouletteMember.id}","guild_id":"${message.guild.id}","user_id":"${message.author.id}"}`));

		if(modRoulette){
			if((modRoulette.cooldown+memberCooldown)>now){
				const timeLeft = ((modRoulette.cooldown+memberCooldown) - now) / 1000;
				return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before playing roulette for this member again.`);
			}
		}	
		const ammo=2;
		
		await discordDatabase.addModRoulette(JSON.parse(`{"member_id":"${rouletteMember.id}","guild_id":"${message.guild.id}","user_id":"${message.author.id}","cooldown":"${now}"}`));
		
		randomize = Math.floor(Math.random() * 6);
		
		const muteRole = message.guild.roles.cache.find(x => x.id === server.muteRoleID);
		
		if(muteRole.position<rouletteMember.roles.highest.position||message.guild.ownerID===message.member.id){
			return message.reply(`That user is immune to bullets! NYA NYA!`);
		}
		
		if(randomize<ammo){
			data.push("Bang!");
			if((muteRole.position>rouletteMember.roles.highest.position)&&muteRole){
				rouletteMember.roles.add(muteRole).then(async member =>{
					const timestamp = await discordDatabase.getRoulette(JSON.parse(`{"user_id":"${rouletteMember.id}","guild_id":"${message.guild.id}"}`));
					let timeout = 600000;
					let plays = 1;
					if(timestamp){
						plays = timestamp.playTimes + 1;
						timeout = 600000 * plays;
						plays = timestamp.playTimes
					}
					muteTime = (now+timeout)-1000;
					await discordDatabase.addRoulette(JSON.parse(`{"user_id":"${rouletteMember.id}","guild_id":"${message.guild.id}","playTimes":"${plays}","mutedUntil":"${muteTime}","modMuted":"true"}`));
					data.push(`${rouletteMember} has been muted for ${timeout/60000} Minutes`);
				});
			}
		}else{
			data.push("Click!");
		}
		setTimeout(() =>{
				return message.channel.send(data).then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
		},1250)
	},
};
