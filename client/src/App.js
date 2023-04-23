import { useState } from 'react';
import io from 'socket.io-client';
import './App.css';
import Chat from './Chat';

export default function App() {
  const socket = io.connect('http://localhost:3001');

  const [chatState, setChatState] = useState({
    isChatShown: false,
    roomId: '',
    username: '',
  });

  const changeChatState = (updatedParam) => {
    setChatState(prevState => Object.assign({}, prevState, updatedParam));
  }

  const joinRoom = () => {
    if (!(chatState.username.trim() && chatState.roomId.trim())) {
      return;
    }

    socket.emit('join-room', chatState);
    changeChatState({ isChatShown: true })
  };

  return (
    <div className='App'>
      <div className="container">
        <div className="jumbotron">
          { !chatState.isChatShown ? (
            <div className='joinChatContainer'>
              <h3 className='display-2'>Join A Chat</h3>
              <input
                className='form-control'
                type='text'
                placeholder='Your name'
                onChange={(event) => {
                  changeChatState({username: event.target.value})
                }}
                onKeyPress={(event) => {
                  event.key === 'Enter' && joinRoom();
                }}
              />
              <input
                className='form-control'
                type='text'
                placeholder='Room ID to chat'
                onChange={(event) => {
                  changeChatState({roomId: event.target.value})
                }}
                onKeyPress={(event) => {
                  event.key === 'Enter' && joinRoom();
                }}
              />
              <button
                className='btn btn-success'
                onClick={joinRoom}
              >Join a room</button>
            </div>
          ) : (
            <Chat socket={socket} username={chatState.username} roomId={chatState.roomId} changeChatState={changeChatState} />
          )}
        </div>
      </div>

    </div>
  );
}