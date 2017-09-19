import ID from './id'
import MockStorage from './mock-storage'
import isObject from './utils/is-object'
import queryMatch from './utils/query-match'
import sortCompare from './utils/sort-compare'

class Collection {
	constructor (db, name, opts) {
		opts = opts || {}

		this.name = name
		this.storage = db.storage || new MockStorage()
		this.path = db.database + db.sep + name + db.sep
		this.primaryKey = opts.primaryKey || db.primaryKey
		this.cache = {}
		this.cacheable = !db.storage
	}


	_initCache () {
		let cache = {}
		let filterExp = new RegExp('^' + this.path)

		for (let key of Object.keys(this.storage)) {
			if (filterExp.test(key)) {
				cache[key] = JSON.parse(this.storage.getItem(key))
			}
		}

		this.cache = cache
		this.cacheable = true
	}


	_filter (filter, opts) {
		opts.type = opts.type || 'data' // data, id
		opts.multi = opts.multi || false

		if (!this.cacheable) {
			this._initCache()
		}

		let res = []
		let isFnFilter
		let isTypeId = opts.type === 'id'

		if (typeof filter === 'string') {
			filter = new RegExp(filter)
		} else if (typeof filter === 'function') {
			isFnFilter = true
		} else if (!filter) {
			let ret = isTypeId ? Object.keys(this.cache) : Object.values(this.cache)

			if (opts.multi) {
				return ret
			} else {
				return ret[0] || null
			}
		}

		for (let key of Object.keys(this.cache)) {
			let val = this.cache[key]

			if (isFnFilter) {
				if (filter(key, val)) {
					let ret = isTypeId ? key : val

					if (opts.multi) {
						res.push(ret)
					} else {
						return ret
					}
				}
			} else {
				if (filter.test(key)) {
					let ret = isTypeId ? key : val

					if (opts.multi) {
						res.push(ret)
					} else {
						return ret
					}
				}
			}
		}

		return opts.multi ? res : null
	}


	insert (data, opts) {
		let arrayInsert = data instanceof Array

		if (arrayInsert) {
			if (data.length === 0) {
				return []
			}
		} else {
			data = [data]
		}

		let pk = this.primaryKey
		let cacheable = this.cacheable

		for (let row of data) {
			if (!isObject(row)) {
				throw new Error('TypeError: insert data must be an object or an object array')
			}

			if (typeof row[pk] === 'undefined') {
				row[pk] = new ID().toString()
			}

			if (cacheable) {
				this.cache[this.path + row[pk]] = row
			}

			this.storage.setItem(this.path + row[pk], JSON.stringify(row))
		}

		return arrayInsert ? data : data[0]
	}


	find (query, opts) {
		query = query || {}
		opts = opts || {}
		opts.skip = opts.skip || 0
		opts.limit = opts.limit
		opts.sort = opts.sort

		if (opts.sort instanceof Array) {
			opts.sort = opts.sort.reduce((res, item) => {
				if (typeof item === 'string') {
					res[item] = 1
				} else if (item instanceof Array && item.length) {
					res[item[0]] = item[1] || 1
				}
				return res
			}, {})
		}

		let data
		let ids = isObject(query) ? null : (query instanceof Array ? query : [query])
		let filterOpts = {
			type: opts._filterType || 'data',
			multi: true
		}

		if (ids) {
			// by id array
			let filterRegExp = new RegExp('^' + this.path + '(' + ids.join('|') + ')$')
			data = this._filter(filterRegExp, filterOpts)

		} else if (Object.keys(query).length) {
			// by query
			data = this._filter((key, val) => {
				return queryMatch(query, val)
			}, filterOpts)
		} else {
			data = this._filter(null, filterOpts)
		}

		// sort
		if (opts.sort) {
			data.sort((a, b) => {
				return sortCompare(opts.sort, a, b)
			})
		}

		if (opts.limit) {
			data = data.slice(opts.skip, opts.skip + opts.limit)
		} else if (opts.skip) {
			data = data.slice(opts.skip)
		}

		return data
	}


	findOne (query, opts) {
		query = query || {}
		opts = opts || {}

		let data
		let id = isObject(query) ? null : query
		let queryFields = (query) ? Object.keys(query) : []
		let quickTarget = false
		let needsSort = !!opts.sort
		let filterOpts = {
			type: opts._filterType || 'data',
			multi: false
		}

		if (queryFields.length && queryFields.includes(this.primaryKey)) {
			id = query[this.primaryKey]
			quickTarget = true
		}

		if (id) {
			// by id
			data = this.storage.getItem(this.path + id)
			data = data ? JSON.parse(data) : null

			if (data && quickTarget && !queryMatch(query, data)) {
				return null
			}

		} else if (queryFields.length) {
			// by query
			if (needsSort) {
				data = this.find(query, opts)
			} else {
				data = this._filter((key, val) => {
					return queryMatch(query, val)
				}, filterOpts)
			}
		} else {
			if (needsSort) {
				data = this.find(query, opts)
			} else {
				data = this._filter(null, filterOpts)
			}
		}

		if (!id && needsSort && data) {
			data = data[0] || null
		}

		return data
	}


	remove (query, opts) {
		if (!query) {
			throw new Error('remove needs a query')
		}

		opts = opts || {}
		opts.multi = (typeof opts.multi === 'undefined') ? true : opts.multi

		let findMethod = opts.multi ? 'find' : 'findOne'
		let ids = this[findMethod](query, {
			_filterType: 'id'
		})
		let cacheable = this.cacheable

		if ((opts.mulit && !ids.length) || (!opts.mulit && !ids)) {
			return 0
		}

		if (!opts.multi) {
			ids = [ids]
		}

		for (let id of ids) {
			if (cacheable) {
				delete this.cache[id]
			}

			this.storage.removeItem(id)
		}

		return ids.length
	}


	update (query, values, opts) {
		if (!query) {
			throw new Error('update needs a query')
		}
		if (!values || !isObject(values)) {
			throw new Error('update needs an object')
		}

		opts = opts || {}
		opts.multi = (typeof opts.multi === 'undefined') ? false : opts.multi

		let findMethod = opts.multi ? 'find' : 'findOne'
		let ids = this[findMethod](query, {
			_filterType: 'id'
		})
		let pk = this.primaryKey
		let cacheable = this.cacheable

		if ((opts.mulit && !ids.length) || (!opts.mulit && !ids)) {
			return 0
		}

		if (!opts.multi) {
			let id = ids
			let row = cacheable ? this.cache[id] : JSON.parse(this.storage.getItem(id))
			let isIdUpdated = values[pk] && values[pk] !== row[pk]
			let newId = isIdUpdated ? this.path + values[pk] : id

			// check exist
			if (isIdUpdated && this.findOne(values[pk])) {
				throw new Error('Duplicate value \''+ values[pk] + '\' for unique field \'' + pk + '\'')
			}

			let data = Object.assign({}, row, values)

			if (cacheable) {
				this.cache[newId] = data
				if (isIdUpdated) {
					delete this.cache[id]
				}
			}

			this.storage.setItem(newId, JSON.stringify(data))

			if (isIdUpdated) {
				this.storage.removeItem(id)
			}

			return data

		} else {
			delete values[pk]

			if (!Object.keys(values).length) {
				return 0
			}

			for (let id of ids) {
				let row = cacheable ? this.cache[id] : JSON.parse(this.storage.getItem(id))
				let data = Object.assign({}, row, values)

				if (cacheable) {
					this.cache[id] = data
				}

				this.storage.setItem(id, JSON.stringify(data))
			}

			return ids.length
		}
	}

	drop() {
		this.remove({})
		return true
	}
}

export default Collection
