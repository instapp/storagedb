const isSupported = (storage) => {
	if (!storage || !(storage instanceof Object)) {
		return false
	}

	try {
		storage.setItem('_supported', '1')
		storage.removeItem('_supported')
		return true
	} catch (e) {
		return false
	}
}

export default isSupported
