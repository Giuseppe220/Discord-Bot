const Discord = require('discord.js');
const sql = require('sequelize');

const sqlite = new sql('database', null, null, {
    host: 'localhost',
    dialect: 'sqlite',
    storage: 'discord.db',
    logging: false,
    //logging: console.log,
    define: {
        timestamps: false
    },
});

const server = sqlite.define('servers', {
    guild_id: {
        type: sql.DataTypes.TEXT,
        unique: true,
        primaryKey: true,
		allowNull: false,
    },
    prefix: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
	keepMemberRole: {
        type: sql.DataTypes.BOOLEAN,
        allowNull: true,
    },
	manageNewMemberRole: {
        type: sql.DataTypes.BOOLEAN,
        allowNull: true,
    },
	newMemberRole: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
	newMemberRole2: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
	newMemberRole2InviteLink: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
	newMemberRole2InviteLinkUsage: {
        type: sql.DataTypes.INTEGER,
        allowNull: true,
    },
	allowCustomColors: {
        type: sql.DataTypes.BOOLEAN,
        allowNull: true,
    },
	CustomColorsRoleID: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
	muteRoleID: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
});
const cooldowns = sqlite.define('cooldowns', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,		
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: true,
		primaryKey: true,	
    },
	command:{
		type: sql.DataTypes.TEXT,
        allowNull: false,
	},
    timeout:{
        type: sql.DataTypes.DOUBLE,
        allowNull: false,
    },
});
const roulette = sqlite.define('roulette', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,		
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: true,
		primaryKey: true,	
    },
    playTimes:{
        type: sql.DataTypes.DOUBLE,
        allowNull: false,
    },
	mutedUntil:{
        type: sql.DataTypes.DOUBLE,
        allowNull: false,
    },
	modMuted:{
        type: sql.DataTypes.BOOLEAN,
        allowNull: true,
    },
});
const commandLock = sqlite.define('commandLock', {
    guild_id: {
        type: sql.DataTypes.TEXT,
        primaryKey: true,
		allowNull: false,
    },
    command: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
        primaryKey: true,
    },
	channel: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
});
const commandDeny = sqlite.define('commandDeny', {
    guild_id: {
        type: sql.DataTypes.TEXT,
        primaryKey: true,
		allowNull: false,
    },
    command: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
        primaryKey: true,
    },
	channel: {
        type: sql.DataTypes.TEXT,
        allowNull: true,
    },
});
const RoulettePoints = sqlite.define('RoulettePoints', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,		
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: true,
		primaryKey: true,	
    },
    points:{
        type: sql.DataTypes.DOUBLE,
        allowNull: false,
    },
});
const selfColor = sqlite.define('selfColor', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,		
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
		primaryKey: true,	
    },
    role:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
    },
});
const guildMemberRoles = sqlite.define('guildMemberRoles', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
        primaryKey: true,		
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
		primaryKey: true,	
    },
    roles:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
    },
});
const modRoulette = sqlite.define('modRoulette', {
    user_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,	
		primaryKey: true,
    },
    guild_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,
		primaryKey: true,
    },
    member_id:{
        type: sql.DataTypes.TEXT,
        allowNull: false,	
		primaryKey: true,		
    },
	cooldown:{
        type: sql.DataTypes.DOUBLE,
        allowNull: false,
    },
});
server.sync();
cooldowns.sync();
roulette.sync();
commandLock.sync();
commandDeny.sync();
RoulettePoints.sync();
selfColor.sync();
guildMemberRoles.sync();
modRoulette.sync();

module.exports = {
	removeServer: function(guild){
		return new Promise(async resolve =>{
			await server.destroy({
			  where: {
				guild_id: guild,
			  },
			  force: true
			});
			resolve(true);
		});
	},
	addServer: function(requested){
		return new Promise(async resolve =>{
			try{
				await server.create(requested);
			}catch{
				try{
					await server.update(requested, {where: {guild_id: requested.guild_id}});
				}catch {
					console.log("unable to write to Server databse");
				}
			}
			resolve(requested);
		});
	},
	getServer: function(guild){
		return new Promise(async resolve =>{
			const list = await server.findOne({
				raw: true,
				where: {
					guild_id: guild
				}
				});
			  resolve(list);
		});
	},
	removeTimeout: function(requested){
		return new Promise(async resolve =>{
			await cooldowns.destroy({
			  where: {
				user_id: requested.user_id,
				guild_id: requested.guild_id,
				command: requested.command
			  },
			  force: true
			});
			resolve();
		});
	},
	addTimeout: function(requested){
		return new Promise(async resolve =>{
			try{
				await cooldowns.create(requested);
			}catch{
				try{
					await cooldowns.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
						}
					});
				}catch {
					console.log("unable to write to Timeout databse");
				}
			}
			resolve();
		});
	},
	getTimeout: function(requested){
		return new Promise(async resolve =>{
			const user = await cooldowns.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
					command: requested.command
				}
			});
			resolve(user);
		});
	},
	removeRoulette: function(requested){
		return new Promise(async resolve =>{
			try{
				await roulette.destroy({
				  where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addRoulette: function(requested){
		return new Promise(async resolve =>{
			try{
				await roulette.create(requested);
			}catch{
				try{
					await roulette.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
						}
					});
				}catch {
					console.log("unable to write to Roulette databse");
				}
			}
			resolve();
		});
	},
	getRoulette: function(requested){
		return new Promise(async resolve =>{
			const user = await roulette.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				}
			});
			resolve(user);
		});
	},
	getRouletteLoop: function(requested){
		return new Promise(async resolve =>{
			const user = await roulette.findAll({
				where: {
					mutedUntil: {
						[sql.Op.lt]: requested.mutedUntil,
						[sql.Op.gt]: 1000000
					}
				}
			});
			resolve(user);
		});
	},
	removeCommandLock: function(requested){
		return new Promise(async resolve =>{
			try{
				await commandLock.destroy({
				  where: {
					guild_id: requested.guild_id,
					command: requested.command,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addCommandLock: function(requested){
		return new Promise(async resolve =>{
			try{
				await commandLock.create(requested);
			}catch{
				try{
					await commandLock.update(requested, {
						where: {
							guild_id: requested.guild_id,
							command: requested.command,
						}
					});
				}catch {
					console.log("unable to write to CommandLock database");
				}
			}
			resolve();
		});
	},
	getCommandLock: function(requested){
		return new Promise(async resolve =>{
			const lock = await commandLock.findOne({
				where: {
					guild_id: requested.guild_id,
					command: requested.command,
				}
			});
			resolve(lock);
		});
	},
	getCommandLockLoop: function(requested){
		return new Promise(async resolve =>{
			const lock = await commandLock.findAll({
				where: {
					guild_id: requested.guild_id,
					channel: requested.channel,
				}
			});
			resolve(lock);
		});
	},
	removeCommandDeny: function(requested){
		return new Promise(async resolve =>{
			try{
				await commandDeny.destroy({
				  where: {
					guild_id: requested.guild_id,
					command: requested.command,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addCommandDeny: function(requested){
		return new Promise(async resolve =>{
			try{
				await commandDeny.create(requested);
			}catch{
				try{
					await commandDeny.update(requested, {
						where: {
							guild_id: requested.guild_id,
							command: requested.command,
						}
					});
				}catch {
					console.log("unable to write to CommandDeny databse");
				}
			}
			resolve();
		});
	},
	getCommandDeny: function(requested){
		return new Promise(async resolve =>{
			const lock = await commandDeny.findOne({
				where: {
					guild_id: requested.guild_id,
					command: requested.command,
				}
			});
			resolve(lock);
		});
	},
	getCommandDenyLoop: function(requested){
		return new Promise(async resolve =>{
			const lock = await commandDeny.findAll({
				where: {
					guild_id: requested.guild_id,
					channel: requested.channel,
				}
			});
			resolve(lock);
		});
	},
	removeRoulettePoints: function(requested){
		return new Promise(async resolve =>{
			try{
				await RoulettePoints.destroy({
				  where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addRoulettePoints: function(requested){
		return new Promise(async resolve =>{
			try{
				await RoulettePoints.create(requested);
			}catch{
				try{
					await RoulettePoints.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
						}
					});
				}catch {
					console.log("unable to write to RoulettePoints databse");
				}
			}
			resolve();
		});
	},
	getRoulettePoints: function(requested){
		return new Promise(async resolve =>{
			const user = await RoulettePoints.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				}
			});
			resolve(user);
		});
	},
	removeSelfColor: function(requested){
		return new Promise(async resolve =>{
			try{
				await selfColor.destroy({
				  where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addSelfColor: function(requested){
		return new Promise(async resolve =>{
			try{
				await selfColor.create(requested);
			}catch{
				try{
					await selfColor.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
						}
					});
				}catch {
					console.log("unable to write to SelfColor databse");
				}
			}
			resolve();
		});
	},
	getSelfColor: function(requested){
		return new Promise(async resolve =>{
			const user = await selfColor.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				}
			});
			resolve(user);
		});
	},
	removeGuildMemberRoles: function(requested){
		return new Promise(async resolve =>{
			try{
				await guildMemberRoles.destroy({
				  where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addGuildMemberRoles: function(requested){
		return new Promise(async resolve =>{
			try{
				await guildMemberRoles.create(requested);
			}catch{
				try{
					await guildMemberRoles.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
						}
					});
				}catch {
					console.log("unable to write to guildMemberRoles databse");
				}
			}
			resolve();
		});
	},
	getGuildMemberRoles: function(requested){
		return new Promise(async resolve =>{
			const user = await guildMemberRoles.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
				}
			});
			resolve(user);
		});
	},
	removeModRoulette: function(requested){
		return new Promise(async resolve =>{
			try{
				await modRoulette.destroy({
				  where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
					member_id: requested.member_id,
				  },
				  force: true
				});
			}catch{}
			resolve();
		});
	},
	addModRoulette: function(requested){
		return new Promise(async resolve =>{
			try{
				await modRoulette.create(requested);
			}catch{
				try{
					await modRoulette.update(requested, {
						where: {
							user_id: requested.user_id,
							guild_id: requested.guild_id,
							member_id: requested.member_id,
						}
					});
				}catch {
					console.log("unable to write to Roulette databse");
				}
			}
			resolve();
		});
	},
	getModRoulette: function(requested){
		return new Promise(async resolve =>{
			const user = await modRoulette.findOne({
				where: {
					user_id: requested.user_id,
					guild_id: requested.guild_id,
					member_id: requested.member_id,
				}
			});
			resolve(user);
		});
	},
}
