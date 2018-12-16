import { outside } from './outside'

// Determine if version is greater than all the versions possible in the range.
export function gtr (version, range, options) {
  return outside(version, range, '>', options)
}
