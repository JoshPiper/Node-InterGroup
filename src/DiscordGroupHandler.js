let AbstractGroupHandler = require('./AbstractGroupHandler')
let {Client, GuildMember} = require('discord.js')

module.exports = class DiscordGroupHandler extends AbstractGroupHandler {
	/**
	 * @param client Client
	 * @param guild
	 */
	constructor(client, guild){
		super()

		this.client = client
		this.guild = this.client.guilds.resolve(client)
	}

	/**
	 * @param member GuildMember
	 * @param groups Array
	 */
	resolveMember(member, groups){
		let roles = member.roles.cache.map(role => role.id)
		let [add, remove] = this.handleGroup(groups, roles)

		console.log(add, remove)
	}
}