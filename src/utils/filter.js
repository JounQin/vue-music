import { leftPad } from './string'

export const formatSeconds = seconds =>
  leftPad(~~(seconds / 60), 2, 0) + ':' + leftPad(seconds % 60, 2, 0)
