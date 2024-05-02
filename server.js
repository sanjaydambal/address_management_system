import express from 'express';
import setupSwagger from './controllers/swagger.js';
import addressRoutes from './routes/addressRoutes.js';

const app = express();
app.use(express.json());


app.use('/address', addressRoutes);

setupSwagger(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

