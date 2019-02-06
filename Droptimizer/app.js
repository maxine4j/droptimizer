const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');

const characterRoutes = require('./src/characterRoutes');
const upgradeRoutes = require('./src/upgradeRoutes');
const itemRoutes = require('./src/itemRoutes');
const dataUpadter = require('./src/dataUpdater');
const mailer = require('./src/mailer');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(cors());

app.use('/1/character', characterRoutes);
app.use('/1/upgrade', upgradeRoutes);
app.use('/1/item', itemRoutes);
app.use('/1/update', dataUpadter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json({
        error: {
        code: err.status,
        message: err.message,
        }
    });
});

process.on('uncaughtException', function(err) {
    console.log('Uncaught exception: ' + err);
    mailer.error(err);
    process.exit(1);
});

module.exports = app;
