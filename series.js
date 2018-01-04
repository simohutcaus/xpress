const express = require('express');
const seriesRouter = express.Router({mergeParams: true});

const bodyParser = require('body-parser');
seriesRouter.use(bodyParser.json());

const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');


seriesRouter.get('/', (req, res) => {
    db.all('select * from Series', (err, rows) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
        } else {
            res.send({series: rows});
        }
    });
});



seriesRouter.get('/:id', (req, res, next) => {
    db.get(`select * from Series where id = $id`, {$id: req.params.id}, (err, row) => {
        //console.log(req);
        if (!row) {
            //console.log(err);
            //console.log(row);
            res.sendStatus(404);
        } else {
            res.send({series: row});
        }
    })
})




module.exports = seriesRouter;