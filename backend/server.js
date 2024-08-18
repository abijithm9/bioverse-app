const express = require('express')
const sqlite3 = require('sqlite3').verbose()
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path');
const app = express()
const PORT = process.env.PORT || 3001

const dbPath = path.resolve(__dirname, 'bioverse_app.db');
let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log('Connected to in-memory SQLite DB')
})

app.use(cors())
app.use(bodyParser.json())

const users = [
    { id: 1, email: 'user1@user.com', password: 'user1pass', role: 'user', name: 'User One' },
    { id: 2, email: 'admin1@admin.com', password: 'admin1pass', role: 'admin', name: 'Admin One' },
    { id: 3, email: 'user2@user.com', password: 'user2pass', role: 'user', name: 'User Two' },
    { id: 4, email: 'user3@user.com', password: 'user3pass', role: 'user', name: 'User Three' },
    { id: 5, email: 'admin2@admin.com', password: 'admin2pass', role: 'admin', name: 'Admin Two' }
]

// Test simple endpoint 
app.get('/', (req, res) => {
    res.send("BIOVERSE APP")
})

// Login 
app.post('/api/login', (req, res) => {
    const { email, password } = req.body
    const user = users.find(user => user.email === email && user.password === password)
    if (user) {
        res.json({ success: true, id: user.id, name: user.name, email: user.email, role: user.role })
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' })
    }
})

// Get questionnaires
app.get('/api/questionnaires', (req, res) => {
    db.all(`SELECT * FROM questionnaires`, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({ questionnaires: rows })
    })
})

// Get questions for questionnaire id passed in
app.get('/api/questionnaire/:id/questions', (req, res) => {
    const questionnaireId = req.params.id
    const query = `
        SELECT j.question_id, q.question, j.priority
        FROM junction j
        JOIN questions q on j.question_id = q.id
        where j.questionnaire_id == ${questionnaireId}
        ORDER BY j.priority ASC
    `
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({ questions: rows })
    })
})

// Submit answers for questionnaire
app.post('/api/submit-questionnaire', (req, res) => {
    // get userId, questionnaireId
    // answers would be an array of objects
    // each object contains the question_id, answer
    const { userId, userEmail, questionnaireId, answers } = req.body

    const user = users.find(user => user.email === userEmail && user.id === userId)
    if (!user) {
        res.status(400).json({success: false, message: "User not found"})
        return
    }

    answers.forEach(answer => {
        db.run(`
            INSERT INTO users_answers (user_id, user_email, question_id, question_type, answer)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(user_id, question_id) 
            DO UPDATE SET answer = excluded.answer
        `, [user.id, user.email, answer.question_id, answer.question_type, answer.answer], function(err) {
            if (err) {
                console.log(err.message)
            }
        })
    })

    res.json({ success: true, message: 'Answers submitted successfully' })
})

app.get('/api/admin/users', (req, res) => {
    const filteredUsers = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    });
    res.json({ users: filteredUsers });

})

// Get answers for a user
app.get('/api/user/:id/answers', (req, res) => {
    const userId = req.params.id
    const query = `
        SELECT *
        FROM users_answers
        JOIN questions q on q.id = users_answers.question_id
        where user_id = '${userId}'
    `
    db.all(query, (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message })
            return
        }
        res.json({ userAnswers: rows })
    })
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
})
