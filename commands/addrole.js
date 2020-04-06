const fs = require('fs');
const colorList = [ 'DEFAULT', 'WHITE', 'AQUA', 'GREEN', 'BLUE', 'PURPLE', 'LUMINOUS_VIVID_PINK', 'GOLD', 'ORANGE', 'RED', 'GREY', 'DARKER_GREY', 'NAVY', 'DARK_AQUA', 'DARK_GREEN', 'DARK_BLUE', 'DARK_PURPLE', 'DARK_VIVID_PINK', 'DARK_GOLD', 'DARK_ORANGE', 'DARK_RED', 'DARK_GREY', 'LIGHT_GREY', 'DARK_NAVY', 'RANDOM'];
const Discord = require('discord.js');
const discordDatabase = require(`${process.cwd()}/dbhandler`);
const customColorList = new Discord.Collection([["BLACK","#000001"],["CYAN","#00FFFF"],["LIME","#00FF00"],["FUCHSIA","#FF00FF"],["LAVENDER","#C45DDA"]]);
const colorFile = new Discord.Collection(JSON.parse(fs.readFileSync(`${process.cwd()}/CommandFiles/color.txt`,'utf8')));

module.exports = {
	name: 'addcolor',
	description: 'Lets a User self assign a role or a new role. uses color for name if name is not supplied',
	args: true,
	usage: '[descriptive text] [color name or #HEXCode]',
	aliases: ['selfroleadd','sra','ar','ca','coloradd','color','addrole','ac'],
	guildOnly: true,
	permission: 'MANAGE_ROLES',
	cooldown: 43200,
	async execute(message, args) {
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
		
		userColor = await discordDatabase.getSelfColor(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${guildID}"}`));

		const memberMessage = [];
		let roleName = '';
		let roleColor = 'DEFAULT';
		let roleColorName = '';
		let botRolePosition = message.guild.roles.cache.find(x => x.id === serverInfo.CustomColorsRoleID);
		if(!botRolePosition){
			let botRolePosition = message.guild.roles.cache.find(x => x.name === 'bots'||x.name==='Shepard');
		}
		roleName = args.join(' ');
		let roleExist = message.guild.roles.cache.find(x => x.name.toUpperCase() === roleName.toUpperCase());
		roleName = '';
		if(args[args.length-1]!=null&&!roleExist){
			roleColorName = args.pop();
			roleColor = roleColorName.toUpperCase();
		}
		else if(roleExist){roleColor = 'DEFAULT';}
		else{
			await discordDatabase.addTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"addcolor","guild_id":"${message.guild.id}","timeout":"1000"}`));
			return message.reply(`please supply a color`);
		}
		if(!colorList.includes(roleColor)&&roleColor.charAt(0)!=='#'&&!customColorList.has(roleColor)&&!colorFile.has(roleColor.toLowerCase())){
			await discordDatabase.addTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"addcolor","guild_id":"${message.guild.id}","timeout":"1000"}`));
			return message.reply(`please supply either a valid color name or the color's hexcode equivalent`);
		}
		if(!colorList.includes(roleColor)&&customColorList.has(roleColor)){
			roleName = roleColorName;
			roleColor = customColorList.get(roleColor);
		}
		if(!colorList.includes(roleColor)&&colorFile.has(roleColor.toLowerCase())){
			roleName = roleColorName;
			roleColor = colorFile.get(roleColor.toLowerCase());
		}
		if(roleColor=='#000000'){
			roleColor='#000001';
		}
		if(args.length > 0){
			roleName = args.join(' ');
		}
		else if(roleName===''){
			roleName = roleColor;
		}
		if(roleColor === "#36393E"){
			await discordDatabase.addTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"addcolor","guild_id":"${message.guild.id}","timeout":"1000"}`));
			return message.reply(`I'm sorry but that color is invalid, please supply another color. Thank You!`);
		}
		if(message.guild.roles.cache.size>=225&&!userColor){
			return message.reply(`I'm sorry, but there seems to be too many roles already `);
		}
		if(userColor){
			let roleMembers = message.guild.roles.cache.find(x => x.id === userColor.role);
			if(!roleMembers){}
			else if(roleMembers.members.size===1&&roleMembers.name.toLowerCase()===roleName.toLowerCase()){
				await roleMembers.edit({color:roleColor});
				return message.reply(`${roleMembers.name} color has been changed to ${roleColorName}`,{split: true});
			}
			else if(roleMembers.members.size===1&&message.member.roles.cache.has(userColor.role)){
				memberMessage.push(`${roleMembers.name} is now`);
				await roleMembers.edit({name:roleName,color:roleColor});
				memberMessage.push(`called ${roleName} with the color ${roleColorName}`);
				return message.reply(memberMessage.join(' '),{split: true});
			}
			else{
				try{
				message.member.roles.remove(roleMembers).then(() =>{
				memberMessage.push(`${roleMembers.name} has been taken away from you`);
				setTimeout(()=>{
					if(roleMembers.members.size<1){
						roleMembers.delete('Last user left the role');
					}
				},2000);
				});
			}catch{
				//message.reply('there seems to be an issue with my Permissions');
			}
			}
		}
		roleExist = message.guild.roles.cache.find(x => x.name.toUpperCase() === roleName.toUpperCase());
		if(!roleExist) {
			try{
				message.guild.roles.create({data:{
					name: `${roleName}`,
					color: `${roleColor}`,
					hoist: false,
					position: 1,
					mentionable: false,
					permissions: 0x0
				}}).then(async role=>{
					message.member.roles.add(role).catch(console.error);
					memberMessage.push(`${role.name} has been added to you`);
					await discordDatabase.addSelfColor(JSON.parse(`{"user_id":"${message.author.id}","guild_id":"${guildID}","role":"${role.id}"}`));
				}).catch(console.error);
			}catch(e){
				console.log(e);
				memberMessage.push('there seems to be an issue with my Permissions\n');
			}
		}else{
			if(roleExist.position>botRolePosition.position){return message.reply('I can not add that role to you');}
			if(roleExist.members.size>=1){return message.reply(`I'm sorry I can not add that role to you please try again with a different description`);}
		}

setTimeout(() =>{
				return message.reply(memberMessage,{split: true});
			},2000)
}
}
