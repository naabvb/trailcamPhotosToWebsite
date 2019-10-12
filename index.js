const express = require('express');
const path = require('path');
const app = express();

const { getAlbum } = require('./google-photos')
const { getImages } = require('./aws-photos')

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('/api/images/1', async function (request, response) {
  try {
    const results = await getImages(1)
    response.json(results);
  }
  catch (e) {
    response.status(500);
  }

});

app.get('/api/images/2', async function (request, response) {
  try {
    const results = await getImages(2)
    response.json(results);
  }
  catch (e) {
    response.status(500);
  }

});


// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/client/build/index.html'));
});




const port = process.env.PORT || 5000;
app.listen(port);
console.log(`listening on ${port}`);