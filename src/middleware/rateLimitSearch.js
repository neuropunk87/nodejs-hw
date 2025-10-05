import rateLimit from 'express-rate-limit';

export const searchRateLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many search requests. Please slow down.',
  },
  // keyGenerator: (req) => {
  //   // userId ...
  //   return req.ip;
  // },
  skip: (req) => {
    const { search, tag } = req.query;
    return !search && !tag;
  },
});
