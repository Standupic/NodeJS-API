export const notFound = (req, res) => {
    res.status(404).json({ error: 'Not Found' })
}

export const handleError = (err, req, res, next) => { 
    console.error(err)
    if (res.headersSent) return next(err)
    const statusCode = err.statusCode || 500
    const errorMessage = STATUS_CODES[statusCode] || 'Internal Error'
    res.status(statusCode).json({ error: errorMessage})
}