/**
 * Queue Implementation using Array
 * FIFO (First In First Out)
 */

class Queue {
  constructor() {
    this.items = [];
  }

  /**
   * Enqueue an element to the queue
   * @param {*} element - Element to enqueue
   */
  enqueue(element) {
    this.items.push(element);
  }

  /**
   * Dequeue an element from the queue
   * @returns {*} - Dequeued element
   */
  dequeue() {
    if (this.items.length === 0) {
      return 'Queue is empty';
    }
    return this.items.shift();
  }

  /**
   * Peek at the front element without removing it
   * @returns {*} - Front element
   */
  peek() {
    if (this.items.length === 0) {
      return 'Queue is empty';
    }
    return this.items[0];
  }

  /**
   * Check if the queue is empty
   * @returns {boolean} - True if empty, false otherwise
   */
  isEmpty() {
    return this.items.length === 0;
  }

  /**
   * Get the size of the queue
   * @returns {number} - Size of the queue
   */
  size() {
    return this.items.length;
  }

  /**
   * Clear the queue
   */
  clear() {
    this.items = [];
  }

  /**
   * Print the queue
   */
  print() {
    console.log(this.items.toString());
  }
}

// Example usage
if (require.main === module) {
  const queue = new Queue();
  queue.enqueue(10);
  queue.enqueue(20);
  queue.enqueue(30);
  
  console.log('Queue:');
  queue.print();
  console.log('Front:', queue.peek());
  console.log('Dequeued:', queue.dequeue());
  queue.print();
}

module.exports = Queue;
