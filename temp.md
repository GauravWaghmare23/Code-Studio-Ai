{
"text": "I have created a modular Express server using ES6 modules. The structure follows best practices including
environment configuration, centralized error handling, and a clean separation of concerns between the server entry point
and the application logic.",
"fileTree": {
"package.json": {
"file": {
"contents": "{\n \"name\": \"express-es6-server\",\n \"version\": \"1.0.0\",\n \"type\": \"module\",\n \"main\":
\"src/server.js\",\n \"scripts\": {\n \"start\": \"node src/server.js\",\n \"dev\": \"nodemon src/server.js\"\n },\n
\"dependencies\": {\n \"express\": \"^4.18.2\",\n \"dotenv\": \"^16.3.1\",\n \"cors\": \"^2.8.5\",\n \"helmet\":
\"^7.1.0\",\n \"morgan\": \"^1.10.0\"\n },\n \"devDependencies\": {\n \"nodemon\": \"^3.0.1\"\n }\n}"
}
},
"src/config/env.config.js": {
"file": {
"contents": "import dotenv from 'dotenv';\n\ndotenv.config();\n\nexport const config = {\n port: process.env.PORT ||
3000,\n nodeEnv: process.env.NODE_ENV || 'development'\n};"
}
},
"src/middleware/error.middleware.js": {
"file": {
"contents": "/**\n * Global Error Handler Middleware\n */\nexport const errorHandler = (err, req, res, next) => {\n
const statusCode = err.statusCode || 500;\n \n res.status(statusCode).json({\n success: false,\n message: err.message ||
'Internal Server Error',\n stack: process.env.NODE_ENV === 'development' ? err.stack : undefined\n });\n};"
},
"src/routes/health.route.js": {
"file": {
"contents": "import { Router } from 'express';\n\nconst router = Router();\n\n/**\n * @route GET /api/v1/health\n *
@desc Health check endpoint\n */\nrouter.get('/health', (req, res) => {\n res.status(200).json({\n status: 'UP',\n
timestamp: new Date().toISOString(),\n uptime: process.uptime()\n });\n});\n\nexport default router;"
}
},
"src/app.js": {
"file": {
"contents": "import express from 'express';\nimport cors from 'cors';\nimport helmet from 'helmet';\nimport morgan from
'morgan';\nimport healthRouter from './routes/health.route.js';\nimport { errorHandler } from
'./middleware/error.middleware.js';\n\nconst app = express();\n\n// Security
Middlewares\napp.use(helmet());\napp.use(cors());\n\n// Logging Middleware\napp.use(morgan('dev'));\n\n// Body
Parsers\napp.use(express.json());\napp.use(express.urlencoded({ extended: true }));\n\n// API Routes\napp.use('/api/v1',
healthRouter);\n\n// 404 Handler\napp.use((req, res, next) => {\n const error = new Error(`Not Found -
${req.originalUrl}`);\n error.statusCode = 404;\n next(error);\n});\n\n// Global Error
Handler\napp.use(errorHandler);\n\nexport default app;"
}
},
"src/server.js": {
"file": {
"contents": "import app from './app.js';\nimport { config } from './config/env.config.js';\n\n/**\n * Start the Express
server\n */\nconst startServer = () => {\n try {\n app.listen(config.port, () => {\n console.log(`Server is running in
${config.nodeEnv} mode on port ${config.port}`);\n });\n } catch (error) {\n console.error(`Error starting server:
${error.message}`);\n process.exit(1);\n }\n};\n\nstartServer();"
}
},
".env": {
"file": {
"contents": "PORT=3000\nNODE_ENV=development"
}
}
},
"buildCommand": {
"mainItem": "npm",
"commands": [
"install"
]
},
"startCommand": {
"mainItem": "npm",
"commands": [
"run",
"dev"
]
}
}