module.exports = class GroupHandler {
	constructor(){
		this.all = []
		this.mappings = {}
		this.pairings = []
		this.unpairings = []
	}

	/**
	 * Add a mapping to the internal DB
	 * @param id
	 * @param mapping
	 * @returns {GroupHandler}
	 */
	addMapping(id, mapping){
		if (!Array.isArray(mapping)){
			mapping = [mapping]
		}

		this.mappings[id] = mapping
		for (let map of mapping){
			if (this.all.indexOf(map) === -1){
				this.all.push(map)
			}
		}

		return this
	}
}