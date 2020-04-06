const fs = require('fs');
const Discord = require('discord.js');
const {prefix} = require('../config.json');

const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'server-toggle-status',
	description: `states all of my toggles/settings status for the server`,
	usage: '',
	aliases: ['sts','server-status'],
	guildOnly: true,
	adminOnly:true,
	cooldown: 60,
	async execute(message, args){
		if(message.member.hasPermission('MANAGE_ROLES')){
			let serverInfo = false;
			let serverPrefix = prefix;
			let keepMemberRole = false;
			let rouletteChannel = 'no channel';
			let textOnlyBlockChannel = 'no channel';
			let allowCustomColors = false;
			let MemberRole = null;
			let CustomColorsRole = null;
			let muteRole = null;
			textBlockChannels = [];
			
			serverInfo = await discordDatabase.getServer(message.guild.id);
			let roulette = new Discord.Collection(JSON.parse(fs.readFileSync('servers/rouletteChannel.txt','utf8')));
			let textOnlyBlock = new Discord.Collection(JSON.parse(fs.readFileSync('servers/noTextOnly.txt','utf8')));
			
			if(serverInfo){
				if(serverInfo.prefix){
					serverPrefix = serverInfo.prefix;
				}
				switch(serverInfo.keepMemberRole){
					case 1:
						keepMemberRole = true;
						break;
					default:
						keepMemberRole = false;
				}
				switch(serverInfo.allowCustomColors){
					case 1:
						allowCustomColors = true;
						break;
					default:
						allowCustomColors = false;
				}
				if(serverInfo.newMemberRole){
					MemberRole = `<@&${serverInfo.newMemberRole}>`
				}
				if(serverInfo.CustomColorsRoleID&&allowCustomColors){
					CustomColorsRole = `<@&${serverInfo.CustomColorsRoleID}>`
				}
				if(serverInfo.muteRoleID){
					muteRole = `<@&${serverInfo.muteRoleID}>`
				}
			}
			
			if(textOnlyBlock.has(message.guild.id)){
				textOnlyBlockChannels = textOnlyBlock.get(message.guild.id);
				textOnlyBlockChannels.forEach(textBlock =>{
					textBlockChannels.push(message.guild.channels.resolve(textBlock));
				});
			}
			
			if(roulette.has(message.guild.id)){
				rouletteChannel = message.guild.channels.resolve(roulette.get(message.guild.id));
			}
			
			message.channel.send(`${message.guild.name} toggles are...\n\nMy prefix is ${serverPrefix}.\nkeep member's roles through rejoins? ${keepMemberRole}\nThe role that is auto assigned to new members that have not been here before, might not be handled by me, is ${MemberRole}\nAllow users to set their own color? ${allowCustomColors}\nRole to allow users to self assign colors/roles under is ${CustomColorsRole}\nMembers are muted using ${muteRole}\nI am blocking text only messages (besides websites) in ${textBlockChannels.join(', ')}.\nI will mention my roulette's player when they get unmuted by me in ${rouletteChannel}.`);
		}
	},
};