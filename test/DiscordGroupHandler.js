/*
This right here is a stupid idea.
Unless you have a 100% reproducable environment, such as a discord with only dedicated test users.
It's very likely to fail with simple testing.
And I cba writing a full test suite for that.
It's not my API, not my data.
*/


/*
let assert = require('assert')
let {DiscordGroupHandler} = require('../index')
let {Client} = require('discord.js')
let GuildID = process.env['GUILD_ID']
let MemberID = process.env['MEMBER_ID']
let BotToken = process.env['BOT_TOKEN']

describe('DiscordGroupHandler', function(){
	let client = new Client()
	let handler

	beforeEach(async function(){
		if (!client.readyAt){
			await client.login(BotToken)
		}

		handler = new DiscordGroupHandler(client, GuildID)
		handler.addMapping('owner', '625984729677824011')
		handler.addMapping('mod2', ['628264780418908203', '625984666897481731'])
		handler.addMapping('mod', '625984666897481731')
		handler.addMapping('support', '700903936948699187')
		handler.addMapping('developer', '625984806278397953')
		handler.addMapping('vehicle', '626320425911320589')

		return client
	})

	describe('#resolveMember()', function(){
		it('resolves user roles', async function(){
			let guild = await client.guilds.fetch(GuildID)
			let member = await guild.members.fetch(MemberID)

			console.log(handler.resolveMember(member, ['owner']))
		})
	})
})
*/