import moment from 'moment';
/**
 * Registers a cookie by passing name, value, and expiration date (in days).
 *
 * @method
 * @param {string} name The name of the cookie.
 * @param {string} value The value of the cookie.
 * @param {number} days The amount of days until the cookie expires.
 * @returns {string} The value of the cookie.
 */
const createCookie = (name, value, days) => {
  let expires = '';
  if (days) {
    const date = moment().add((days * 24 * 60 * 60 * 1000), 'ms');
    expires = `; expires=${date.utc().format('ddd, D MMM YYYY HH:mm:ss z')}`;
  }
  document.cookie = `${name}=${value}${expires}; path=/`;
  return value;
};
/**
 * Reads the value of a cookie by passing name and returns its value. Returns null if the cookie does not exist.
 *
 * @method
 * @param {string} name The name of the cookie.
 * @returns {string} The value of the cookie.
 */
const readCookie = (name) => {
  const nameEQ = `${name}=`;
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i += 1) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};
/**
 * Delete a cookie by passing name.
 *
 * @method
 * @param {string} name The name of the cookie.
 */
const eraseCookie = (name) => {
  this.createCookie(name, '', -1);
};

export {
  createCookie,
  readCookie,
  eraseCookie,
};
