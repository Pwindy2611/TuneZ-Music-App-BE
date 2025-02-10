import crypto from 'crypto';
export const generateId = () => crypto.randomBytes(128).toString('base64');
