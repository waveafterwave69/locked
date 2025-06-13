import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './route.js'
import addUser from './users.js'

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

io.on('connection', (socket) => {
    socket.on('join', ({ name, room }) => {
        socket.join(room)

        const { user } = addUser({ name, room })

        socket.emit('message', {
            data: {
                user: { name: 'System' },
                message: `welcome to the chat, ${user.name}`,
            },
        })

        socket.broadcast.to(user.room).emit('message', {
            data: {
                user: { name: 'System' },
                message: `${user.name} joined the chat`,
            },
        })
    })

    io.on('disconnect', () => {
        console.log('Disconnect')
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
