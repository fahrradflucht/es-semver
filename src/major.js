import { SemVer } from './semver'

export function major (a, loose) {
  return new SemVer(a, loose).major
}
