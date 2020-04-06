const {prefix} = require('../config.json');
const discordDatabase = require(`${process.cwd()}/dbhandler`);
module.exports = {
	name: 'help',
	description: 'commands',
	permission: false,
	cooldown: 10,
	async execute(message, args) {
		const data = [];
		const {commands} = message.client;
		guildcommands = commands.filter(command=>(command.guild === message.guild.id)||(!command.guild)&&((!command.permission)||(message.guild.me.hasPermission(command.permission))))
		
		
		let serverInfo = false;
		let serverPrefix = prefix;
		
		if(message.guild!==null){
			serverInfo = await discordDatabase.getServer(message.guild.id);
		}
		
		if(serverInfo){
			serverPrefix = serverInfo.prefix;
		}
		
		if (!args.length){
			data.push('Here is all my commands:\n');
			try{
				permissions = message.member.hasPermission('ADMINISTRATOR');
			}catch{
				permissions = false;
			}
			if(permissions){
				var commandList = guildcommands.map(command => command.name);
			}
			else{
				var commandList = guildcommands.filter(adminCommand => !adminCommand.adminOnly).map(command => command.name);
			}
			data.push(commandList.join('\n'));
			data.push(`\nyou can send \'${serverPrefix}help [command name]\' to get information on a specific command!`);
			
			return message.author.send(data,{split: true}).then(() => {
			if(message.channel.type === 'dm') return;
			message.reply(`I've sent you a DM with all my applicable commands!`);
			})
			.catch(error => {
			message.reply(`it seems like I can't DM you! do you have DMs disabled?`);
			});
		}
		else{
			const name = args[0].toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command||(command.guild !== guildID&&command.guild)) {
				return message.reply('that\'s not a valid command!');
			}

			data.push(`**Name:** ${command.name}`);

			if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
			if (command.description) data.push(`**Description:** ${command.description}`);
			if (command.usage) data.push(`**Usage:** ${serverPrefix}${command.name} ${command.usage}`);

			data.push(`**Cooldown:** ${command.cooldown || 5} second(s)`);

			if (command.channelLock) data.push(`***Channel Lock Required***`);


			return message.channel.send(data,{split: true});
		}
	},
};
