class AppError extends Error{
    constructor(message,statusCode){
        //calling parents class constructor with arguments message(Error accepts message args only )
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;