function maxAverageRatio(classes: number[][], extraStudents: number): number {
  const getChange = (pass: number, total: number): number =>
    (pass + 1) / (total + 1) - pass / total;

  const pq = new PQ<{ pass; total; change }>((a, b) => b.change - a.change);

  for (const [pass, total] of classes) {
    pq.enqueue({ pass, total, change: getChange(pass, total) });
  }

  while (extraStudents--) {
    const item = pq.dequeue();
    item.change = getChange(++item.pass, ++item.total);
    pq.enqueue(item);
  }

  return (
    pq.toArray().reduce((sum, { pass, total }) => pass / total + sum, 0) /
    classes.length
  );
}

class PQ<T> {
  private heap: T[];
  private compare: (a: T, b: T) => number;

  constructor(compareFn: (a: T, b: T) => number) {
    this.heap = [];
    this.compare = compareFn;
  }

  private parent(i: number) {
    return Math.floor((i - 1) / 2);
  }
  private left(i: number) {
    return 2 * i + 1;
  }
  private right(i: number) {
    return 2 * i + 2;
  }

  enqueue(value: T) {
    this.heap.push(value);
    this.heapifyUp();
  }

  dequeue(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const root = this.heap[0];
    const last = this.heap.pop();
    if (this.heap.length > 0 && last !== undefined) {
      this.heap[0] = last;
      this.heapifyDown();
    }
    return root;
  }

  private heapifyUp() {
    let index = this.heap.length - 1;
    while (index > 0) {
      let parentIndex = this.parent(index);
      if (this.compare(this.heap[index], this.heap[parentIndex]) >= 0) break;
      [this.heap[index], this.heap[parentIndex]] = [
        this.heap[parentIndex],
        this.heap[index],
      ];
      index = parentIndex;
    }
  }

  private heapifyDown() {
    let index = 0;
    while (this.left(index) < this.heap.length) {
      let smallest = index;
      let left = this.left(index);
      let right = this.right(index);

      if (
        left < this.heap.length &&
        this.compare(this.heap[left], this.heap[smallest]) < 0
      ) {
        smallest = left;
      }
      if (
        right < this.heap.length &&
        this.compare(this.heap[right], this.heap[smallest]) < 0
      ) {
        smallest = right;
      }
      if (smallest === index) break;
      [this.heap[index], this.heap[smallest]] = [
        this.heap[smallest],
        this.heap[index],
      ];
      index = smallest;
    }
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  size(): number {
    return this.heap.length;
  }

  toArray(): T[] {
    return [...this.heap];
  }
}
