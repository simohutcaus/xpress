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

const validateSeries = (req, res, next) => {
  const seriesToCreate = req.body.series;
  if (!seriesToCreate.name || !seriesToCreate.description) {
    return res.sendStatus(400);
  }
  next();
}


seriesRouter.post('/', validateSeries, (req, res, next) => {
    const seriesToCreate = req.body.series;    
    console.log(seriesToCreate);
    //console.log(req.body.artist);
    db.run(`INSERT INTO Series (name, description) VALUES ($name, $description)`, 
    { $name: req.body.series.name, $description: req.body.series.description}, function (error) {
        if (error) {
            //console.log(error);
            return res.sendStatus(500);
        }   

        db.get(`SELECT * FROM Series WHERE id = ${this.lastID}`, (err, row) => {
      if (!row) {
          //console.log(err);
        return res.sendStatus(400);
      }
      res.status(201).send({series: row});
    });



    })

})


seriesRouter.put('/:id', validateSeries, (req, res, next) => {

    const seriesToUpdate = req.body.series;
    //console.log(artistToUpdate);
    //console.log("this is params " + req.params.id);
    db.run(`UPDATE Series SET name=$name, description=$description where id=${req.params.id}`,
    {$name:req.body.series.name, $description: req.body.series.description}), function (error, row) {
        console.log(row);
        if (error) {
            console.log('this is error ' + error);
            res.sendStatus(500);
        }

    }
        db.get(`SELECT * from Series where id = $id`, {$id: req.params.id}, (error, row) => {
            if(!row) {
                return res.sendStatus(500);
            }
            //console.log(row);
            res.status(200).send({series: row});
        })

    });


seriesRouter.delete('/:id', (req, res, next) => {

 const seriesToDelete = req.params.id;
    //console.log(artistToUpdate);
    //console.log("this is params " + req.params.id);
    db.run(`DELETE FROM Series where id=${req.params.id}`), function (error, row) {
        console.log(row);
        if (error) {
            console.log('this is error ' + error);
            res.sendStatus(500);
        }

        res.sendStatus(204);

    }
        db.get(`SELECT * from Series where id = $id`, {$id: req.params.id}, (error, row) => {
            if(!row) {
                return res.sendStatus(500);
            }
            //console.log(row);
            res.status(204).send({artist: row});
        })

    });




module.exports = seriesRouter;