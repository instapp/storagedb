# StorageDB

[![npm](https://badge.fury.io/js/storagedb2.svg)](https://www.npmjs.com/package/storagedb2)
[![license](https://img.shields.io/npm/l/storagedb2.svg)](https://github.com/instapp/storagedb)

MongoDB-like API for HTML5 Storage (localStorage and sessionStorage)

> ***NOTICE***: The npm package name is '**storagedb2**'

## Features

- MongoDB-like API
- Lightweight, only ***3KB*** (minified and gzipped)
- No dependencies
- Easy configuration
- Well-supported query selectors (`$gt`,`$in`, ...) and options (`skip`, `limit`, `sort`)
- Automatically cache in memory

## Getting started

### Install

```bash
npm install --save storagedb2
```

Import storagedb to your project (ES6)
```js
import StorageDB from 'storagedb2'
```

Or add the script to your main HTML file
```html
<script src="./lib/storagedb.js"></script>
```

### Collection Supported methods

- [insert](#insert) `(docs)`
- [remove](#remove) `(query)`
- [update](#update) `(query, values, options)`
- [find](#find) `(query, options)`
- [findOne](#findOne) `(query, options)`
- [drop](#drop) `()`

## Usage

### Instantiate

```js
const db = new StorageDB({
    storage: window.localStorage,     // storage object, default is window.localStorage. If you want to store data in memory only, you can set it null
    database: 'testdb',               // database name, default is 'db'
    primaryKey: 'id'                  // primary key of collection, default is '_id'
})

// create collection (table) instance
const Users = db.get('users')
```

### insert

```js
Users.insert({
    id: 100,
    name: 'Elon',
    age: 12
})

Users.insert([{
    id: 101,
    name: 'Larry',
    age: 21
}, {
    id: 102,
    name: 'Sergey',
    age: 21
}])
```

### find

```js
Users.find([100, 102])

Users.find({
    name: /y$/,
    age: {
        $gte: 20
    }
}, {
    skip: 0,
    limit: 20,
    sort: {
        age: 1
    }
})
```

### find
```js
Users.findOne(102)

Users.findOne({
    age: {
        $ne: 21
    }
})
```

### update
```js
Users.update(100, {
    age: 47,
    company: 'The Avengers'
})

Users.update({
    age: 21
}, {
    age: 22
}, {
    multi: true
})
```

### remove
```js
Users.remove(101)

Users.remove({
    age: 21
})
```

### drop
```js
Users.drop()
```

## License

[MIT](http://opensource.org/licenses/MIT)
