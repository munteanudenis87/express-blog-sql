const express = require('express')
const app = express()
const port = 3000

const postRouter = require('./routers/post');

// importo middleware di checkTime
const checkTime = require("./middlewares/checkTime");

// importo middleware di gestione errore interni server 500
const errorsHandler = require('./middlewares/errorsHandler');

// importo middleware di gestione errore di chiamata su rotta inesistente 404
const notFound = require('./middlewares/notFound');

// Attivazione body parser per formato json per le rotte
app.use(express.json());
app.use(express.static('public'));

// registra globalmente il middleware di gestione
app.use(checkTime);

// rotta di home
app.get('/', (req, res) => {
    res.send('Server di mio blog')
});

// rotte di CRUD
app.use('/posts', postRouter);

// registra globalmente il middleware di gestione errore interno server 500
app.use(errorsHandler);

// registra globalmente il middleware di gestione chiamata su rotta inesistente 404
app.use(notFound);

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});