class AppError extends Error{
    constructor(message,statusCode){
        //calling parents class constructor with arguments message(Error accepts message args only )
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        // ham jo error create kr re hai wo sab isOperatonal= true me hai....or yahi error ham client ko dikhayenge production mode me
        this.isOperational = true;
        Error.captureStackTrace(this, this.constructor)
    }
}

module.exports = AppError;