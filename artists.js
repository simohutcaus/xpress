const express = require('express');
const artistsRouter = express.Router({mergeParams: true});

const bodyParser = require('body-parser');
artistsRouter.use(bodyParser.json());

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


artistsRouter.get('/', (req, res) => {
    db.all('select * from Artist where is_currently_employed = 1', (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send({artists: rows});
        }
    });
});



artistsRouter.get('/:id', (req, res, next) => {
    db.get(`select * from Artist where id = $id`, {$id: req.params.id}, (err, row) => {
        //console.log(req);
        if (err) {
            console.log(err);
            console.log(row);
            res.sendStatus(500);
        } else {
            res.send({artist: row});
        }
    })
})

module.exports = artistsRouter;