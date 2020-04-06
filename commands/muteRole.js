const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'muterole',
	description: 'allows me to mute members',
	aliases: ['mr'],
	usage: '[(mute role mentioned)/false]',
	permission: 'MANAGE_ROLES',
	guildOnly: true,
	adminOnly:true,
	cooldown: 3,
	async execute(message, args) {
		if(message.member.hasPermission('MANAGE_ROLES')){
			let serverInfo = await discordDatabase.getServer(message.guild.id);
			let message1 = '';
			let newMemberRole = null;
			if(args[0].toLowerCase()==='status'){
				let srl = serverInfo.muteRoleID;
				if(srl){
					return message.reply(`the mute role I am using is currently <@&${srl}>`)
				}else{
					return message.reply(`the mute role I am using is currently ${newMemberRole}`)
				}
			}else if(message.mentions.roles.size!==1){
				return message.reply('Please mention only one role').then(sentMessage => {
					sentMessage.delete({timeout:20000});
					message.delete({timeout:20000});
				}).catch()
			}
			newMemberRole = message.mentions.roles.first();
			
			if(newMemberRole){
				let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","muteRoleID":"${newMemberRole.id}"}`));
			}else{
				let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","muteRoleID":null}`));
			}
			
			if(newMemberRole){
				message.reply(`I will be using the role ${newMemberRole} to mute a user`).then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}else{
				message.reply('I will not be using any roles to mute a user and I will not be muting a user at all').then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}
		}
	},
};