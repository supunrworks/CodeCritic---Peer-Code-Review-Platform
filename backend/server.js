const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send("Hello Welcome!")
})

app.use((req, res)=>{
    res.status(404).send("Page not found!")
})







app.listen(port, () => {
    console.log("The server is running")
})