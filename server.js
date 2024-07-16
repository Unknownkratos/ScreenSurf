const app = require('./app');
const port = 3000;
const cors = require('cors')

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
app.use(cors());
