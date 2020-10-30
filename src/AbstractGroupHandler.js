module.exports = class AbstractGroupHandler {
	constructor(){
		this.all = []
		this.mappings = {}

		this.pairings = []
		this.unpairings = []
	}

	/**
	 * Add a mapping to the class
	 * @param id mixed
	 * @param mapping mixed
	 * @returns {AbstractGroupHandler}
	 */
	addMapping(id, mapping){
		if (!Array.isArray(mapping)){
			mapping = [mapping]
		}

		this.mappings[id] = mapping
		this.addManaged(mapping)

		return this
	}

	/**
	 * Add a pair mapping.
	 * If a check has both a and b are present, add mappings.
	 * @param a mixed
	 * @param b mixed
	 * @param mapping mixed
	 * @param input boolean If set true, this checks input values, if false, it checks outputs.
	 * @returns {AbstractGroupHandler}
	 */
	addPair(a, b, mapping, input = false){
		if (!Array.isArray(mapping)){
			mapping = [mapping]
		}

		this.pairings.push([a, b, mapping, input])
		this.addManaged(mapping)

		return this
	}

	/**
	 * Add an unpair mapping.
	 * If a check has a and not b, add mappings.
	 * @param a mixed
	 * @param b mixed
	 * @param mapping mixed
	 * @param input boolean If set true, this checks input values, if false, it checks outputs.
	 * @returns {AbstractGroupHandler}
	 */
	addUnpair(a, b, mapping, input = false){
		if (!Array.isArray(mapping)){
			mapping = [mapping]
		}

		this.unpairings.push([a, b, mapping, input])
		this.addManaged(mapping)

		return this
	}

	/**
	 * Add an output group which is managed by this class.
	 * @param value mixed
	 * @returns {AbstractGroupHandler}
	 */
	addManaged(value){
		if (Array.isArray(value)){
			for (let v of value){
				this.addManaged(v)
			}
			return this
		}

		if (this.all.indexOf(value) === -1){
			this.all.push(value)
		}

		return this
	}

	/**
	 * Resolve a single input value to its output mappings.
	 * Does not include pairs or unpairs, only simple mappings.
	 * @param value
	 * @return array
	 */
	resolve(value){
		if (this.mappings[value] !== undefined){
			return this.mappings[value]
		}

		return []
	}

	/**
	 * Resolve all outputs for the given inputs.
	 * @param values array
	 * @return array
	 */
	resolveAll(values){
		let out = values
			.map(value => {return this.resolve(value)})

		let inPairs = this.pairings.filter(pair => pair[3])
		let outPairs = this.pairings.filter(pair => !pair[3])

		let inUnpairs = this.unpairings.filter(pair => pair[3])
		let outUnpairs = this.unpairings.filter(pair => !pair[3])

		for (let [a, b, mapping] of inPairs){
			if (values.includes(a) && values.includes(b)){
				out.push(mapping)
			}
		}
		for (let [a, b, mapping] of inUnpairs){
			if (values.includes(a) && !values.includes(b)){
				out.push(mapping)
			}
		}

		out = out.flat()
		for (let [a, b, mapping] of outPairs){
			if (out.includes(a) && out.includes(b)){
				out.push(...mapping)
			}
		}
		for (let [a, b, mapping] of outUnpairs){
			if (out.includes(a) && !out.includes(b)){
				out.push(...mapping)
			}
		}

		return out
	}

	/**
	 * Resolve the list of input groups and the current roles, and return two arrays.
	 * An array of roles to add, and an array to remove.
	 * @param groups Array
	 * @param currentRoles Array
	 * @return Array
	 */
	handleGroup(groups, currentRoles){
		let roles = this.resolveAll(groups)

		let rSet = new Set(roles) /* The roles we need to end up with */
		let cRoles = new Set(currentRoles) /* The roles we currently have */
		let toAdd = rSet - cRoles /* The roles we need to have */

		let allSet = new Set(this.all)
		let removeSet = cRoles - rSet /* The roles we need to remove, so the ones we have minus the ones we need to end up with */
		let toRemove = Array.from(removeSet).filter(role => allSet.has(role)) /* Of the ones we need to remove, only the ones we manage */

		return [Array.from(toAdd), toRemove]
	}
}
