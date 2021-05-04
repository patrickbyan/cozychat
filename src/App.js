import React from 'react';
import './App.css';

// Stylesheet
import './Supports/Stylesheet/Utils.css'

import Chat from './Page/Chat';
import Login from './Page/Login';

import Socket from 'socket.io-client'
const io = Socket('cozychat.herokuapp.com')

class App extends React.Component{
  state = {
    name: null,
    room: null
  }

  onChangeState = (name, room) => {
    this.setState({name : name, room : room})
  }

  render(){
    if(this.state.name === null){
      return(
        <Login io={io} onSubmitButton={this.onChangeState} />
      )
    }

    return(
      <Chat io={io} username={this.state.name} room={this.state.room} />
    )
  }
}

export default App;
