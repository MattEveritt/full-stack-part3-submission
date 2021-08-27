const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

morgan.token('body', function (req, res) {
    return JSON.stringify(req.body)
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(`:method :url :status :response-time ms :body`))

let persons = [
    { 
        "id": 1,
        "name": "Arto Hellas", 
        "number": "040-123456"
      },
      { 
        "id": 2,
        "name": "Ada Lovelace", 
        "number": "39-44-5323523"
      },
      { 
        "id": 3,
        "name": "Dan Abramov", 
        "number": "12-43-234345"
      },
      { 
        "id": 4,
        "name": "Mary Poppendieck", 
        "number": "39-23-6423122"
      },
      { 
        "id": 5,
        "name": "Matthew Everitt", 
        "number": "0793308266"
      }
]

const generateId = () => {
    return Math.floor(Math.random() * 100);
}

app.get('/info', (request, response) => {
    const noOfContacts = persons.length
    const date = new Date()
    console.log(noOfContacts)
    response.send(
        `<p>Phonebook has info for ${noOfContacts} people</p>
        <p>${date}</p>`
        )
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
    
    response.status(202).end()
})

app.post('/api/persons', (request, response) => {
    console.log(request.body)

    const name = request.body.name
    const number = request.body.number

    console.log(name, number)
    if (!name || !number) {
        return response.status(400).json({
            error: 'Name or number missing'
        })
    }
    const nonUniqueNames = persons.filter(person => person.name === name)
    if (nonUniqueNames.length > 0) {
        return response.status(400).json({
            error: 'Name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: name,
        number: number,
    }

    persons = persons.concat(person)

    response.json(person)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})