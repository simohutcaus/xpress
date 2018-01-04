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
        if (!row) {
            console.log(err);
            console.log(row);
            res.sendStatus(404);
        } else {
            res.send({artist: row});
        }
    })
})

const validateArtist = (req, res, next) => {
  const artistToCreate = req.body.artist;
  if (!artistToCreate.name || !artistToCreate.dateOfBirth || !artistToCreate.biography) {
    return res.sendStatus(400);
  }
  next();
}


artistsRouter.post('/', validateArtist,  (req, res, next) => {
    const artistToCreate = req.body.artist;    
    console.log(artistToCreate);
    //console.log(req.body.artist);
    db.run(`INSERT INTO Artist (name, date_of_birth, biography, is_currently_employed) VALUES ($name, $date_of_birth, $biography, $is_currently_employed)`, 
    { $name: req.body.artist.name, $date_of_birth: req.body.artist.dateOfBirth, $biography: req.body.artist.biography, $is_currently_employed: 1}, function (error) {
        if (error) {
            console.log(error);
            return res.sendStatus(500);
        }   

        db.get(`SELECT * FROM Artist WHERE id = ${this.lastID}`, (err, row) => {
      if (!row) {
          console.log(err);
        return res.sendStatus(500);
      }
      res.status(201).send({artist: row});
    });



    })

})




module.exports = artistsRouter;