declare global {
  interface Array<T> {
    replace: (index: number, item: T) => T[]
  }
}

Array.prototype.replace = function (index, item) {
  const first = this.slice(0, index)
  const second = this.slice(index + 1, this.length)

  return [...first, item, ...second]
}

export const create2DArray = (size) => {
  return Array
    .from({ length: size }, (_, i) => i)
    .map((row) => Array.from({ length: size }, (_, column) => ({
      id: `${row}-${column}`,
      player: null
    })))
}
