import CryptoJS from 'crypto-js';
import PBKDF2 from 'crypto-js/pbkdf2';

export function randomString(len = 5) {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < len; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

/**
 * use PBKDF2 to generate a cryptographic key from the password with 10k iterations and a salt
 * @param password password to stretch
 * @param salt salt
 */
export function stretchKey(password, salt) {
  return PBKDF2(password, salt, { iterations: 10000 }).toString();
}

export function encodeData(data, password) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), password).toString();
}

export function decodeData(data, password) {
  try {
    const bytes = CryptoJS.AES.decrypt(data, password);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  catch (err) {
    return null;
  }
}