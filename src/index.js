require('dotenv').config()
const port = process.env.PORT || 3000;

const app = require('../config/app');

app.listen(port, () => console.log(`Executando na porta ${port}`));