import { useForm, type SubmitHandler } from 'react-hook-form'
import styles from './LogIn.module.css'
import { type Form } from '../../types/index.ts'
import { useEffect } from 'react'
import logo from '../../img/logo2.svg'
import { useNavigate } from 'react-router-dom'

const LogIn: React.FC = () => {
    const { register, handleSubmit, formState, reset } = useForm<Form>()

    const navigate = useNavigate()

    const nameError: string | undefined = formState.errors.name?.message
    const roomError: string | undefined = formState.errors.room?.message

    const isDisabled: boolean = !!nameError || !!roomError

    const onSubmit: SubmitHandler<Form> = (data) => {
        if (!nameError && !roomError) {
            reset()
            navigate(`/chat?name=${data.name}&room=${data.room}`)
        }
    }

    useEffect(() => {
        return () => reset()
    }, [])

    return (
        <>
            <section className={styles.login}>
                <img src={logo} alt="locked" className={styles.login__logo} />
                <h1 className={styles.login__title}>Join</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className={styles.login__form}
                >
                    {nameError && (
                        <p className={styles.input__error}>{nameError}</p>
                    )}
                    <input
                        type="text"
                        placeholder="Name"
                        className={styles.form__input}
                        {...register('name', {
                            required: 'This field is required',
                        })}
                    />
                    {roomError && (
                        <p className={styles.input__error}>{roomError}</p>
                    )}
                    <input
                        placeholder="Room"
                        className={styles.form__input}
                        {...register('room', {
                            required: 'This field is required',
                        })}
                    />
                    <button
                        className={styles.form__btn}
                        type="submit"
                        disabled={isDisabled}
                    >
                        Sign In
                    </button>
                </form>
            </section>
        </>
    )
}

export default LogIn
