import { useEffect, useRef, useState } from 'react'
import styles from './Chat.module.css'
import { io } from 'socket.io-client'
import { Link, useLocation } from 'react-router-dom'
import type { Message } from '../../types'
import { useForm, type SubmitHandler } from 'react-hook-form'
import Messages from '../Messages/Messages'

const socket = io('http://localhost:5000')

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
    const { register, handleSubmit, reset } = useForm<Message>()
    const { search } = useLocation()
    const [params, setParams] = useState<{
        room?: string
        user?: string
        name?: string
    }>({})
    const [messages, setMessages] = useState<MessageFromServer['data'][]>([])
    const [userCount, setUserCount] = useState<number>(0)
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit('join', searchParams)

        socket.on('userCount', (count: number) => {
            setUserCount(count)
        })

        return () => {
            socket.off('userCount')
        }
    }, [search])

    useEffect(() => {
        const handleMessage = ({ data }: MessageFromServer) => {
            setMessages((prevMessages) => [...prevMessages, data])
        }
        socket.on('message', handleMessage)

        return () => {
            socket.off('message', handleMessage)
        }
    }, [])

    const onSubmit: SubmitHandler<Message> = (data) => {
        if (!data.message) return

        socket.emit('sendMessage', { message: data.message, params })
        reset()
        if (inputRef.current) {
            inputRef.current.focus()
        }
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
                        {`${userCount} user${
                            userCount === 1 ? '' : 's'
                        } in this room`}
                    </p>
                    <Link to="/" className={styles.leave__btn}>
                        Leave
                    </Link>
                </header>
                <main className={styles.chat__main}>
                    <Messages messages={messages} name={params.name} />
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
