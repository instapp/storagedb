class ID {
	constructor() {
	}

	toString() {
		return (new Date().getTime()/1000).toString(16).substr(-4) + Math.random().toString(16).substr(2, 12)
	}
}

export default ID
