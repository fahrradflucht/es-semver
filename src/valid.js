import { parse } from './parse'

export function valid (version, options) {
  var v = parse(version, options)
  return v ? v.version : null
}
