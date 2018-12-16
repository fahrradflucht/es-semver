import { compare } from './compare'

export function sort (list, loose) {
  return list.sort(function (a, b) {
    return compare(a, b, loose)
  })
}
