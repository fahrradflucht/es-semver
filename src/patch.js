import { SemVer } from './semver'

export function patch (a, loose) {
  return new SemVer(a, loose).patch
}
