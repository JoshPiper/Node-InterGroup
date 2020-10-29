let assert = require('assert')
let {AbstractGroupHandler} = require('../index')

describe('AbstractGroupHandler', function(){
	let handler = new AbstractGroupHandler()

	beforeEach(() => {
		handler = new AbstractGroupHandler()
	})

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

	describe('#addPair()', function(){
		it('adds a mapping to the array', function(){
			handler.addPair('test', 'othertest', 'outtest')
			assert.strictEqual(handler.pairings[0][0], 'test')
			assert.strictEqual(handler.pairings[0][1], 'othertest')
			assert.strictEqual(handler.pairings[0][2][0], 'outtest')
			assert.strictEqual(handler.pairings[0][3], false)
		})

		it('handles input checks', function(){
			handler.addPair('test', 'othertest', 'outtest', true)
			assert.strictEqual(handler.pairings[0][0], 'test')
			assert.strictEqual(handler.pairings[0][1], 'othertest')
			assert.strictEqual(handler.pairings[0][2][0], 'outtest')
			assert.strictEqual(handler.pairings[0][3], true)
		})

		it('adds the mapped outputs to the all table', function(){
			handler.addPair('test', 'othertest', 'outtest')
			assert.strictEqual(handler.all.length, 1)
			assert.strictEqual(handler.all[0], 'outtest')
		})
	})

	describe('#addUnpair()', function(){
		it('adds a mapping to the array', function(){
			handler.addUnpair('test', 'othertest', 'outtest')
			assert.strictEqual(handler.unpairings[0][0], 'test')
			assert.strictEqual(handler.unpairings[0][1], 'othertest')
			assert.strictEqual(handler.unpairings[0][2][0], 'outtest')
			assert.strictEqual(handler.unpairings[0][3], false)
		})

		it('handles input checks', function(){
			handler.addUnpair('test', 'othertest', 'outtest', true)
			assert.strictEqual(handler.unpairings[0][0], 'test')
			assert.strictEqual(handler.unpairings[0][1], 'othertest')
			assert.strictEqual(handler.unpairings[0][2][0], 'outtest')
			assert.strictEqual(handler.unpairings[0][3], true)
		})

		it('adds the mapped outputs to the all table', function(){
			handler.addPair('test', 'othertest', 'outtest')
			assert.strictEqual(handler.all.length, 1)
			assert.strictEqual(handler.all[0], 'outtest')
		})
	})

	describe('#addManaged()', function(){
		it('adds a mapping to the all array', function(){
			handler.addManaged('ree')
			assert.strictEqual(handler.all.length, 1)
			assert.strictEqual(handler.all[0], 'ree')
		})

		it('handles array inputs', function(){
			handler.addManaged(['ree', 'roo'])
			assert.strictEqual(handler.all.length, 2)
			assert.strictEqual(handler.all[0], 'ree')
			assert.strictEqual(handler.all[1], 'roo')
		})
	})

	describe('#resolve()', function(){
		it('resolves mappings', function(){
			handler.addMapping('input', 'output')
			assert.strictEqual(handler.resolve('input').length, 1)

			handler.addMapping('input', ['output1', 'output2'])
			assert.strictEqual(handler.resolve('input').length, 2)
		})

		it('handles not found mappings with an empty array.', function(){
			assert.strictEqual(handler.resolve('input').length, 0)
		})
	})

	describe('#resolveAll()', function(){
		it('resolves simple mappings', function(){
			handler.addMapping('in1', 'out1')

			let resolved = handler.resolveAll(['in1'])
			assert.strictEqual(resolved.length, 1)
			assert.strictEqual(resolved[0], 'out1')
		})

		it('resolves paired output mappings', function(){
			handler.addMapping('in1', 'out1')
			handler.addMapping('in2', 'out2')
			handler.addPair('out1', 'out2', 'out3')

			let resolved = handler.resolveAll(['in1', 'in2'])
			assert.strictEqual(resolved.length, 3)
			assert.strictEqual(resolved[0], 'out1')
			assert.strictEqual(resolved[1], 'out2')
			assert.strictEqual(resolved[2], 'out3')
		})

		it('resolves paired input mappings', function(){
			handler.addMapping('in1', 'out1')
			handler.addPair('in1', 'in2', 'out1&2', true)

			let resolved = handler.resolveAll(['in1', 'in2'])
			assert.strictEqual(resolved.length, 2)
			assert.strictEqual(resolved[0], 'out1')
			assert.strictEqual(resolved[1], 'out1&2')
		})

		it('resolves unpaired output mappings', function(){
			handler.addMapping('in1', 'out1')
			handler.addMapping('in2', 'out2')
			handler.addUnpair('out1', 'out2', 'out1&!2')

			let resolved = handler.resolveAll(['in1'])
			assert.strictEqual(resolved.length, 2)
			assert.strictEqual(resolved[0], 'out1')
			assert.strictEqual(resolved[1], 'out1&!2')
		})

		it('resolves unpaired input mappings', function(){
			handler.addMapping('in1', 'out1')
			handler.addUnpair('in1', 'in2', 'out1&!2', true)

			let resolved = handler.resolveAll(['in1'])
			assert.strictEqual(resolved.length, 2)
			assert.strictEqual(resolved[0], 'out1')
			assert.strictEqual(resolved[1], 'out1&!2')
		})
	})

	describe('#handleGroup()', function(){
		beforeEach(() => {
			handler = new AbstractGroupHandler()
			handler.addMapping('inputA', 'output1')
			handler.addMapping('inputB', 'output2')
			handler.addPair('output1', 'output2', 'output1&2')
			handler.addUnpair('output1', 'output2', 'output1&!2')
			handler.addManaged('alwaysRemove')
		})

		it('handles cases with no input groups', function(){
			let [add, remove] = handler.handleGroup(['inputA', 'inputB'], [])
			assert.strictEqual(add.length, 3)
			assert.strictEqual(add[0], 'output1')
			assert.strictEqual(add[1], 'output2')
			assert.strictEqual(add[2], 'output1&2')
			assert.strictEqual(remove.length, 0)

			let [add2, remove2] = handler.handleGroup(['inputA'], [])
			assert.strictEqual(add2.length, 2)
			assert.strictEqual(add2[0], 'output1')
			assert.strictEqual(add2[1], 'output1&!2')
			assert.strictEqual(remove2.length, 0)

			let [add3, remove3] = handler.handleGroup(['inputB'], [])
			assert.strictEqual(add3.length, 1)
			assert.strictEqual(add3[0], 'output2')
			assert.strictEqual(remove3.length, 0)
		})

		it('handles cases with input groups', function(){
			let [add, remove] = handler.handleGroup(['inputA', 'inputB'], ['output1&2'])
			assert.strictEqual(add.length, 2)
			assert.strictEqual(add[0], 'output1')
			assert.strictEqual(add[1], 'output2')
			assert.strictEqual(remove.length, 0)

			let [add2, remove2] = handler.handleGroup(['inputA'], ['output1&2'])
			assert.strictEqual(add2.length, 2)
			assert.strictEqual(add2[0], 'output1')
			assert.strictEqual(add2[1], 'output1&!2')
			assert.strictEqual(remove2.length, 1)
			assert.strictEqual(remove2[0], 'output1&2')

			let [add3, remove3] = handler.handleGroup(['inputB'], ['output1&2'])
			assert.strictEqual(add3.length, 1)
			assert.strictEqual(add3[0], 'output2')
			assert.strictEqual(remove3.length, 1)
			assert.strictEqual(remove3[0], 'output1&2')
		})
	})
})
