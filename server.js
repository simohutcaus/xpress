const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');
const PORT = process.env.PORT || 4000;

app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors());
const apiRouter = require('./api');
app.use('/api', apiRouter);

// app.get('/api/artists', (req, res, next) => {
//     db.all('select * from Artist where is_currently_employed = 1', (err, rows) => {
//         if (err) {
//             console.log(err);
//             res.sendStatus(500);
//         } else {
//             res.send({artists: rows});
//         }
//     });
// });

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;