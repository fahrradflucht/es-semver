import { compare } from './compare'

export function lt (a, b, loose) {
  return compare(a, b, loose) < 0
}
