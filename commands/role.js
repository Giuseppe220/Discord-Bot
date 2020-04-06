module.exports = {
	name: 'role',
	description: 'adds or removes the chosen role to the chosen user.',
	args: true,
	usage: '[add/remove] <user> <role>',
	guildOnly: true,
	adminOnly:true,
	permission: 'MANAGE_ROLES',
	cooldown: 5,
	execute(message, args) {
		if(message.member.hasPermission('MANAGE_ROLES','MENTION_EVERYONE','MANAGE_GUILD')){
			if(message.mentions.members.size!=1){
				return message.reply('Please mention only one user. Thank You!').then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}
			else if(message.mentions.roles.size<1){
				return message.reply('Please tag at least one role. Thank You!').then(sentMessage => {
					sentMessage.delete({timeout:10000});
					message.delete({timeout:10000});
				}).catch()
			}
			if (args.length >= 3){
				let member = message.mentions.members.first();
				let roles = message.mentions.roles;
				let roleList = [];
				roles.each(role=>{
					roleList.push(`${role.name}`);
				});
				if(args[0] == 'add'){
					if(test){
					message.channel.send(`Adding ${member} to ${roleList.join(', ')}`);
					}
					else{
							message.channel.send(`Adding ${member} to ${roleList.join(', ')}`).then(sentMessage => {
								sentMessage.delete({timeout:10000});
								message.delete({timeout:10000});
							}).catch()
							member.roles.add(roles).catch(console.error);
					}
				}
				else if(args[0] == 'remove'){
					if(test){
					message.channel.send(`Removing ${member} from ${roleList.join(', ')}`);
					}else{
						message.channel.send(`removing ${member} from ${roleList.join(', ')}`).then(sentMessage => {
							sentMessage.delete({timeout:10000});
							message.delete({timeout:10000});
						}).catch()
						member.roles.remove(roles).catch(console.error);
					}
				}
			}
		}
		else{
			return message.reply('You do not have the necessary permissions').then(sentMessage => sentMessage.delete({timeout:10000})).catch()
		}
	}
}