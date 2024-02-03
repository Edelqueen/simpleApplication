const express = require('express');
const app = express();

app.use(express.static('public')); // Serve static files from the "public" directory

app.listen(5005, () => {
  console.log('Server running on http://localhost:5005');
});