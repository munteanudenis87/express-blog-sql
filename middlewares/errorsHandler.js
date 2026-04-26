function errorsHandler(err, req, res, next) {
    // ritorniamo il codice di risposta corretto
    res.status(500)

    // ritorniamo il messaggio dell'errore catturato dall'oggetto err
    res.json({
        error: err.message,
    });
};

module.exports = errorsHandler;