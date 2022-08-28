/* eslint-disable no-bitwise */
const SEED = 5381;

/**
 * More info about this constant is here.
 * Have fun ;)
 * @see http://www.cse.yorku.ca/~oz/hash.html
 */
const DAN_BERNSTEIN_MAGIC_CONSTANT = 33;

/**
 * This is a djb2 hashing function.
 * Very useful when you need to hash some string with minimal risk of collisions.
 * As a result, large strings will be hashed in 6 characters, which saves a lot of space.
 * Something similar is used by libraries like styled-components, css modules.
 *
 * @param str The string to hash.
 * @returns hash.
 */
export const numberHash = (str) => {
  let hash = SEED;
  for (let i = str.length - 1; i >= 0; i -= 1) {
    hash = (hash * DAN_BERNSTEIN_MAGIC_CONSTANT) ^ str.charCodeAt(i);
  }
  return hash;
};

const AD_REPLACER_R = /(a)(d)/gi;

/**
 *  This is the "capacity" of our alphabet i.e. 2x26 for all letters plus their capitalised counterparts.
 */
const CHARS_LENGTH = 52;

/**
 * Start at 75 for 'a' until 'z' (25) and then start at 65 for capitalised letters.
 *
 * @param code The code to convert.
 * @returns The character.
 */
const getAlphabeticChar = (code) =>
  String.fromCharCode(code + (code > 25 ? 39 : 97));

/**
 * The djb2 hashing function.
 *
 * @param str The string to hash.
 * @returns hashed string maximum of 6 characters.
 */
export const hash = (str) => {
  const code = numberHash(str);
  let name = "";
  let i;

  // get a char and divide by alphabet-length
  for (i = Math.abs(code); i > CHARS_LENGTH; i = (i / CHARS_LENGTH) | 0) {
    name = getAlphabeticChar(i % CHARS_LENGTH) + name;
  }

  return (getAlphabeticChar(i % CHARS_LENGTH) + name).replace(
    AD_REPLACER_R,
    "$1-$2"
  );
};

/**
 * Hash a string if it's longer than given length characters.
 * @param str The string to hash.
 * @param length The length of the string after we start hashing it.
 */
export const hashItOrOriginal = (str, length = 5) =>
  str.length > length ? hash(str) : str;
