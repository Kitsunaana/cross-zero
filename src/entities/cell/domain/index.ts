export const getPosition = (position: string) => {
  const [row, column] = position.split("-")

  return {
    row: parseInt(row),
    column: parseInt(column),
  }
}
