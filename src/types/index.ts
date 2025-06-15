export interface Form {
    name: string
    room: string
}

export interface Message {
    message: string
}

export interface User {
    id: string
    name: string
}

export interface MessageData {
    message: string
    user: User
}
