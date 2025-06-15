import express from 'express'
import * as http from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import router from './route.js'
import { addUser, findUser, getRoomUsers, removeUser } from './users.js'

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
                message: `Welcome to the chat, ${user.name}`,
            },
        })

        socket.broadcast.to(user.room).emit('message', {
            data: {
                user: { name: 'System' },
                message: `${user.name} joined the chat`,
            },
        })

        io.to(user.room).emit('joinRoom', {
            data: { users: getRoomUsers(user.room) },
        })
    })

    socket.on('sendMessage', ({ message, params }) => {
        const user = findUser(params)

        if (user) {
            const { room, name } = user

            io.to(room).emit('message', {
                data: { user: { name: name }, message: message },
            })
        }
    })

    socket.on('leftRoom', ({ params }) => {
        const user = findUser(params)

        if (user) {
            removeUser(user)

            io.to(user.room).emit('message', {
                data: {
                    user: { name: 'System' },
                    message: `${user.name} has left the room`,
                },
            })
            io.to(user.room).emit('joinRoom', {
                data: { users: getRoomUsers(user.room) },
            })
        }
    })

    socket.on('disconnect', () => {
        const user = findUser({ name: socket.id })

        if (user) {
            removeUser(user)
            io.to(user.room).emit('message', {
                data: {
                    user: { name: 'System' },
                    message: `${user.name} has left the room`,
                },
            })
            io.to(user.room).emit('joinRoom', {
                data: { users: getRoomUsers(user.room) },
            })
        }

        console.log('User Disconnected')
    })
})

server.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})
