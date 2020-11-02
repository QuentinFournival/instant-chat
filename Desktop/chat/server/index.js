const express  = require('express')
const app = express()
const socket =require('socket.io')
const cors = require('cors')


app.use(cors())
app.use(express.json())

const server = app.listen('3001', () => {
    console.log('écoute le port 3001');
});

io = socket(server)

io.on('connection', (socket)=> {
    console.log(socket.id)


    socket.on('join_room', (data) =>{
        socket.join(data)
        console.log(`l'utilisateur a rejoint la room : ${data}`)
    })

    socket.on('send_message', (data) =>{
        console.log(data)
        socket.to(data.room).emit("receive_message", data.content);
    })
    socket.on('disconnect', ()=> {
        console.log('utilisateur déconnecter')
    })
})