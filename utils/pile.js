/**
 * @description Stack class
 */
class Stack {

    static emptyStack = null
    
    /**
     * @description Construction of the stack
     * @param {Object} val Initial value to add to the stack
     */
    constructor(val) {
        this._content = Stack.emptyStack
        this.size = 0
        if (val != undefined) {
            this._content = new Link(val)
            this.size = 1
        }
    }

    /**
     * @description Get content of this stack
     * @returns {Link}
     */
    get content() {
        return this._content
    }

    /**
     * @description Is the stack empty ?
     * @returns {boolean}
     */
    get isEmpty() {
        return this.size == 0
    }

    /**
     * @description
     * @param {Object} val Data to add to the stack
     * @returns {Stack} The stack with newly added value
     */
    stack(val) {
        this._content = new Link(val, this.content)
        this.size++
        return this
    }

    /**
     * @description Remove top element of the stack
     * @returns {Object} Removed element on the top of the stack
     */
    unstack() {
        if (this.isEmpty) throw new Error("Empty stack")
        const Link = this.content
        this._content = this.content.next
        this.size--
        return Link.value
    }

    /**
     * @description Get the top of the stack
     * @returns {Object} Value of the top of the stack
     */
    get top() {
        if (this.isEmpty) throw new Error("Empty stack")
        return this.content.value
    }

    /**
     * @description Empty the stack
     * @returns {Stack} The empty stack
     */
    empty() {
        this._content = null
        this.size = 0
        return this
    }

    /**
     * @description Revert the stack
     * @returns {Stack} The reverted stack
     */
    revert() {
        if (this.isEmpty) return this
        this._content = Link.fromArray(this.content.toArrayReverted())
        return this
    }

    /**
     * @description Convert stack to array
     * @returns {Array} Converted stack into array
     */
    toArray() {
        if (this.isEmpty) throw new Error("Empty stack")
        return this.content.toArray()
    }

    /**
     * @description Convert reverted stack to array
     * @returns {Array} Converted, reverted stack into array
     */
    toArrayReverted() {
        if (this.isEmpty) throw new Error("Empty stack")
        return this.content.toArrayReverted()
    }

    *[Symbol.iterator]() {
        for (let el of this.toArray()) {
            yield el
        }
    }

    /**
     * @description Get the n(th) element of the stack
     * @param {Number} n Index of the element to access to 
     */
    get(n) {
        if (this.isEmpty) throw new Error("Empty stack")
        return this.content.get(n)
    }

    /**
     * @description Create stack from array
     * @param {Array} array The array to convert into stack
     */
    static fromArray(array = []) {
        let s = new Stack()
        for (let i = array.length-1; i >= 0; i--) {
            s.stack(array[i])
        }
        return s
    }

}

// const _pile = Stack
// /**
//  * @description Wrapper function for Stack class
//  * @returns {Stack}
//  */
// Stack = function(...args) { return new _pile(...args) }