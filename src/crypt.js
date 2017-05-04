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

export function stretchKey(password, salt) {
  return PBKDF2(password, salt).toString();
}

export function encodeData(data, password, salt = '') {
  return CryptoJS.AES.encrypt(JSON.stringify(data), stretchKey(password, salt)).toString();
}

export function decodeData(data, password, salt = '') {


  try {
    const bytes = CryptoJS.AES.decrypt(data, stretchKey(password, salt));
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  }
  catch (err) {
    return null;
  }
}