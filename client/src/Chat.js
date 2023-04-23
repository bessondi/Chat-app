import React, { useEffect, useState } from 'react'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({ socket, username, roomId, changeChatState }) {
  const [messageList, setMessageList] = useState([]);
  const [currentMessage, setCurrentMessage] = useState('');

  const sendMessage = async () => {
    if (!currentMessage) {
      return;
    }

    const messageData = {
      roomId: roomId,
      author: username,
      message: currentMessage,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes(),
    };

    await socket.emit('send-message', messageData);
    setMessageList((list) => [...list, messageData]);
    setCurrentMessage('');
  };

  const leaveRoom = () => {
      socket.emit('leave-room', roomId);
      changeChatState({
        roomId: '',
        username: '',
        isChatShown: false
      });
  };

  useEffect(() => {
    socket.on('receive-message', (data) => {
      setMessageList((list) => [...list, data]);
    });

    return () => socket.off('receive-message');
  }, [socket]);

  return (
    <div className='chat-window'>
      <div className='chat-header'>
        <p>Live Chat in room {roomId}</p>
      </div>
      <div className='chat-body'>
        <ScrollToBottom className='message-container'>
          {messageList.map((messageContent, index) => {
            return (
              <div
                className='message'
                key={index}
                id={messageContent.username === messageContent.author ? 'you' : 'other'}
              >
                <div>
                   <div className='message-meta'>
                    <p id='time'>{messageContent.time}</p>
                    <p id='author'>{messageContent.author}</p>
                  </div>

                  <div className='message-content'>
                    <p>{messageContent.message}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className='chat-footer'>
        <input
          className='form-control'
          type='text'
          value={currentMessage}
          placeholder='Your message...'
          onChange={(event) => {
            setCurrentMessage(event.target.value);
          }}
          onKeyPress={(event) => {
            event.key === 'Enter' && sendMessage();
          }}
        />
        <button className='btn btn-success' onClick={sendMessage}>&#9658;</button>
      </div>
        <button className='btn btn-warning' onClick={leaveRoom}>Leave room</button>
    </div>
  );
}

export default Chat;