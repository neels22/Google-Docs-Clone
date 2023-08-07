

import { Server } from 'socket.io';





const port = 9000;



const io = new Server(port,{
    cors :{
        origin: 'http://localhost:3000',

        methods:['GET','POST']

    }
});


io.on('connection',socket=> {

    socket.on('get-document',documentId=>{

        const data ="";

        socket.join(documentId);

        socket.emit('load-document',data);

        socket.on('send-changes',delta=>{
            socket.broadcast.to(documentId).emit('receive-changes',delta);
    
        })

    })

   
});