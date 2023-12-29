import 'dotenv/config'
import express from 'express'
import {errorHandler} from './middlewares/errorMiddelware.js'
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors'
const app = express();

app.use(cors())
app.use(express.json())

app.use('/api/v1/users', usersRoutes)


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})

