import { SemVer } from './semver'
import { LOOSE, FULL, re } from './src'
import { MAX_LENGTH } from './constants'

export function parse (version, options) {
  if (!options || typeof options !== 'object') {
    options = { loose: !!options, includePrerelease: false }
  }
  if (version instanceof SemVer) {
    return version
  }
  if (typeof version !== 'string') {
    return null
  }
  if (version.length > MAX_LENGTH) {
    return null
  }
  var r = options.loose ? re[LOOSE] : re[FULL]
  if (!r.test(version)) {
    return null
  }
  try {
    return new SemVer(version, options)
  } catch (er) {
    return null
  }
}
