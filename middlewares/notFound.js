function notFound(req, res, next) {
    // restituiamo il codice corretto per questa situazione
    res.status(404)

    // restituiamo un messaggio di errore appropiato
    res.json({
        error: "Not Found",
        message: "Pagina non trovata (middleware)"
    });
};

module.exports = notFound;