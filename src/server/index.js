import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './route.js'

const app = express()
const port = 5000

const server = http.createServer(app)

app.use(cors({ origin: '*' }))

app.use(router)

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    },
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
