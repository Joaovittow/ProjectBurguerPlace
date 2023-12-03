const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const users = []

const checkUserId = (request, response, next) => {
    const { id } = request.params

    const index = users.findIndex( user => user.id === id)

    if ( index < 0){
        return response.status(404).json({ error: "User Not Found"})
    }

    request.userIndex = index
    request.userId = id

    next()
}

const checkRouteMethod = (request, response, next) => {
    const routeType = request.method

    console.log(`${routeType} - /order`)
    next()
}

app.use(checkRouteMethod)

app.get('/orders', (request, response) => {
    return response.json(users)
})

app.post('/orders', (request, response) => {
    const { order, clienteName, price, status } = request.body

    const user = { id: uuid.v4(), order, clienteName, price, status } 

    users.push(user)

    return response.status(201).json(user)
})

app.put('/orders/:id', checkUserId, (request, response) => {
    const { order, clienteName, price, status } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, order, clienteName, price, status }

    users[index] = updatedUser

    return response.json(updatedUser)
})

app.delete('/orders/:id', checkUserId, (request, response) => {

    const index = request.userIndex

    users.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', checkUserId, (request, response) => {
    const  index = request.userIndex

    return response.json(users[index])
})

app.patch('/orders/:id', checkUserId, (request, response) => {
    const { order, clienteName, price, status } = request.body
    const index = request.userIndex
    const id = request.userId

    const updatedUser = { id, order, clienteName, price, status }

    users[index] = updatedUser

    return response.json(updatedUser)
})


app.listen(port, () =>{
    console.log(`🚀Server started on port ${port}`)
})