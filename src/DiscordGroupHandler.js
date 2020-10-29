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
	 * Resolve a member and input array into output group array.
	 * @param member GuildMember
	 * @param groups Array
	 */
	resolveMember(member, groups){
		let roles = member.roles.cache.map(role => role.id)
		return this.handleGroup(groups, roles)
	}

	/**
	 * Handle a member and input array, assigning it its managed groups.
	 * @param member GuildMember
	 * @param groups Array
	 * @param reason string
	 * @returns {Promise<GuildMember[]>}
	 */
	async handleMember(member, groups, reason = 'Role Sync'){
		let [add, remove] = this.resolveMember(member, groups)
		return Promise.all([
			member.roles.add(add, reason),
			member.roles.remove(remove, reason)
		])
	}
}
