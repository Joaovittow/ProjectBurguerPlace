const express = require('express')
const uuid = require('uuid')

const port = 3000
const app = express()
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) => {
    const { id } = request.params

    const index = orders.findIndex( order => order.id === id)

    if ( index < 0){
        return response.status(404).json({ error: "Order Not Found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkRouteMethod = (request, response, next) => {
    const routeType = request.method

    console.log(`${routeType} - /order`)
    next()
}

app.use(checkRouteMethod)

app.get('/orders', (request, response) => {
    return response.json(orders)
})

app.post('/orders', (request, response) => {
    const { order, clientName, price, status } = request.body

    const newOrder = { id: uuid.v4(), order, clientName, price, status } 

    orders.push(newOrder)

    return response.status(201).json(newOrder)
})

app.put('/orders/:id', checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})

app.delete('/orders/:id', checkOrderId, (request, response) => {

    const index = request.orderIndex

    orders.splice(index, 1)

    return response.status(204).json()
})

app.get('/orders/:id', checkOrderId, (request, response) => {
    const  index = request.orderIndex

    return response.json(orders[index])
})

app.patch('/orders/:id', checkOrderId, (request, response) => {
    const { order, clientName, price, status } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, order, clientName, price, status }

    orders[index] = updatedOrder

    return response.json(updatedOrder)
})


app.listen(port, () =>{
    console.log(`🚀Server started on port ${port}`)
})