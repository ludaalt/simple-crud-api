const http = require('http')
const url = require('url')
require('dotenv').config()

const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT 

let { users } = require('./db')
const { addUser, findUser, updateUser, deleteUser } = require('./db')
const isUserIdValid = require('./helpers/isUserIdValid')
const hasRequiredProps = require('./helpers/hasReqiuredProps')

const server = http.createServer((req, res) => {
    const urlParts = url.parse(req.url, true)
    const userId = urlParts.pathname.replace(/\/person\//, '')


    if(req.method === 'GET') {
        if(req.url === '/person') {
            res.writeHead(200, { 'Content-Type': 'application/json' })
            res.write(JSON.stringify(users))
            res.end()
        } else {

            if(!urlParts.path.startsWith('/person')) {  //NOT VALID URL
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.write(JSON.stringify({"message": "Resource that you requested doesn't exist"}))
                res.end()
            }
    
            if(!isUserIdValid(userId)) { //NOT VALID ID
                res.writeHead(400, { 'Content-Type': 'application/json' })
                res.write('User ID is not valid')
                res.end()
            }   
            
            let foundUser = findUser(userId) 
            console.log(foundUser)
            if(foundUser) {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(foundUser))
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' })
                res.end('User is not found') 
            }             
        }
    }



    if(req.method === 'POST' && req.url === '/person') {
        req.on('data', (data) => {
            const newPerson = Object.assign({id: uuidv4()}, JSON.parse(data.toString()))

            if(!hasRequiredProps(newPerson, ['name', 'age', 'hobbies'])) {
                res.write('Person object must have all required props')
                res.writeHead(400, { 'Content-Type': 'application/json' })
            } else {
                addUser(newPerson) 
                res.writeHead(201, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(newPerson))
            } 
        })
    }

    if(req.method == 'PUT' && req.url.startsWith('/person/')) {
        if(!isUserIdValid(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.write('User ID is not valid')
            res.end()
        }

        const foundUser = findUser(userId)
        if(foundUser) {            
            req.on('data', (data) => {
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(updateUser(foundUser)))
            })
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.write('User is not found')
            res.end()
        }

    }


    if(req.method == 'DELETE' && req.url.startsWith('/person/')) {
        if(!isUserIdValid(userId)) {
            res.writeHead(400, { 'Content-Type': 'application/json' })
            res.write('User ID is not valid')
            res.end()
        }

        const foundUser = findUser(userId)
        if(foundUser) {            
            req.on('data', (data) => {
                res.writeHead(204, { 'Content-Type': 'application/json' })
                res.write(deleteUser(foundUser))
                res.end()
            })
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' })
            res.write('User is not found')
            res.end()
        }

    }

})

server.listen(PORT, () => console.log(`Server started on port ${PORT}`))

