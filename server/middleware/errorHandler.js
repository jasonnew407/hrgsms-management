const errorHandler = (err, req, res, next) => {
  // Log the actual error to console
  console.error('=== ERROR HANDLER ===');
  console.error('Error Name:', err.name);
  console.error('Error Message:', err.message);
  console.error('Original Error:', err.original); // This is the key for Sequelize!
  console.error('Stack:', err.stack);
  console.error('===================');

  let error = { 
    message: err.message || 'Internal Server Error',
    statusCode: err.statusCode || 500
  };

  // Sequelize errors
  if (err.name === 'SequelizeValidationError') {
    error.message = 'Validation Error';
    error.details = err.errors.map(e => e.message);
    error.statusCode = 400;
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    error.message = 'Duplicate entry';
    error.statusCode = 400;
  }

  if (err.name === 'SequelizeDatabaseError') {
    // Show the actual SQL error in development
    error.message = process.env.NODE_ENV === 'development' 
      ? err.original?.message || err.message 
      : 'Database error';
    error.statusCode = 500;
    
    // Add SQL details in development
    if (process.env.NODE_ENV === 'development' && err.original) {
      error.sqlError = {
        code: err.original.code,
        errno: err.original.errno,
        sqlMessage: err.original.sqlMessage,
        sql: err.sql
      };
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error.message = 'Invalid token';
    error.statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    error.message = 'Token expired';
    error.statusCode = 401;
  }

  // Cast errors (like invalid ID)
  if (err.name === 'CastError') {
    error.message = 'Invalid ID format';
    error.statusCode = 400;
  }

  // Response
  res.status(error.statusCode).json({
    success: false,
    error: error.message,
    ...(error.details && { details: error.details }),
    ...(error.sqlError && { sqlError: error.sqlError }),
    ...(true && { stack: err.stack })
  });
};

export default errorHandler;