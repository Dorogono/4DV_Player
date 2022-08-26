import express from 'express'
import path from 'path'

const app = express()

const PORT = 2000

app.use('/public', express.static('public'))
app.use('/static', express.static('static'))

app.get('/', (req, res) => {
    res.sendFile(path.resolve() + '/public/player.html')
})

app.listen(PORT, () => console.log(`✅ Server is listening on port: ${PORT}`))