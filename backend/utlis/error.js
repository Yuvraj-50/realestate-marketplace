const error = (statusCode, errMes) => {
    const err = new Error();
    err.message = errMes;
    err.statusCode = statusCode
    return err;
}

module.exports = error;