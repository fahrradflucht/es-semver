import { outside } from './outside'

// Determine if version is less than all the versions possible in the range
export function ltr (version, range, options) {
  return outside(version, range, '<', options)
}
