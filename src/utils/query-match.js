import Operator from '../operator'
import isObject from './is-object'

const queryMatch = (query, target) => {
	if (!query || !Object.keys(query).length) {
		return true
	}

	for (let field of Object.keys(query)) {
		let val = query[field]
		let tar = target[field]

		if (val instanceof RegExp) {
			if (!val.test(tar)) {
				return false
			}
		} else if (isObject(val)) {
			for (let op of Object.keys(val)) {
				if (Operator._checkExist(op) && !Operator[op](val[op], tar)) {
					return false
				}
			}
		} else if (val !== tar) {
			return false
		}
	}

	return true
}

export default queryMatch
