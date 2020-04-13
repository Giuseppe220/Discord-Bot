const fs = require('fs');
const Discord = require('discord.js');
const discordDatabase = require(`${process.cwd()}/dbhandler`);

const client = new Discord.Client();
client.commands = new Discord.Collection();
let textOnlyBlock = new Discord.Collection();
const softbanGuild = new Discord.Collection();

let commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

let commandAmountOld = commandFiles.length;

try{
	textOnlyBlock = new Discord.Collection(JSON.parse(fs.readFileSync('servers/noTextOnly.txt','utf8')));
}catch{
	textOnlyBlock = new Discord.Collection();
}

try{
	rouletteChannel = new Discord.Collection(JSON.parse(fs.readFileSync('servers/rouletteChannel.txt','utf8')));
}catch{
	rouletteChannel = new Discord.Collection();
}

for (const file of commandFiles) {
	let command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

let commandAmountNew = -1;

setInterval(exists => {			
	commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
	commandAmountNew = commandFiles.length;

	if(commandAmountOld  != commandAmountNew){
		client.commands.clear();
		for (const file of commandFiles) {
			let command = require(`./commands/${file}`);
			client.commands.set(command.name, command);
		}
		commandAmountOld = commandAmountNew;
	}
},60000);

setInterval(()=>{
	try{
		textOnlyBlock = new Discord.Collection(JSON.parse(fs.readFileSync('servers/noTextOnly.txt','utf8')));
	}catch{
		textOnlyBlock = new Discord.Collection();
	}
},5000);

setInterval(()=>{
	try{
		rouletteChannel = new Discord.Collection(JSON.parse(fs.readFileSync('servers/rouletteChannel.txt','utf8')));
	}catch{
		rouletteChannel = new Discord.Collection();
	}
},5000);

setInterval(async roulette=>{
	let now = Date.now();
	let rouletteUser = await discordDatabase.getRouletteLoop(JSON.parse(`{"mutedUntil":"${now}"}`));
	if(rouletteUser.length!=0){
		rouletteUser.forEach(async roulette =>{
			const guild = client.guilds.resolve(roulette.guild_id);
			const member = guild.members.resolve(roulette.user_id);
			const play = roulette.playTimes;
			const serverInfo = await discordDatabase.getServer(guild.id);
			const mute = guild.roles.cache.find(x => x.id === serverInfo.muteRoleID);
			try{
				if(member.roles.cache.has(mute.id)){
					member.roles.remove(mute).then(()=>{
						if(rouletteChannel.has(guild.id)&&!roulette.modMuted){
							guild.channels.resolve(rouletteChannel.get(guild.id)).send(`${member}, You have been unmuted`);
						}
					});
				}
			}catch{}
			muteTime = 10000;
			await discordDatabase.addRoulette(JSON.parse(`{"user_id":"${member.id}","guild_id":"${guild.id}","playTimes":"${play}","mutedUntil":"${muteTime}","modMuted":"false"}`),guild.id);
		});
	}
},1000);	

client.on('ready', () => {
	console.log('Ready!');
	setTimeout(()=>{
		client.guilds.cache.get('572964285488300052').channels.cache.get('699071059336626277').send('Less then 1 minute left before the bot shuts down');
	},180000);
	setTimeout(()=>{
		client.destroy();
		process.exit();
	},240000);
});

client.on('guildMemberAdd', async member => {
	const serverInfo = await discordDatabase.getServer(member.guild.id);
	let secondLink = false;
	let secondLinkUses = 0;
	if(serverInfo){
		if(serverInfo.newMemberRole2InviteLink){
			newMemberRoleLink2 = await member.guild.fetchInvites();
			if(newMemberRoleLink2.has(serverInfo.newMemberRole2InviteLink)){
				const secondInvite = newMemberRoleLink2.get(serverInfo.newMemberRole2InviteLink);
				if(serverInfo.newMemberRole2InviteLinkUsage<secondInvite.uses){
					secondLink = true;
					secondLinkUses = secondInvite.uses;
				}
			}
		}
		if(serverInfo.keepMemberRole){
			const serverMember = await discordDatabase.getGuildMemberRoles(JSON.parse(`{"user_id":"${member.id}","guild_id":"${member.guild.id}"}`));
			if(serverMember){
				let roles = serverMember.roles.split(',');
				if(serverInfo.manageNewMemberRole){
					return setTimeout(async ()=>{
						member.roles.set(roles);
					},1000);
				}else{
					return setTimeout(async ()=>{
						member.roles.set(roles);
					},5000);
				}
			}else if(secondLink&&serverInfo.manageNewMemberRole){
				const newGuildMemberRole = member.guild.roles.cache.find(x => x.id === serverInfo.newMemberRole2);
				return setTimeout(async ()=>{
					member.roles.add(newGuildMemberRole);
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${member.guild.id}","newMemberRole2InviteLinkUsage":"${secondLinkUses}"}`));
				},1000);
			}else if(serverInfo.manageNewMemberRole){
				const newGuildMemberRole = member.guild.roles.cache.find(x => x.id === serverInfo.newMemberRole);
				return setTimeout(async ()=>{
					member.roles.add(newGuildMemberRole);
				},1000);
			}
		}else if(serverInfo.manageNewMemberRole){
			if(secondLink){
				const newGuildMemberRole = guild.roles.cache.find(x => x.id === serverInfo.newMemberRole2);
				return setTimeout(async ()=>{
					member.roles.add(newGuildMemberRole);
					await discordDatabase.addServer(JSON.parse(`{"guild_id":"${member.guild.id}","newMemberRole2InviteLinkUsage":"${secondLinkUses}"}`));
				},1000);
			}else{
				const newGuildMemberRole = guild.roles.cache.find(x => x.id === serverInfo.newMemberRole);
				return setTimeout(async ()=>{
					member.roles.add(newGuildMemberRole);
				},1000);
			}
		}
	}
});

client.on('guildMemberUpdate', async (oldMember, newMember) => {
	if(oldMember.user.bot||newMember.user.bot){
		return;
	}
	const serverInfo = await discordDatabase.getServer(newMember.guild.id);
	if(serverInfo){
		if(serverInfo.keepMemberRole){
			if(newMember.roles.cache.size>1){
				const guild = client.guilds.resolve(newMember.guild.id);
				const botHighestRole = guild.me.roles.highest.position;
				const addedRoles = newMember.roles.cache.filter(role =>botHighestRole>role.position&&role.id!==serverInfo.newMemberRole&&role.id!==newMember.guild.id&&!role.managed);
				const roles = [...addedRoles.keys()].join(',');
				if(newMember.roles.cache.has(serverInfo.newMemberRole)){
					if(addedRoles.size!==0){
						newMember.roles.remove(serverInfo.newMemberRole);
					}
				}
				if(addedRoles.size!==0){
					await discordDatabase.addGuildMemberRoles(JSON.parse(`{"user_id":"${newMember.id}","guild_id":"${newMember.guild.id}","roles":"${roles}"}`));
				}
				else{
					await discordDatabase.removeGuildMemberRoles(JSON.parse(`{"user_id":"${newMember.id}","guild_id":"${newMember.guild.id}"}`));				
				}
			}else{
				await discordDatabase.removeGuildMemberRoles(JSON.parse(`{"user_id":"${newMember.id}","guild_id":"${newMember.guild.id}"}`));				
			}
		}
	}
});

client.on('guildBanAdd', async (guild, member) => {
	if(member.user.bot){
		return;
	}
	const serverInfo = await discordDatabase.getServer(guild.id);
	if(serverInfo){
		if(serverInfo.keepMemberRole){
			let guildMember = await discordDatabase.getGuildMemberRoles(JSON.parse(`{"user_id":"${member.id}","guild_id":"${guild.id}"}`));
			setTimeout(async ()=>{
				if(softbanGuild.has(guild.id)){
					softban = softbanGuild.get(guild.id);
					if(softban.has(member.id)){
						softban.delete(member.id);
						if(softban.size===0){
							if(softbanGuild.has(guild.id)){
								softbanGuild.delete(guild.id);
							}
						}
						return;
					}
				}
				if(guildMember){
					await discordDatabase.removeGuildMemberRoles(JSON.parse(`{"user_id":"${member.id}","guild_id":"${guild.id}"}`));								
				}
				softban.delete(member.id);
			},10000);
		}
	}
});

client.on('guildBanRemove', async (guild, member) => {
	if(!softbanGuild.has(guild.id)){
		softbanGuild.set(guild.id,new Discord.Collection());
	}
	const softban = softbanGuild.get(guild.id);
	softban.set(member.id,true);
	setTimeout(()=>{
		if(softbanGuild.has(guild.id)){
			if(softban.has(member.id)){
				softban.delete(member.id);
				if(softban.size===0){
					if(softbanGuild.has(guild.id)){
						softbanGuild.delete(guild.id);
					}
				}
				return;
			}
		}
	},15000);
});

client.on('channelDelete', async channel => {
	if(channel.type === 'text'){
		const commandLocked = await discordDatabase.getCommandLockLoop(JSON.parse(`{"channel":"${channel.id}","guild_id":"${channel.guild.id}"}`));
		if(commandLocked.length!=0){
			commandLocked.forEach(async clock =>{
				await discordDatabase.removeCommandLock(JSON.parse(`{"command":"${clock.command}","guild_id":"${channel.guild.id}"}`));
			});
		}
		const commandDenyed = await discordDatabase.getCommandDenyLoop(JSON.parse(`{"channel":"${channel.id}","guild_id":"${channel.guild.id}"}`));
		if(commandDenyed.length!=0){
			commandDenyed.forEach(async cdeny =>{
				await discordDatabase.removeCommandDeny(JSON.parse(`{"command":"${cdeny.command}","guild_id":"${channel.guild.id}"}`));
			});
		}
		if(rouletteChannel.has(channel.guild.id)){
			if(rouletteChannel.get(channel.guild.id)===channel.id){
				rouletteChannel.delete(channel.guild.id);
				fs.writeFileSync('servers/rouletteChannel.txt',JSON.stringify([...rouletteChannel]));
			}
		}
		if(textOnlyBlock.has(channel.guild.id)){
			if(textOnlyBlock.get(channel.guild.id).includes(channel.id)){
				textBlock = []
				textOnlyBlockChannels = textOnlyBlock.get(channel.guild.id);
				textOnlyBlockChannels.forEach(textBlockChannels =>{
					if(channel.id !== textBlockChannels){
						textBlock.push(textBlockChannels);
					}
				});
				textOnlyBlock.set(message.guild.id,textBlock);
				fs.writeFileSync('servers/noTextOnly.txt',JSON.stringify([...textOnlyBlock]));
			}
		}
	}
});

client.on('message',async message => {	
	if(message.guild!==null){
		if(textOnlyBlock.has(message.guild.id)){
			if(textOnlyBlock.get(message.guild.id).includes(message.channel.id)&&message.attachments.size===0&&!message.content.includes(`http://`)&&!message.content.includes(`https://`)){
				return message.delete();
			}
		}
	}
	
	// if(message.author.bot){
		// return;
	// }
	
	let serverInfo = null;
	let serverPrefix = "c!";
	
	if(message.guild!==null){
		serverInfo = await discordDatabase.getServer(message.guild.id);
	}
	
	if(serverInfo){
		if(serverInfo.prefix){
			serverPrefix = serverInfo.prefix;
		}
	}
	
	args = message.content.split(/ +/);
	if (!args[0].startsWith(serverPrefix)&&!args[0].includes(`${client.user.id}`)) return;
	if(args[0].startsWith(serverPrefix)){
		args[0] = args[0].slice(serverPrefix.length);
	}
	else{
		args.shift();
	}

	const commandName = args.shift().toLowerCase();

	const sentCommand = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	
	let commandLock = null;
	
	if (sentCommand==null) {
		return;
	}
	
	try{
		commandLock = await discordDatabase.getCommandLock(JSON.parse(`{"command":"${sentCommand.name}","guild_id":"${message.guild.id}"}`));
	}catch{}
	
	if(commandLock){
		if(commandLock.channel!==message.channel.id){
			return;
		}
	}
	
	if(sentCommand.channelLock&&!commandLock){
		return message.reply('that command **MUST** be locked to a channel!');
	}
	
	let commandDeny = null;
	
	try{
		commandDeny = await discordDatabase.getCommandDeny(JSON.parse(`{"command":"${sentCommand.name}","guild_id":"${message.guild.id}"}`));
	}catch{}
	
	if(commandDeny){
		if(commandDeny.channel===message.channel.id){
			return;
		}
	}

	if (sentCommand.guildOnly && message.channel.type !== 'text') {
		return message.reply('I can\'t execute that command inside DMs!');
	}
	
	
	if (sentCommand.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}!`;
			if (sentCommand.usage) {
				reply += `\nThe proper usage would be: \`${prefix}${sentCommand.name} ${sentCommand.usage}\``;
		}
		return message.channel.send(reply);
	}
	
	try{
		guildID = message.guild.id;
	}catch{
		guildID = null;
	}
		
	const now = Date.now();
	const timestamp = await discordDatabase.getTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"${sentCommand.name}","guild_id":"${guildID}"}`));
	const cooldownAmount = (sentCommand.cooldown || 5) * 1000;
	
	if(timestamp){
		const expirationTime = timestamp.timeout + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the command \`${sentCommand.name}\`.`);
		}
	}

	if(guildID !== null){
		await discordDatabase.addTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"${sentCommand.name}","guild_id":"${message.guild.id}","timeout":"${now}"}`));
	}
	
	setTimeout(async () => {
		try{
			await discordDatabase.removeTimeout(JSON.parse(`{"user_id":"${message.author.id}","command":"${sentCommand.name}","guild_id":"${guildID}"}`));
		}catch{}
	}, cooldownAmount);
	
	if((sentCommand.guild === guildID||!sentCommand.guild)&&((!sentCommand.permission)||(message.guild.me.hasPermission(sentCommand.permission)))){
		try {
			sentCommand.execute(message, args);
		} catch (error) {
			console.error(error);
			message.reply('there was an error trying to execute that command!');
		}
	}
	else if(sentCommand.guild === guildID||!sentCommand.guild){
		message.reply(`I am missing permissions required for ${sentCommand.name}\nI require ${sentCommand.permission.toLowerCase()} at least`);
	}
 });

client.on('error', console.error);

client.login(process.env.TOKEN);
