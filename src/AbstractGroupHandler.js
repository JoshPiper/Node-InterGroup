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
			return
		}

		if (this.all.indexOf(value) === -1){
			this.all.push(value)
		}
	}
}
