import { rcompare } from './rcompare'

export function rsort (list, loose) {
  return list.sort(function (a, b) {
    return rcompare(a, b, loose)
  })
}
