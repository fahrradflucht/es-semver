import { debug } from './debug'

// Max safe segment length for coercion.
var MAX_SAFE_COMPONENT_LENGTH = 16

export var src = []
var R = 0

// The actual regexps go on re
export var re = []

// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
var NUMERICIDENTIFIER = R++
src[NUMERICIDENTIFIER] = '0|[1-9]\\d*'
var NUMERICIDENTIFIERLOOSE = R++
src[NUMERICIDENTIFIERLOOSE] = '[0-9]+'
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
var NONNUMERICIDENTIFIER = R++
src[NONNUMERICIDENTIFIER] = '\\d*[a-zA-Z-][a-zA-Z0-9-]*'
// ## Main Version
// Three dot-separated numeric identifiers.
var MAINVERSION = R++
src[MAINVERSION] =
  '(' +
  src[NUMERICIDENTIFIER] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIER] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIER] +
  ')'
var MAINVERSIONLOOSE = R++
src[MAINVERSIONLOOSE] =
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')\\.' +
  '(' +
  src[NUMERICIDENTIFIERLOOSE] +
  ')'
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
var PRERELEASEIDENTIFIER = R++
src[PRERELEASEIDENTIFIER] =
  '(?:' + src[NUMERICIDENTIFIER] + '|' + src[NONNUMERICIDENTIFIER] + ')'
var PRERELEASEIDENTIFIERLOOSE = R++
src[PRERELEASEIDENTIFIERLOOSE] =
  '(?:' + src[NUMERICIDENTIFIERLOOSE] + '|' + src[NONNUMERICIDENTIFIER] + ')'
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
var PRERELEASE = R++
src[PRERELEASE] =
  '(?:-(' +
  src[PRERELEASEIDENTIFIER] +
  '(?:\\.' +
  src[PRERELEASEIDENTIFIER] +
  ')*))'
var PRERELEASELOOSE = R++
src[PRERELEASELOOSE] =
  '(?:-?(' +
  src[PRERELEASEIDENTIFIERLOOSE] +
  '(?:\\.' +
  src[PRERELEASEIDENTIFIERLOOSE] +
  ')*))'
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
var BUILDIDENTIFIER = R++
src[BUILDIDENTIFIER] = '[0-9A-Za-z-]+'
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
var BUILD = R++
src[BUILD] =
  '(?:\\+(' + src[BUILDIDENTIFIER] + '(?:\\.' + src[BUILDIDENTIFIER] + ')*))'
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
export var FULL = R++
var FULLPLAIN =
  'v?' + src[MAINVERSION] + src[PRERELEASE] + '?' + src[BUILD] + '?'
src[FULL] = '^' + FULLPLAIN + '$'
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
var LOOSEPLAIN =
  '[v=\\s]*' +
  src[MAINVERSIONLOOSE] +
  src[PRERELEASELOOSE] +
  '?' +
  src[BUILD] +
  '?'
export var LOOSE = R++
src[LOOSE] = '^' + LOOSEPLAIN + '$'
var GTLT = R++
src[GTLT] = '((?:<|>)?=?)'
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
var XRANGEIDENTIFIERLOOSE = R++
src[XRANGEIDENTIFIERLOOSE] = src[NUMERICIDENTIFIERLOOSE] + '|x|X|\\*'
var XRANGEIDENTIFIER = R++
src[XRANGEIDENTIFIER] = src[NUMERICIDENTIFIER] + '|x|X|\\*'
var XRANGEPLAIN = R++
src[XRANGEPLAIN] =
  '[v=\\s]*(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIER] +
  ')' +
  '(?:' +
  src[PRERELEASE] +
  ')?' +
  src[BUILD] +
  '?' +
  ')?)?'
var XRANGEPLAINLOOSE = R++
src[XRANGEPLAINLOOSE] =
  '[v=\\s]*(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:\\.(' +
  src[XRANGEIDENTIFIERLOOSE] +
  ')' +
  '(?:' +
  src[PRERELEASELOOSE] +
  ')?' +
  src[BUILD] +
  '?' +
  ')?)?'
export var XRANGE = R++
src[XRANGE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAIN] + '$'
export var XRANGELOOSE = R++
src[XRANGELOOSE] = '^' + src[GTLT] + '\\s*' + src[XRANGEPLAINLOOSE] + '$'
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
export var COERCE = R++
src[COERCE] =
  '(?:^|[^\\d])' +
  '(\\d{1,' +
  MAX_SAFE_COMPONENT_LENGTH +
  '})' +
  '(?:\\.(\\d{1,' +
  MAX_SAFE_COMPONENT_LENGTH +
  '}))?' +
  '(?:\\.(\\d{1,' +
  MAX_SAFE_COMPONENT_LENGTH +
  '}))?' +
  '(?:$|[^\\d])'
// Tilde ranges.
// Meaning is "reasonably at or greater than"
var LONETILDE = R++
src[LONETILDE] = '(?:~>?)'
export var TILDETRIM = R++
src[TILDETRIM] = '(\\s*)' + src[LONETILDE] + '\\s+'
re[TILDETRIM] = new RegExp(src[TILDETRIM], 'g')
export var tildeTrimReplace = '$1~'
export var TILDE = R++
src[TILDE] = '^' + src[LONETILDE] + src[XRANGEPLAIN] + '$'
export var TILDELOOSE = R++
src[TILDELOOSE] = '^' + src[LONETILDE] + src[XRANGEPLAINLOOSE] + '$'
// Caret ranges.
// Meaning is "at least and backwards compatible with"
var LONECARET = R++
src[LONECARET] = '(?:\\^)'
export var CARETTRIM = R++
src[CARETTRIM] = '(\\s*)' + src[LONECARET] + '\\s+'
re[CARETTRIM] = new RegExp(src[CARETTRIM], 'g')
export var caretTrimReplace = '$1^'
export var CARET = R++
src[CARET] = '^' + src[LONECARET] + src[XRANGEPLAIN] + '$'
export var CARETLOOSE = R++
src[CARETLOOSE] = '^' + src[LONECARET] + src[XRANGEPLAINLOOSE] + '$'
// A simple gt/lt/eq thing, or just "" to indicate "any version"
export var COMPARATORLOOSE = R++
src[COMPARATORLOOSE] = '^' + src[GTLT] + '\\s*(' + LOOSEPLAIN + ')$|^$'
export var COMPARATOR = R++
src[COMPARATOR] = '^' + src[GTLT] + '\\s*(' + FULLPLAIN + ')$|^$'
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
export var COMPARATORTRIM = R++
src[COMPARATORTRIM] =
  '(\\s*)' + src[GTLT] + '\\s*(' + LOOSEPLAIN + '|' + src[XRANGEPLAIN] + ')'
// this one has to use the /g flag
re[COMPARATORTRIM] = new RegExp(src[COMPARATORTRIM], 'g')
export var comparatorTrimReplace = '$1$2$3'
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
export var HYPHENRANGE = R++
src[HYPHENRANGE] =
  '^\\s*(' +
  src[XRANGEPLAIN] +
  ')' +
  '\\s+-\\s+' +
  '(' +
  src[XRANGEPLAIN] +
  ')' +
  '\\s*$'
export var HYPHENRANGELOOSE = R++
src[HYPHENRANGELOOSE] =
  '^\\s*(' +
  src[XRANGEPLAINLOOSE] +
  ')' +
  '\\s+-\\s+' +
  '(' +
  src[XRANGEPLAINLOOSE] +
  ')' +
  '\\s*$'
// Star ranges basically just allow anything at all.
export var STAR = R++
src[STAR] = '(<|>)?=?\\s*\\*'

// Compile to actual regexp objects.
// All are flag-free, unless they were created above with a flag.
for (var i = 0; i < R; i++) {
  debug(i, src[i])
  if (!re[i]) {
    re[i] = new RegExp(src[i])
  }
}
