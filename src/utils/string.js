export const leftPad = (str, num, ch) => {
  str = str.toString()

  if (num == null) return str

  if (ch === 0) {
    ch = '0'
  } else if (ch) {
    ch = ch.toString()
  } else {
    ch = ' '
  }

  return ch.repeat(num - str.length) + str
}
