import { compare } from './compare'

export function compareLoose (a, b) {
  return compare(a, b, true)
}
