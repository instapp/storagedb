const isObject = (object) => {
	return object instanceof Object && object.constructor.name === 'Object'
}

export default isObject
