import styles from './Messages.module.css'

const Messages: React.FC<any> = ({ messages, name = '' }) => {
    return (
        <>
            <ul className={styles.main__notification}>
                {messages.map((msg: any, index: number) => {
                    const itsMe =
                        msg.user.name.trim().toLowerCase() ===
                        name.trim().toLowerCase()
                    const className = itsMe ? styles.me : styles.user

                    return (
                        <li
                            key={index}
                            className={`${styles.user__message} ${className}`}
                        >
                            {msg.user.name !== 'System' ? (
                                <div className={styles.user}>
                                    <p className={styles.name}>
                                        {itsMe ? 'You' : msg.user.name}
                                    </p>
                                    <p className={styles.text}>{msg.message}</p>
                                </div>
                            ) : (
                                <span className={styles.system__notification}>
                                    {msg.message}
                                </span>
                            )}
                        </li>
                    )
                })}
            </ul>
        </>
    )
}

export default Messages
