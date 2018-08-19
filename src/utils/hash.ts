// https://ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
import * as crypto from 'crypto';

interface IHash {
    passwordHash: string;
    salt: string;
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
const genRandomString = function (length: number) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);
    /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
const sha512 = function (password: string, salt: string): IHash {
    const hash = crypto.createHmac('sha512', salt);
    /** Hashing algorithm sha512 */
    hash.update(password);
    const value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

/**
 * hash password with sha512.
 * @function
 * @param {string} userPassword - password.
 */
const hashPassword = (userPassword: string): IHash => {
    const salt = genRandomString(32);
    return sha512(userPassword, salt);
};

const checkPassword = (userPassword: string, passwordHash: string, salt: string): boolean => {
    const passwordData = sha512(userPassword, salt);
    return passwordData.passwordHash === passwordHash;
};

export {hashPassword, checkPassword};