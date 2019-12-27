// Server
import Server from './classes/server';

// Routes
import userRoutes from './routes/user';
import uploadRoutes from './routes/upload';

import bodyParser from 'body-parser';
import cors from 'cors';
import Morgan from 'morgan';
import errorMiddleware from './middlewares/error.middleware';
import configValues from './middlewares/env.middleware';
import userRequestInfo from './middlewares/user_info.middleware';
import HttpException from './exceptions/HttpException';

const server = new Server();

// Env param
server.app.use(configValues);

// Load user info
server.app.use(userRequestInfo);

// Body parser
server.app.use(bodyParser.urlencoded({extended:true}));
server.app.use(bodyParser.json());

// Morgan
server.app.use(Morgan('dev'))

// Configure CORS
server.app.use(cors({origin: true, credentials: true}));

// Routes
server.app.use('/user', userRoutes);
server.app.use('/', uploadRoutes);

// catch 404 and forward to error handler
server.app.use((req, res, next) => {
	next(new HttpException(404, 'page not found'));
});

// Error handler
server.app.use(errorMiddleware);


server.start(()=>{console.log(`Server running on port ${server.port}`)});
