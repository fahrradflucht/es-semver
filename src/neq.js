import { compare } from './compare'

export function neq (a, b, loose) {
  return compare(a, b, loose) !== 0
}
