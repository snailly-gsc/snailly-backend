import path from "path";
import cors from "cors";
import helmet from "helmet";
import express, { json, urlencoded } from "express";
import routes from "../routes";
import deserializeUser from "../middleware/deserializeUser";
import http from 'http';
const app = express();
const server = http.createServer(app);
import { Server } from "socket.io"

const io = new Server(server, {
  cors: {
    origin: '*',
  }
})

io.on('connection', (socket: any) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  })
})


app.use(json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(urlencoded({ extended: true }));
app.use('/image', express.static(path.join(__dirname, "../../public/uploads")));
app.use(deserializeUser)
app.use(routes(io));


export default server;
