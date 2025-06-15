import React, { useEffect, useRef, useState } from 'react'
import styles from './Chat.module.css'
import { io } from 'socket.io-client'
import { useLocation, useNavigate } from 'react-router-dom'
import type { Message } from '../../types'
import { useForm, type SubmitHandler } from 'react-hook-form'
import Messages from '../Messages/Messages'

const socket = io('https://locked-pkv8.onrender.com')

interface MessageFromServer {
    data: {
        user: {
            room?: string
            user?: string
            name?: string
        }
        message: string
    }
}

const Chat: React.FC = () => {
    const navigate = useNavigate()
    const { register, handleSubmit, reset } = useForm<Message>()
    const { search } = useLocation()
    const [params, setParams] = useState<{
        room?: string
        user?: string
        name?: string
    }>({})
    const [messages, setMessages] = useState<MessageFromServer['data'][]>([])
    const inputRef = useRef<HTMLInputElement>(null)
    const [users, setUsers] = useState<number>(0)
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit('join', searchParams)

        return () => {
            socket.off('joinRoom')
        }
    }, [search])

    useEffect(() => {
        const handleMessage = ({ data }: MessageFromServer) => {
            setMessages((prevMessages) => [...prevMessages, data])
            scrollToBottom()
        }
        socket.on('message', handleMessage)

        return () => {
            socket.off('message', handleMessage)
        }
    }, [])

    useEffect(() => {
        const handleJoinRoom = ({ data }: { data: { users: any[] } }) => {
            setUsers(data.users.length)
        }

        socket.on('joinRoom', handleJoinRoom)

        return () => {
            socket.off('joinRoom', handleJoinRoom)
        }
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const onSubmit: SubmitHandler<Message> = (data) => {
        if (!data.message) return

        socket.emit('sendMessage', { message: data.message, params })
        reset()
        if (inputRef.current) {
            inputRef.current.focus()
        }
        scrollToBottom()
    }

    const leftRoom = () => {
        socket.emit('leftRoom', { params })
        navigate('/')
    }

    return (
        <>
            <section className={styles.chat}>
                <div className={styles.emoji__list}></div>
                <header className={styles.chat__header}>
                    <h2 className={styles.header__title}>
                        {params.room || 'ROOM'}
                    </h2>
                    <p className={styles.header__users}>
                        {`${users} user${users > 1 ? 's' : ''} in room`}
                    </p>
                    <button onClick={leftRoom} className={styles.leave__btn}>
                        Leave
                    </button>
                </header>
                <main
                    className={styles.chat__main}
                    style={{ overflowY: 'auto' }}
                >
                    <Messages messages={messages} name={params.name} />
                    <div ref={messagesEndRef} />{' '}
                </main>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.chat__footer}
                >
                    <input
                        type="text"
                        autoComplete="off"
                        className={styles.footer__input}
                        placeholder="Message"
                        {...register('message')}
                    />
                    <button className={styles.footer__btn} type="submit">
                        Send
                    </button>
                </form>
            </section>
        </>
    )
}

export default Chat
