import { compare } from './compare'

export function gte (a, b, loose) {
  return compare(a, b, loose) >= 0
}
