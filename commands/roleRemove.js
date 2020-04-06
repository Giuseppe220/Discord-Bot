const fs = require('fs');
const Discord = require('discord.js');
let userRoles = new Discord.Collection();
const discordDatabase = require(`${process.cwd()}/dbhandler`);

module.exports = {
	name: 'removecolor',
	description: 'Lets a User self remove a role',
	args: true,
	usage: '[role name]',
	aliases: ['selfroleremove','srr','rr','cr','colorremove','removerole','rc'],
	guildOnly: true,
	permission: 'MANAGE_ROLES',
	cooldown: 43200,
	async execute(message, args) {
		let rolePosition = 0;

		let srl = false;
		let serverInfo = await discordDatabase.getServer(message.guild.id);
		if(serverInfo){
			switch(serverInfo.allowCustomColors){
				case 1:
					srl = true;
					break;
				default:
					srl = false;
			}
		}
		if (!srl) {
			return;
		}
		if(!serverInfo.CustomColorsRoleID){
			return message.reply('Please tell me what role is your start of custom colors role').then(sentMessage => {
				sentMessage.delete({timeout:10000});
				message.delete({timeout:10000});
			}).catch()
		}
		let botRolePosition = message.guild.roles.cache.find(x => x.id === serverInfo.CustomColorsRoleID);
		if(!botRolePosition){
			botRolePosition = message.guild.roles.cache.find(x => x.name === 'bots'||x.name==='Shepard');
		}
		
		let roleName = '';
		if(args.length != 0){
			roleName = args.join(' ');
		}
		else{
			await discordDatabase.addTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"removecolor","guild_id":"${message.guild.id}","timeout":"1000"}`));
			return message.reply(`please supply a name`);
		}
		let roleExist = message.guild.roles.cache.find(x => x.name.toUpperCase()=== roleName.toUpperCase());
		try{
			rolePosition = roleExist.position;
		}catch{
			rolePosition = 10000;
		}
		if(roleExist&&botRolePosition.position>rolePosition) {
			try{
				message.member.roles.remove(roleExist).then(role =>{
				message.reply(`${roleExist.name} has been taken away from you`)
				setTimeout(()=>{
					if(roleExist.members.size<1){
						roleExist.delete('Last user left the role');
					}
				},2000);
				});
				await discordDatabase.removeSelfColor(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${guildID}"}`));
			}catch{
				message.reply('there seems to be an issue with my Permissions');
			}
		}else if(botRolePosition.position<rolePosition){
			return message.reply(`I can not let you remove yourself from a role`);
		}
}
}
