import ChatPage from '../pages/ChatPage/ChatPage'
import MainPage from '../pages/MainPage/MainPage'

export const routesConfig = [
    {
        page: <MainPage />,
        url: '/',
    },
    {
        page: <ChatPage />,
        url: '/chat',
    },
]
