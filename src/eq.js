import { compare } from './compare'

export function eq (a, b, loose) {
  return compare(a, b, loose) === 0
}
