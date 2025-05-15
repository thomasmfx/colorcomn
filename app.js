require('dotenv').config();
const express = require('express');

const routes = require('./routes/index.js');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/share', routes.share);
app.use('/colors', routes.colors);
app.use('/tags', routes.tags);
app.use('/palettes', routes.palettes);
app.use('/', routes.index);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`Server is running on http://localhost:${PORT}`),
);
