const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'allow-custom-colors',
	description: 'allows the addcolor command to fully run',
	aliases: ['acc','allowcustomcolors'],
	usage: 'true/false',
	permission: 'MANAGE_ROLES',
	guildOnly: true,
	adminOnly:true,
	cooldown: 1,
	async execute(message, args) {
		if(message.member.hasPermission('MANAGE_ROLES')){
			let botRole = message.guild.roles.cache.find(x => x.name === 'bots'||x.name==='Shepard');
			let serverInfo = await discordDatabase.getServer(message.guild.id);
			let colorRole = message.guild.roles.cache.find(x => x.id === serverInfo.CustomColorsRoleID);
			if(args[0]==='true'||args[0]==='false'){
				let newPrefix = await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","allowCustomColors":"${args[0]}"}`));
			}else if(args[0].toLowerCase()==='status'){
				let srl = false;
				if(serverInfo){
					switch(serverInfo.allowCustomColors){
						case 1:
							srl = true;
							break;
						default:
							srl = false;
					}
				}
				return message.reply(`allow user color mode is currently set to ${srl}`).then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}else{
				return message.reply('please use either "true" or "false"').then(sentMessage => {
					sentMessage.delete({timeout:20000});
					message.delete({timeout:20000});
				}).catch()
			}
			if(args[0].toLowerCase()==='true'){
				message.reply('I have enabled user color/colour mode from here on').then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}
			else if(args[0].toLowerCase()==='false'){
				message.reply('I have disables user color/colour mode from here on').then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}
			if(args[0].toLowerCase()==='true'){
				message.guild.roles.create({data:{
					name: `Custom Color Start`,
					color: `DEFAULT`,
					hoist: false,
					position: 1,
					mentionable: false,
					permissions: 0x0
				}}).then(async role=>{
					message.guild.me.roles.add(role).catch();
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","CustomColorsRoleID":"${role.id}"}`));
				}).catch(console.error);
			}else if(args[0].toLowerCase()==='false'){
				message.guild.me.roles.remove(colorRole).then(async role=>{
					setTimeout(()=>{
						if(role.members.size<1){
							role.delete('allowing custom colors has been disabled');
						}
					},2000);
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${message.guild.id}","CustomColorsRoleID":null}`));
				});
			}
		}else{
			return message.reply('I am unable to process your request').then(sentMessage => {
				sentMessage.delete({timeout:20000});
				message.delete({timeout:20000});
			}).catch()
		}
		
	},
};
