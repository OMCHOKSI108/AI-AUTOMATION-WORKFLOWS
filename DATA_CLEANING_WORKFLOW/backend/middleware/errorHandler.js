const errorHandler = (err, req, res, next) => {
    console.error('Error:', err);

    // Default error
    let error = {
        statusCode: err.statusCode || 500,
        message: err.message || 'Internal Server Error'
    };

    // PostgreSQL errors
    if (err.code === '23505') {
        error.statusCode = 400;
        error.message = 'Resource already exists';
    }

    if (err.code === '23503') {
        error.statusCode = 400;
        error.message = 'Referenced resource does not exist';
    }

    // Validation errors
    if (err.name === 'ValidationError') {
        error.statusCode = 400;
        error.message = err.message;
    }

    // JWT errors
    if (err.name === 'JsonWebTokenError') {
        error.statusCode = 401;
        error.message = 'Invalid token';
    }

    if (err.name === 'TokenExpiredError') {
        error.statusCode = 401;
        error.message = 'Token expired';
    }

    res.status(error.statusCode).json({
        error: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;