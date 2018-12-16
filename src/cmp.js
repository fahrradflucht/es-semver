import { gt } from './gt'
import { lt } from './lt'
import { eq } from './eq'
import { neq } from './neq'
import { gte } from './gte'
import { lte } from './lte'

export function cmp (a, op, b, loose) {
  var ret
  switch (op) {
    case '===':
      if (typeof a === 'object') { a = a.version }
      if (typeof b === 'object') { b = b.version }
      ret = a === b
      break
    case '!==':
      if (typeof a === 'object') { a = a.version }
      if (typeof b === 'object') { b = b.version }
      ret = a !== b
      break
    case '':
    case '=':
    case '==':
      ret = eq(a, b, loose)
      break
    case '!=':
      ret = neq(a, b, loose)
      break
    case '>':
      ret = gt(a, b, loose)
      break
    case '>=':
      ret = gte(a, b, loose)
      break
    case '<':
      ret = lt(a, b, loose)
      break
    case '<=':
      ret = lte(a, b, loose)
      break
    default: throw new TypeError('Invalid operator: ' + op)
  }
  return ret
}
