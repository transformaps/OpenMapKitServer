try {
    const settings = require('./settings');
} catch (e) {
    console.error("You must have a settings.js file. Take a look at settings.js.example. https://github.com/AmericanRedCross/OpenMapKitServer/blob/master/settings.js.example");
    process.exit();
}

const express = require('express');
const directory = require('serve-index');
const fs = require('./ODK/routes/fs');
const deployment = require('./Deployment/routes');
const error = require('./ODK/controllers/error-handler');
const package = require('./package');
const app = express();

app.get('/', function (req, res) {
    res.status(200).json({
        name: settings.name,
        description: settings.description,
        status: 200,
        service: package.name,
        version: package.version
    });
});

app.use('/public', express.static(settings.publicDir));
app.use('/public', directory(settings.publicDir));

// Public File System Endpoint
app.use('/fs', fs);

// Deployment
app.use('/deployment', deployment);

// Handle errors
app.use(error);

const port = process.env.PORT || settings.port;
app.listen(port);
console.log('OpenMapKit Server is listening on port %s.', port);