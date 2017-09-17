/*!
 * Created by Acathur.
 * (c) 2017 Instapp.
 * 
 * https://github.com/instapp/storagedb
 * Released under the MIT License.
 */
!function(e){function t(n){if(r[n])return r[n].exports;var i=r[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,t),i.l=!0,i.exports}var r={};t.m=e,t.c=r,t.d=function(e,r,n){t.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:n})},t.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return t.d(r,"a",r),r},t.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},t.p="",t(t.s=1)}([function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function(e){return e instanceof Object&&"Object"===e.constructor.name};t.default=n},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=r(2),u=function(e){return e&&e.__esModule?e:{default:e}}(a),StorageDB=function(){function StorageDB(e){n(this,StorageDB),e=e||{},this.storage=e.storage||window&&window.localStorage,this.database=e.database||"db",this.primaryKey=e.primaryKey||"_id",this.sep=e.sep||":"}return i(StorageDB,[{key:"get",value:function(e,t){return new u.default(this,e,t)}},{key:"collection",value:function(e,t){return this.get(e,t)}}]),StorageDB}();window&&(window.StorageDB=StorageDB),t.default=StorageDB},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}function i(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var a=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),u=r(3),o=n(u),l=r(0),f=n(l),s=r(4),c=n(s),h=r(6),y=n(h),Collection=function(){function Collection(e,t,r){i(this,Collection),r=r||{},this.name=t,this.storage=e.storage,this.path=e.database+e.sep+t+e.sep,this.primaryKey=r.primaryKey||e.primaryKey,this.cache=null,this.cacheable=!1}return a(Collection,[{key:"_initCache",value:function(){var e={},t=new RegExp("^"+this.path),r=!0,n=!1,i=void 0;try{for(var a,u=Object.keys(this.storage)[Symbol.iterator]();!(r=(a=u.next()).done);r=!0){var o=a.value;t.test(o)&&(e[o]=JSON.parse(this.storage.getItem(o)))}}catch(e){n=!0,i=e}finally{try{!r&&u.return&&u.return()}finally{if(n)throw i}}this.cache=e,this.cacheable=!0}},{key:"_filter",value:function(e,t){t.type=t.type||"data",t.multi=t.multi||!1,this.cacheable||this._initCache();var r=[],n=void 0,i="id"===t.type;if("string"==typeof e)e=new RegExp(e);else if("function"==typeof e)n=!0;else if(!e){var a=i?Object.keys(this.cache):Object.values(this.cache);return t.multi?a:a[0]||null}var u=!0,o=!1,l=void 0;try{for(var f,s=Object.keys(this.cache)[Symbol.iterator]();!(u=(f=s.next()).done);u=!0){var c=f.value,h=this.cache[c];if(n){if(e(c,h)){var y=i?c:h;if(!t.multi)return y;r.push(y)}}else if(e.test(c)){var v=i?c:h;if(!t.multi)return v;r.push(v)}}}catch(e){o=!0,l=e}finally{try{!u&&s.return&&s.return()}finally{if(o)throw l}}return t.multi?r:null}},{key:"insert",value:function(e,t){var r=e instanceof Array;if(r){if(0===e.length)return[]}else e=[e];var n=this.primaryKey,i=this.cacheable,a=!0,u=!1,l=void 0;try{for(var s,c=e[Symbol.iterator]();!(a=(s=c.next()).done);a=!0){var h=s.value;if(!(0,f.default)(h))throw new Error("TypeError: insert data must be an object or an object array");void 0===h[n]&&(h[n]=(new o.default).toString()),i&&(this.cache[this.path+h[n]]=h),this.storage.setItem(this.path+h[n],JSON.stringify(h))}}catch(e){u=!0,l=e}finally{try{!a&&c.return&&c.return()}finally{if(u)throw l}}return r?e:e[0]}},{key:"find",value:function(e,t){e=e||{},t=t||{},t.skip=t.skip||0,t.limit=t.limit,t.sort=t.sort,t.sort instanceof Array&&(t.sort=t.sort.reduce(function(e,t){return"string"==typeof t?e[t]=1:t instanceof Array&&t.length&&(e[t[0]]=t[1]||1),e},{}));var r=void 0,n=(0,f.default)(e)?null:e instanceof Array?e:[e],i={type:t._filterType||"data",multi:!0};if(n){var a=new RegExp("^"+this.path+"("+n.join("|")+")$");r=this._filter(a,i)}else r=Object.keys(e).length?this._filter(function(t,r){return(0,c.default)(e,r)},i):this._filter(null,i);return t.sort&&r.sort(function(e,r){return(0,y.default)(t.sort,e,r)}),t.limit?r=r.slice(t.skip,t.skip+t.limit):t.skip&&(r=r.slice(t.skip)),r}},{key:"findOne",value:function(e,t){e=e||{},t=t||{};var r=void 0,n=(0,f.default)(e)?null:e,i=e?Object.keys(e):[],a=!1,u={type:t._filterType||"data",multi:!1};if(i.length&&i.includes(this.primaryKey)&&(n=e[this.primaryKey],a=!0),n){if(r=this.storage.getItem(this.path+n),(r=r?JSON.parse(r):null)&&a&&!(0,c.default)(e,r))return null}else r=i.length?this._filter(function(t,r){return(0,c.default)(e,r)},u):this._filter(null,u);return r}},{key:"remove",value:function(e,t){if(!e)throw new Error("remove needs a query");t=t||{},t.multi=void 0===t.multi||t.multi;var r=t.multi?"find":"findOne",n=this[r](e,{_filterType:"id"}),i=this.cacheable;if(t.mulit&&!n.length||!t.mulit&&!n)return 0;t.multi||(n=[n]);var a=!0,u=!1,o=void 0;try{for(var l,f=n[Symbol.iterator]();!(a=(l=f.next()).done);a=!0){var s=l.value;i&&delete this.cache[s],this.storage.removeItem(s)}}catch(e){u=!0,o=e}finally{try{!a&&f.return&&f.return()}finally{if(u)throw o}}return n.length}},{key:"update",value:function(e,t,r){if(!e)throw new Error("update needs a query");if(!t||!(0,f.default)(t))throw new Error("update needs an object");r=r||{},r.multi=void 0!==r.multi&&r.multi;var n=r.multi?"find":"findOne",i=this[n](e,{_filterType:"id"}),a=this.primaryKey,u=this.cacheable;if(r.mulit&&!i.length||!r.mulit&&!i)return 0;if(r.multi){if(delete t[a],!Object.keys(t).length)return 0;var o=!0,l=!1,s=void 0;try{for(var c,h=i[Symbol.iterator]();!(o=(c=h.next()).done);o=!0){var y=c.value,v=u?this.cache[y]:JSON.parse(this.storage.getItem(y)),d=Object.assign({},v,t);u&&(this.cache[y]=d),this.storage.setItem(y,JSON.stringify(d))}}catch(e){l=!0,s=e}finally{try{!o&&h.return&&h.return()}finally{if(l)throw s}}return i.length}var p=i,m=u?this.cache[p]:JSON.parse(this.storage.getItem(p)),b=t[a]&&t[a]!==m[a],g=b?this.path+t[a]:p;if(b&&this.findOne(t[a]))throw new Error("Duplicate value '"+t[a]+"' for unique field '"+a+"'");var w=Object.assign({},m,t);return u&&(this.cache[g]=w,b&&delete this.cache[p]),this.storage.setItem(g,JSON.stringify(w)),b&&this.storage.removeItem(p),w}},{key:"drop",value:function(){return this.remove({}),!0}}]),Collection}();t.default=Collection},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=function(){function e(){n(this,e)}return i(e,[{key:"toString",value:function(){return((new Date).getTime()/1e3).toString(16).substr(-4)+Math.random().toString(16).substr(2,12)}}]),e}();t.default=a},function(e,t,r){"use strict";function n(e){return e&&e.__esModule?e:{default:e}}Object.defineProperty(t,"__esModule",{value:!0});var i=r(5),a=n(i),u=r(0),o=n(u),l=function(e,t){if(!e||!Object.keys(e).length)return!0;var r=!0,n=!1,i=void 0;try{for(var u,l=Object.keys(e)[Symbol.iterator]();!(r=(u=l.next()).done);r=!0){var f=u.value,s=e[f],c=t[f];if(s instanceof RegExp){if(!s.test(c))return!1}else if((0,o.default)(s)){var h=!0,y=!1,v=void 0;try{for(var d,p=Object.keys(s)[Symbol.iterator]();!(h=(d=p.next()).done);h=!0){var m=d.value;if(a.default._checkExist(m)&&!a.default[m](s[m],c))return!1}}catch(e){y=!0,v=e}finally{try{!h&&p.return&&p.return()}finally{if(y)throw v}}}else if(s!==c)return!1}}catch(e){n=!0,i=e}finally{try{!r&&l.return&&l.return()}finally{if(n)throw i}}return!0};t.default=l},function(e,t,r){"use strict";function n(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(t,"__esModule",{value:!0});var i=function(){function e(e,t){for(var r=0;r<t.length;r++){var n=t[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,r,n){return r&&e(t.prototype,r),n&&e(t,n),t}}(),a=["$eq","$gt","$gte","$in","$lt","$lte","$ne","$nin"],u=function(e){return"number"!=typeof e},o=function(){function e(){n(this,e)}return i(e,null,[{key:"$eq",value:function(e,t){return t===e}},{key:"$gt",value:function(e,t){if(u(e))throw new Error("'$gt' value must be a number");return t>e}},{key:"$gte",value:function(e,t){if(u(e))throw new Error("'$gte' value must be a number");return t>=e}},{key:"$in",value:function(e,t){if(!(e instanceof Array))throw new Error("'$in' value must be an array");return e.includes(t)}},{key:"$lt",value:function(e,t){if(u(e))throw new Error("'$lt' value must be a number");return t<e}},{key:"$lte",value:function(e,t){if(u(e))throw new Error("'$lte' value must be a number");return t<=e}},{key:"$ne",value:function(e,t){return t!==e}},{key:"$nin",value:function(e,t){if(!(e instanceof Array))throw new Error("'$nin' value must be an array");return!e.includes(t)}},{key:"_checkExist",value:function(e){if(a.includes(e))return!0;throw new Error("unknown operator: '"+e+"'")}}]),e}();t.default=o},function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var n=function e(t,r,n,i,a){i=i||0,a=a||Object.keys(t);var u=a[i];return u?r[u]===n[u]?(i++,e(t,r,n,i,a)):1===t[u]?r[u]-n[u]:-1===t[u]?n[u]-r[u]:void 0:0};t.default=n}]);