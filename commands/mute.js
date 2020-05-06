const discordDatabase = require(`${process.cwd()}/dbhandler`);

module.exports = {
	name: 'mute',
	description: 'mutes a user',
	usage: '<user>',
	permission: 'MANAGE_ROLES',
	args: true,
	cooldown: 5,
	guildOnly: true,
	async execute(message, args) {
		const server = await discordDatabase.getServer(message.guild.id);
		if(!server.muteRoleID){
			return message.reply('Please tell me what role is your muted role').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		const muteRole = message.guild.roles.cache.find(x => x.id === server.muteRoleID);
		if(!message.member.hasPermission('MANAGE_ROLES','MANAGE_MESSAGES')){
			return message.reply('You do not have the necessary permissions').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		if(message.mentions.members.size<1){
			return message.reply('Please mention at least one user. Thank You!').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		if (args.length >= 1&&muteRole&&(muteRole.position<message.member.roles.highest.position||message.guild.ownerID===message.member.id)){
			let members = message.mentions.members;
			membersList = [];
			members.each(member=>{
				if(muteRole.position>member.roles.highest.position||message.guild.ownerID!==message.member.id){
					member.roles.add(muteRole).catch(console.error);
					membersList.push(`${member.displayName}`);
				}
			});
			if(muteRole.position>member.roles.highest.position){
				message.channel.send(`${membersList.join(', ')} were all muted`).then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
			}else if(membersList.length===1){
				message.channel.send(`${membersList.join(', ')} was muted`).then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
			}else{
				message.channel.send(`no one was muted`).then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
			}
		}
		else if(mmuteRole.position>message.member.roles.highest.position){
			return message.reply('Opps! You do not have the corrct permissions!!').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		else{
			return message.reply('It seems like there is not role called "muted".\nPlease add one or have an admin add one').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
	},
};
