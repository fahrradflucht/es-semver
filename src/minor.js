import { SemVer } from './semver'

export function minor (a, loose) {
  return new SemVer(a, loose).minor
}
