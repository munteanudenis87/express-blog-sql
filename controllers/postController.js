// importo dati del post
const postsRouter = require('./../data/posts');

// Importiamo il file di connessione al database
const connection = require('../data/db');

// elenco funzioni relative alle rotte della risorsa post

function index (req, res) {
    // prepariamo la query
    const sql = 'SELECT * FROM posts';
    // eseguiamo la query per i tags con una join e where
    connection.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        res.json(results);
});
};
function show (req, res) {
    // recuperiamo l'id dall' URL
    const id = req.params.id
    const sql = 'SELECT * FROM posts WHERE id = ?';

    // Prepariamo la query
    const tagsSql = `
    select T.*
    from tags T
    join post_tag PT on T.id = PT.tag_id
    where PT.post_id = ?`;

    connection.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Database query failed' });
        if (results.length === 0) return res.status(404).json({ error: 'Post not found' });

        // Recuperiamo il post
        const post = results[0];

        // Se è andata bene, eseguiamo la seconda query per i tags
        connection.query(tagsSql, [id], (err, results) => {
            if (err) return res.status(500).json({ error: 'Database query failed'});

            // Aggiungiamo i tags al post
            post.tags = results;
            // Returniamo il post con la nuova prop tags
            res.json(post);
        })
});
};
function store (req, res) {
    const { title, content, image } = req.body;
    // prepariamo la query
    const sql = 'INSERT INTO posts (title, content, image) VALUES (?, ?, ?)'
    // eseguiamo la query
    connection.query(
        sql,
        [title, content, image],
        (err, results) => {
            if (err) return res.status(500).json({ error: 'Failed to insert post' });
                res.status(201); // status corretto
                console.log(results)
                res.json({ id: results.insertId }); // restituiamo l'id assegnato dal DB
        });
};
function update (req, res) {
    // recuperiamo l'id dall' URL
    const { id } = req.params;
    // recuperiamo i dati dal body della richiesta
    const { title,  content, image } = req.body;
    // Prepariamo la query per aggiornare la pizza
    connection.query(
        'UPDATE posts SET title = ?,  content = ?, image = ? WHERE id = ?',
        [title, content, image, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Failed to update post' });
                res.json({ message: 'Post updated successfully' });
        });
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
    // recuperiamo l'id dall' URL
    const { id } = req.params;
    //Eliminiamo la pizza dal menu
    connection.query('DELETE FROM posts WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to delete post' });
        res.sendStatus(204)
    });
};

// esportiamo le funzioni per il router
module.exports = { index, show, store, update, modify, destroy };