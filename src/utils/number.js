export const toNum = (numText, trans = true) => {
  if (!numText) return trans ? 0 : numText

  numText = numText.toString().trim()
  const isNegative = numText.indexOf('-') === 0

  numText = numText.replace(/[^\d.]/g, '')
  const pointIndex = numText.indexOf('.')
  numText = numText.replace(/\./g, '')

  if (pointIndex !== -1 && pointIndex !== numText.length) {
    const arr = numText.split('')
    arr.splice(pointIndex, 0, '.')
    numText = arr.join('')
  }

  numText = numText && isNegative ? `-${numText}` : numText

  return trans ? +numText : numText
}
