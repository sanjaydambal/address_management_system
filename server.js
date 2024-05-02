import express from 'express';
import bodyParser from 'body-parser';
import addressRoutes from './routes/addressRoutes.js'
import setupSwagger from './controllers/swagger.js';
import cors from 'cors'

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.json());
app.use(cors())

app.use('/address', addressRoutes);

setupSwagger(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));