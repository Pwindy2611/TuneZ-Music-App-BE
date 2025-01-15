import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import http from 'http';
import userRoute from './routes/users_route';


const app = express();

app.use(cors({
    credentials: true,
}));

app.use(compression());

app.use(cookieParser());

app.use(bodyParser.json());

app.use(express.json());

app.use('/users', userRoute);

const server = http.createServer(app);

server.listen(8080, () => {
    console.log("Server Running on http://localhost:8080/")
});

