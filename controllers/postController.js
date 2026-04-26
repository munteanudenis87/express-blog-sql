// importo dati del post
const postsRouter = require('./../data/posts');

// Importiamo il file di connessione al database
const connection = require('../data/db');

// elenco funzioni relative alle rotte della risorsa post

function index (req, res) {
    // prepariamo la query
    const sql = 'SELECT * FROM posts';
    // eseguiamo la query!
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
});
};
function show (req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id
    const sql = 'SELECT * FROM posts WHERE id = ?';
    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Pizza not found' });
        res.json(results[0]);
});
};
function store (req, res) {
    // Creiamo un nuovo id incrementando l'ultimo id presente
    const newId = postsRouter[postsRouter.length - 1].id + 1;
    
    // Creiamo un nuovo post
    const newPost = {
        id: newId,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        tags: req.body.tags
    }
    // Aggiungiamo il nuovo post
    postsRouter.push(newPost);

    // Controlliamo
    console.log(postsRouter);

    // Restituiamo lo status corretto e il post creato
    res.status(201);
    res.json(newPost);
};
function update (req, res) {
    // res.send('Modifica integrale post ' + req.params.id);
    const id = parseInt(req.params.id);

    const post = postsRouter.find(post => post.id === id);

    if(!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        });
    }
    // Aggiorniamo il post
    post.title = req.body.title;
    post.content = req.body.content;
    post.image = req.body.image;
    post.tags = req.body.tags;

    // Controlliamo
    console.log(postsRouter);

    // Restituiamo il post creato
    res.json(post);
};
function modify (req, res) {
    // res.send('Modifica parziale del post ' + req.params.id);
    
    // Recuperiamo l'id dall' URL
    const id = parseInt(req.params.id)

    const post = postsRouter.find(post => post.id);

    if(!post) {
        res.status(404);

        return res.json({
            error: "Not Found",
            message: "Post non trovato"
        })
    }

    const postInviato = req.body;

    // Aggiorno il post
    postInviato.title ? post.title = postInviato.title : post.title = post.title;
    postInviato.content ? post.content = postInviato.content : post.content = post.content;
    postInviato.image ? post.image = postInviato.image : post.image = post.image;
    postInviato.tags ? post.tags = postInviato.tags : post.tags = post.tags;

    // Controlliamo il post
    console.log(postsRouter);

    // Restituiamo il post creato
    res.json(post);
};
function destroy (req, res) {
    const id = parseInt(req.params.id);

    //cerchiamo il post tramite id
    const post = postsRouter.find(post => post.id === id);

    if (!post) {
        res.status(404);

        return res.json({
            status: 404,
            error: "Not Found",
            message: "Post non trovato"
        })
    }
    // Rimuoviamo il post
    postsRouter.splice(postsRouter.indexOf(post), 1);

    // Returniamo lo status corretto
    res.sendStatus(204)
};

// esportiamo le funzioni per il router
module.exports = { index, show, store, update, modify, destroy };