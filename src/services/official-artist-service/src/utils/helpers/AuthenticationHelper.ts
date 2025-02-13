import crypto from 'crypto';
export const generateId = () => crypto.randomBytes(16).toString('hex');