const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'keepmemberroles',
	description: 'removes the color limit per user',
	aliases: ['kmr'],
	usage: 'true/false',
	permission: 'MANAGE_ROLES',
	guildOnly: true,
	adminOnly:true,
	cooldown: 3,
	async execute(message, args) {
		if(message.member.hasPermission('MANAGE_ROLES')){
				let serverInfo = await discordDatabase.getServer(message.guild.id);
				if(args[0]==='true'||args[0]==='false'){
					let message1 = '';
					let newMemberRole = null;
					if(message.mentions.roles.size<1&&args.length===1){
						if(!serverInfo.manageNewRole&&args[0]==='true'){
							message.channel.send("WARNING: if there is a role new members get please reissue this command and mention the role at the end or you can just ignore this warning.").then(sentMessage => {
								message1 = sentMessage;
							}).catch()
							newMemberRole = null;
						}
					}else{
						newMemberRole = message.mentions.roles.first();
						message.channel.send(`I will be using ${newMemberRole} as my role that i need to look out for with members that were already here`).then(sentMessage => {
							message1 = sentMessage;
						}).catch()
					}
					if(newMemberRole){
						let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","keepMemberRole":"${args[0]}","newMemberRole":"${newMemberRole.id}"}`));
					}else if(!serverInfo.manageNewMemberRole){
						let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","keepMemberRole":"${args[0]}","newMemberRole":null}`));
					}else{
						let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","keepMemberRole":"${args[0]}"}`));
					}
				}else if(args[0].toLowerCase()==='status'){
					let srl = false;
					if(serverInfo){
						switch(serverInfo.keepMemberRole){
							case 1:
								srl = true;
								break;
							default:
								srl = false;
						}
					}
					return message.reply(`persistent role mode is currently set to ${srl}`)
				}else{
					return message.reply('please use either "true" or "false"').then(sentMessage => {
						sentMessage.delete({timeout:20000});
						message.delete({timeout:20000});
					}).catch()
				}
				if(args[0].toLowerCase()==='true'){
					message.reply('I will give back every role, below my highest, to every member that leaves and rejoins').then(sentMessage => {
						sentMessage.delete({timeout:10000});
						message.delete({timeout:10000});
						if(message1!==''){
							message1.delete({timeout:10000});
						}
					}).catch()
				}else if(args[0].toLowerCase()==='false'){
					message.reply('I will not be giving back any roles, below my highest, to any member').then(sentMessage => {
						sentMessage.delete({timeout:10000});
						message.delete({timeout:10000});
						if(message1!==''){
							message1.delete({timeout:10000});
						}
					}).catch()
				}
		}
	},
};