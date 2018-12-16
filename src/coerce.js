import { COERCE, re } from './src'
import { parse } from './parse'
import { SemVer } from './semver'

export function coerce (version) {
  if (version instanceof SemVer) {
    return version
  }
  if (typeof version !== 'string') {
    return null
  }
  var match = version.match(re[COERCE])
  if (match == null) {
    return null
  }
  return parse(
    (match[1] || '0') + '.' + (match[2] || '0') + '.' + (match[3] || '0')
  )
}
