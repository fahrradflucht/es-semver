import { compare } from './compare'

export function rcompare (a, b, loose) {
  return compare(b, a, loose)
}
