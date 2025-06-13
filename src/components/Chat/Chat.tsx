import { useEffect, useState } from 'react'
import styles from './Chat.module.css'
import { io, Socket } from 'socket.io-client'
import { Link, useLocation } from 'react-router-dom'
import type { User } from '../../types'

const socket: Socket = io('http://localhost:5000')

const Chat: React.FC = () => {
    const [state, setState] = useState<User | never[] | any>([])
    const [params, setParams] = useState({})
    const { search } = useLocation()

    console.log(search)

    useEffect(() => {
        const searchParams = Object.fromEntries(new URLSearchParams(search))
        setParams(searchParams)
        socket.emit('join', searchParams)
    }, [])

    useEffect(() => {
        socket.on('message', ({ data }: any) => {
            setState((prev: User) => ({ ...prev, data }))
        })
    }, [])

    console.log(state)

    console.log(params)

    return (
        <>
            <section className={styles.chat}>
                <header className={styles.chat__header}>
                    <h2 className={styles.header__title}>ROOM1</h2>
                    <p className={styles.header__users}>USERS</p>
                    <Link to="/" className={styles.leave__btn}>
                        Leave
                    </Link>
                </header>
                <main className={styles.chat__main}>
                    <p className={styles.main__notification}>
                        {state && state?.data?.message}
                    </p>
                </main>
            </section>
        </>
    )
}

export default Chat
