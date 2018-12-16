import { SemVer } from './semver'

export function compare (a, b, loose) {
  return new SemVer(a, loose).compare(new SemVer(b, loose))
}
