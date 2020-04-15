const discordDatabase = require(`${process.cwd()}/dbhandler`);

module.exports = {
	name: 'massnick',
	description: 'adds a nickname to all possible members of the current channel',
	usage: '<nickname/reset>',
	permission: 'MANAGE_NICKNAMES',
	args: true,
	cooldown: 5,
	guildOnly: true,
	async execute(message, args) {
		affectedUsers = 0;
		if(!message.member.hasPermission('MANAGE_NICKNAMES')){return}
		server = await discordDatabase.getServer(message.guild.id);
		if(args[0]==='reset'){
			message.channel.members.each(async member =>{
				if(member.roles.highest.position<message.guild.me.roles.highest.position&&!member.hasPermission('MANAGE_NICKNAMES')&&!member.user.bot){
					user = await discordDatabase.getMassNickname(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}"}`));
					if(user){
						if(member.nickname===server.massNick){
							member.setNickname(user.nickname);
							affectedUsers++;
						}
						await discordDatabase.removeMassNickname(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}"}`));
					}else if(member.nickname===server.massNick){
						member.setNickname('');
						affectedUsers++;
					}
				}
			});
			setTimeout(async ()=>{
				message.channel.send(`${affectedUsers} nickname(s) changed`).then(sentMessage=>{
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				});
				await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","massNick":null}`));
			},1000);
		}else{
			Nicknames = null;
			if(args[0]!=='\'\''){
				temp = message.guild.me.nickname;
				await message.guild.me.setNickname(args.join(' '));
				Nicknames = message.guild.me.nickname;
				if(temp){
					await message.guild.me.setNickname(temp);
				}else{
					await message.guild.me.setNickname('');
				}
			}else{
				Nicknames = '';
			}
			if(Nicknames.includes('🖾')){
				return message.reply('That string contains a invalid characters').then(sentMessage=>{
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				});
			}
			message.channel.members.each(async member =>{
				if(member.roles.highest.position<message.guild.me.roles.highest.position&&!member.hasPermission('MANAGE_NICKNAMES')&&!member.user.bot){
					if(member.nickname&&member.nickname!==server.massNick){
						await discordDatabase.addMassNickname(JSON.parse(`{"user_id":"${member.id}","guild_id":"${message.guild.id}","nickname":"${member.nickname}"}`));
					}
					member.setNickname(Nicknames);
					affectedUsers++;
				}
			});
			setTimeout(async ()=>{
				message.channel.send(`${affectedUsers} nickname(s) changed`).then(sentMessage=>{
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				});
				if(Nicknames===''){
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","massNick":null}`));
				}else{
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","massNick":"${Nicknames}"}`));
				}
			},1000);
		}
	},
};
