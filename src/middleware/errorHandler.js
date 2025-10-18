export const errorHandler = (err, req, res, next) => {
  if (err && typeof err.status === 'number') {
    return res.status(err.status).json({
      message: err.message || err.name || 'Error',
    });
  }

  const isProd = process.env.NODE_ENV === 'production';

  res.status(500).json({
    message: isProd ? 'Oops! Something went wrong' : err.message,
  });
};

// import { HttpError } from 'http-errors';

// export const errorHandler = (err, req, res, next) => {
//   if (err instanceof HttpError) {
//     return res.status(err.status).json({
//       message: err.message || err.name,
//     });
//   }

//   const isProd = process.env.NODE_ENV === 'production';

//   res.status(500).json({
//     message: isProd ? 'Oops! Something went wrong' : err.message,
//   });
// };
