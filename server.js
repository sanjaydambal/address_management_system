import express from 'express';
import bodyParser from 'body-parser';
import addressRoutes from './routes/addressRoutes.js'
import setupSwagger from './swagger/swagger.js';
import cors from 'cors'

const app = express();
const port = 3000;
// function test (req,res,next){
//     console.log('request passed through test')
//     next()
// }
// function test2 (req,res,next){
//     console.log('request passed through test2')
//     next()
// }
// app.use(test);

app.use(bodyParser.json());
app.use(express.json());
app.use(cors())

app.use('/address', addressRoutes);
// app.use(test2);
setupSwagger(app);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));