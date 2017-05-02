import {leftPad} from 'utils'

function darkenColor(col, amt) {
  let usePound = false

  if (col[0] === '#') {
    col = col.slice(1)
    usePound = true
  }

  const num = parseInt(col, 16)

  let r = (num >> 16) + amt

  if (r > 255) r = 255
  else if (r < 0) r = 0

  let g = (num & 0x0000FF) + amt

  if (g > 255) g = 255
  else if (g < 0) g = 0

  let b = ((num >> 8) & 0x00FF) + amt

  if (b > 255) b = 255
  else if (b < 0) b = 0

  return (usePound ? '#' : '') + leftPad((g | (b << 8) | (r << 16)).toString(16), 6, 0)
}

const cache = {}

const getStyle = async color => {
  if (cache[color]) return cache[color]

  const isCustom = color.startsWith('#')

  const text = (await import(`styles/theme-${isCustom ? 'custom' : color}`)).toString()

  let result

  if (isCustom) {
    const darkerColor = darkenColor(color, 10)
    result = text.replace(/\$theme-color(-darker)?/g, (match, $0) => $0 ? darkerColor : color)
  } else {
    result = text
  }

  return (cache[color] = result)
}

export default async ({context, theme}) => {
  const result = await getStyle(theme)

  if (__SERVER__) {
    (context._styles || (context._styles = {}))[theme] = {
      ids: [theme],
      css: result
    }
    return
  }

  const style = document.createElement('style')
  style.textContent = result
  document.getElementsByTagName('head')[0].appendChild(style)
}
