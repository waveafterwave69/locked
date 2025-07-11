let users = []

export const findUser = (user) => {
    console.log('user', user)
    const userName = user.name?.trim().toLowerCase()
    const userRoom = user.room?.trim().toLowerCase()

    return users.find(
        (u) =>
            u.name?.trim().toLowerCase() === userName &&
            u.room?.trim().toLowerCase() === userRoom
    )
}

export const addUser = (user) => {
    const isExist = findUser(user)

    !isExist && users.push(user)

    const currUser = isExist || user

    return { isExist: !!isExist, user: currUser }
}

export const getRoomUsers = (room) => {
    return users.filter((u) => u.room === room)
}

export const removeUser = (user) => {
    const foundUser = findUser(user)

    if (foundUser) {
        users = users.filter((u) => u.name !== foundUser.name)
    }

    return foundUser
}
