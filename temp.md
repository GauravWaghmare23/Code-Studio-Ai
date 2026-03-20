{
    "text": "To create an Express server using ES6 modules (import/export), you must set \"type\": \"module\" in your package.json. This allows the use of modern JavaScript syntax natively in Node.js without needing a transpiler like Babel.",
    "code": {
        "fileTree": {
            "package.json": {
                "file": {
                    "contents": "{\n  \"name\": \"express-es6-server\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.2\"\n  }\n}"
                }
            },
            "index.js": {
                "file": {
                    "contents": "import express from 'express';\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Middleware to parse JSON\napp.use(express.json());\n\n// Basic Route\napp.get('/', (req, res) => {\n  res.json({\n    message: 'Express server running with ES6 modules!',\n    status: 'success'\n  });\n});\n\n// Server listener\napp.listen(PORT, () => {\n  console.log(`🚀 Server is running on http://localhost:${PORT}`);\n});"
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
                "start"
            ]
        }
    },
    "codePreview": "### package.json\n```json\n{\n  \"name\": \"express-es6-server\",\n  \"version\": \"1.0.0\",\n  \"type\": \"module\",\n  \"main\": \"index.js\",\n  \"scripts\": {\n    \"start\": \"node index.js\"\n  },\n  \"dependencies\": {\n    \"express\": \"^4.18.2\"\n  }\n}\n```\n\n### index.js\n```javascript\nimport express from 'express';\n\nconst app = express();\nconst PORT = process.env.PORT || 3000;\n\n// Middleware to parse JSON\napp.use(express.json());\n\n// Basic Route\napp.get('/', (req, res) => {\n  res.json({\n    message: 'Express server running with ES6 modules!',\n    status: 'success'\n  });\n});\n\n// Server listener\napp.listen(PORT, () => {\n  console.log(`🚀 Server is running on http://localhost:${PORT}`);\n});\n```"
}