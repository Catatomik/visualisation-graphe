/**
 * @description Queue class
 */
class Queue {

    /**
     * @description Construction of the queue
     */
    constructor() {
        this.head = new Stack()
        this.queue = new Stack()
    }

    /**
     * @description Length of the queue
     * @returns {Number}
     */
    get length() {
        return this.head.size
    }

    /**
     * @description Is the queue empty ?
     * @returns {Boolean}
     */
    get isEmpty() {
        return this.head.isEmpty && this.queue.isEmpty
    }

    /**
     * @description Append value to the queue
     * @param {Object} v Value to add to the queue
     * @returns {Queue}
     */
    enqueue(v) {
        this.queue.stack(v)
        this.head = this.queue.revert()
        return this
    }

    /**
     * @description Remove first value from the queue
     * @returns {Object}
     */
    dequeue() {
        if (this.head.isEmpty) throw new Error("Empty queue")
        const v = this.head.unstack()
        this.queue = this.head.revert()
        return v
    }

}