
import express from 'express';
import dotenv from 'dotenv';
import router from './src/index.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


app.get('/', (req, res) => {
  res.send('Hello, Node.js with ES Modules!');
});

app.use('/api',router)

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
