const fs = require('fs');
module.exports = {
	name: 'rules',
	description: 'rules',
	aliases: ['rule'],
	permission: false,
	usage: '(add/remove) (rule number) (rule{not needed to remove a rule}) bot will auto append "." to rule number',
	cooldown: 60,
	execute(message, args) {
		rulesFile = `../../vps/discordbots/${message.guild.id}/rules.txt`
		if(!args.length){
			rules = fs.readFileSync(rulesFile,'utf8');
			if(!rules.length){
				return;
			}
			else{
				message.channel.send(rules);
			}
		}
		else if(message.member.hasPermission('ADMINISTRATOR')){
			if(args[0] === 'add'){
				newRules = [...args];
				newRules.shift();
				newRuleNumber = newRules.shift();
				rules = fs.readFileSync(rulesFile,'utf8');
				rulesArray = []
				if(newRuleNumber === '1' && !rules.length){
					rulesArray = ['RULES:']
				}
				else{
					rulesArray = rules.split('\n');
				}
				rulesArray.splice(newRuleNumber,0,`${newRuleNumber}.${newRules.join(' ')}`)
				if(rulesArray.length > 2){
				for(i=1;i<rulesArray.length;i++){
				 ruleUpdate = rulesArray[i];
				 ruleUpdateHold = ruleUpdate.split('.');
				 ruleUpdateHold[0] = i;
				 ruleUpdate = ruleUpdateHold.join('.');
				 rulesArray[i] = ruleUpdate
				}
				}
				fs.writeFileSync(rulesFile,rulesArray.join('\n'));
			message.reply(`rule ${newRules.join(' ')} added`).then(sent => sent.delete({timeout:60000}));
			}
			else if(args[0] === 'remove'){
				newRules = [...args];
				newRules.shift();
				newRuleNumber = newRules.shift();
				rules = fs.readFileSync(rulesFile,'utf8');
				rulesArray = []
				if(newRuleNumber === '1' && !rules.length){
					rulesArray = ['RULES:']
				}
				else{
					rulesArray = rules.split('\n');				
				}
				rulesArray.splice(newRuleNumber,1)
				if(rulesArray.length > 2){
				for(i=1;i<rulesArray.length;i++){
				 ruleUpdate = rulesArray[i];
				 ruleUpdateHold = ruleUpdate.split('.');
				 ruleUpdateHold[0] = i;
				 ruleUpdate = ruleUpdateHold.join('.');
				 rulesArray[i] = ruleUpdate
				}
				}
				fs.writeFileSync(rulesFile,rulesArray.join('\n'));
				message.reply(`rule number ${newRuleNumber} removed`).then(sent => sent.delete({timeout:60000}));
			}
			else{
				message.reply('invalid argument');
			}
		}
	},
};
