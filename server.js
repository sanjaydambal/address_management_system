import express from 'express';
import bodyParser from 'body-parser';
import addressRoutes from './routes/addressRoutes.js'
import setupSwagger from './controllers/swagger.js';
const app = express();
const port = 3000;
app.use(bodyParser.json());

app.use('/address',addressRoutes)
setupSwagger(app);
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
