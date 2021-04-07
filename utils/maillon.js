/**
 * @description Class of chained array
 */
 class Link {

    static emptyLink = null

    /**
     * @description Construction of the first link
     * @param {Object} val Any type of data to link
     * @param {Link} next 
     */
    constructor(val, next = Link.emptyLink) {
        this._value = val
        this._next = next
    }

    /**
     * @description Get the value of this link
     * @returns {Object}
     */
    get value() {
        return this._value
    }

    /**
     * @description Get the next link of this chained array
     * @returns {Link}
     */
     get next() {
        return this._next
    }

    /**
     * @description Get depth of the link
     * @returns {Number}
     */
    get depth() {
        if (this._next == null) return 1
        return 1+this._next.depth
    }

    toArray() {
        if (!this._next || !(this._next instanceof Link)) return [this.value]
        let next = this._next.toArray()
        return [this.value, ...next]
    }

    toArrayReverted() {
        if (!this._next || !(this._next instanceof Link)) return [this.value]
        let next = this._next.toArray()
        return [...next, this.value]
    }

    *[Symbol.iterator]() {
        for (let el of this.toArray()) {
            yield el
        }
    }

    /**
     * @description Get the n(th) element of the link
     * @param {Number} n Index of the element to access to 
     */
    get(n) {
        if (n < 0) throw new Error("Invalid index")
        if (n == 0) return this.value
        if (this._next instanceof Link) return this._next.get(n-1)
        else throw new Error("Invalid index")
    }

    /**
     * @description Create chained array from array
     * @param {Array} array The array to convert into chained array
     */
    static fromArray(array = []) {
        let m = null
        for (let i = array.length-1; i >= 0; i--) {
            m = new this(array[i], m)
        }
        return m
    }

}

// const _link = Link
// /**
//  * @description Wrapper function for Link class
//  * @returns {Link}
//  */
// Link = function(...args) { return new _link(...args) }