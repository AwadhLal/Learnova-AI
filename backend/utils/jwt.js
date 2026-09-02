import jwt from 'jsonwebtoken';

export const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'learnova_jwt_secret_key_super_secure_2026_!@#', {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};
