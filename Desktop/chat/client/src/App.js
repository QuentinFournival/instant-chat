import React, { useState, useEffect} from "react";
import io from 'socket.io-client'
import "./App.css";

let socket;
const CONNECTION_PORT ="localhost:3001/"


function App(){
  const [loggedIn, setLoggedIn] = useState(false);
  const [room, setRoom] = useState('Class of 2023');
  const [userName, setUserName] = useState('');

  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  useEffect(()=> {
    socket = io(CONNECTION_PORT);
  }, [CONNECTION_PORT])
  
  useEffect(() =>{
    socket.on("receive_message", (data) =>{
      setMessageList([...messageList, data]);
    })
  })


  const connectToRoom = () => {
    setLoggedIn(true)
    socket.emit('join_room', room)
  }

  const sendMessage = async () =>{

    let messageContent = {
      room: room,
      content: {  
        author: userName,
        message: message,
      }
    }

    socket.emit('send_message', messageContent)
    setMessageList([...messageList, messageContent.content])
    setMessage("")
  }
  
 
  return (
    <div className="App">
 {!loggedIn ?(
  <div className="login">
    <div className="logo"></div>
    <input className="username" type="text" placeholder="nom..." onChange={(e)=> {setUserName(e.target.value)}}/>
    <input className="roomname" type="text" placeholder="salle..." onChange={(e)=> {setRoom(e.target.value)}}/>
    <button onClick={connectToRoom}>entrer dans le salon</button>
  </div>
 ):(
<div className="chatContainer"> 
<div className="messages"> 
{messageList.map((val, key) =>{
  return (  
    <div className="messageContainer" id={val.author == userName ? "You" : "Other"}>
      <h1>{val.author}</h1>
  <div className="messageIndividuel"> {""} {val.message}</div>
  </div>);
})}
</div>
<div className="messageInputs">
  <input type="text" placeholder="message..." onChange={(e)=> {setMessage(e.target.value)}}/>
  <button className="sendMessage" onClick={sendMessage}>envoyer</button>
</div>
</div>
 )}
    
    </div>
  );
}

export default App;