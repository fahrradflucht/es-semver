import { compare } from './compare'

export function gt (a, b, loose) {
  return compare(a, b, loose) > 0
}
