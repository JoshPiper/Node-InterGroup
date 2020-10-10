let assert = require('assert')
let GroupHandler = require('../index')

describe('GroupHandler', function(){
	let handler = new GroupHandler()

	it('starts with an empty all table.', function(){
		assert.strictEqual(handler.all.length, 0)
	})

	it('starts with an empty mappings table.', function(){
		assert.strictEqual(Object.entries(handler.mappings).length, 0)
	})

	it('starts with an empty pairs table.', function(){
		assert.strictEqual(handler.pairings.length, 0)
	})

	it('starts with an empty unpairs table', function(){
		assert.strictEqual(handler.unpairings.length, 0)
	})

	describe('#addMapping()', function(){
		it('adds a mapping to the table', function(){
			let mapping = ['test', 'test2']
			handler.addMapping('test', mapping)
			assert.strictEqual(handler.mappings['test'], mapping)
		})

		it('adds the mapped outputs to the all table', function(){
			let mapping = ['test', 'test2']
			handler.addMapping('test', mapping)
			assert.strictEqual(handler.all.length, 2)
			assert.strictEqual(handler.all[0], 'test')
			assert.strictEqual(handler.all[1], 'test2')
		})
	})
})
