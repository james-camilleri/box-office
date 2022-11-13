// Based off https://bost.ocks.org/mike/shuffle,
// from https://stackoverflow.com/a/2450976
export function shuffle<T>(array: T[]): T[] {
  let currentIndex = array.length
  let randomIndex: number

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex--

    // And swap it with the current element.
    ;[array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]]
  }

  return array
}
