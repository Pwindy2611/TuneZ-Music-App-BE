import crypto from 'crypto';

const SECRET = 'TuneZ-REST-API';

export const random = () => crypto.randomBytes(128).toString('base64');
export const authentication = (salt: string, password: string) => {
    return crypto.createHmac('sha256', [salt, password].join('/')).update(SECRET).digest('hex');
}

export const generateOtp = () => {
     // Random OTP
    return crypto.randomInt(100000, 999999).toString();
};