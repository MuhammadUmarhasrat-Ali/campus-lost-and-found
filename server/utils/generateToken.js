import jwt from 'jsonwebtoken';

export const generateToken = (res, userId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret_for_development_campus_2026';
  const token = jwt.sign({ id: userId }, secret, {
    expiresIn: '7d',
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 100, // 7 days in ms (7 * 24 * 60 * 60 * 1000)
  };
  cookieOptions.maxAge = 7 * 24 * 60 * 60 * 1000;

  if (res && res.cookie) {
    res.cookie('jwt', token, cookieOptions);
  }

  return token;
};

export const clearTokenCookie = (res) => {
  if (res && res.cookie) {
    res.cookie('jwt', '', {
      httpOnly: true,
      expires: new Date(0),
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === 'production',
    });
  }
};

