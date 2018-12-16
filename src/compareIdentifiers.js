var numeric = /^[0-9]+$/

// TODO: Fix module name
export function compareIdentifiers (a, b) {
  var anum = numeric.test(a)
  var bnum = numeric.test(b)
  if (anum && bnum) {
    a = +a
    b = +b
  }
  return (anum && !bnum) ? -1
    : (bnum && !anum) ? 1
      : a < b ? -1
        : a > b ? 1
          : 0
}
