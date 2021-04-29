import React from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'

class Chat extends React.Component{
    state = { 
        userOnline: [],
        message: [],
        typing: false,
        history: null,
        usersTyping: []
    }


    componentDidMount(){
        this.props.io.on('user-online', (data) => {
            for(let i = 0; i < data.length; i++){
                if(data[i].name === this.props.username){
                    var index = i
                }
            }
            data.splice(index, 1)
            this.setState({userOnline: data})
        })

        this.props.io.on('send-message-from-server', (data) => {
            let arrMessage = this.state.message
            arrMessage.push(data)
            this.setState({message: arrMessage})
        })

        this.props.io.on('send-chat-back', (data) => {
            let arrMessage = this.state.message
            arrMessage.push(data)
            this.setState({message: arrMessage, typing: false})
        })

        this.props.io.on('typing-message-back', (data) => {
            // if(data.message.length === 0){
            //     this.setState({typing: false})
            // }else{
            //     this.setState({typing: 
            //         <div className="d-flex align-items-center text-right justify-content-end">
            //             <div className="pr-2"><span className="name text-light">{data.from}</span>
            //                 <p className="msg bg-secondary text-light">
            //                     typing
            //                     <span class="spinner-grow spinner-grow-sm ml-1"></span>
            //                     <span class="spinner-grow spinner-grow-sm mx-1"></span>
            //                     <span class="spinner-grow spinner-grow-sm"></span>
            //                 </p>
            //             </div>
            //         </div>    
            //     })
            // }
            console.log(data.message.length)
            if(data.message.length > 0){
                let index = null

                let usersTyping = this.state.usersTyping

                usersTyping.forEach((value, idx) => {
                    if(value.name === data.from){
                        index = idx
                    }
                })

                if(index === null){
                    usersTyping.push({
                        name: data.from
                    })

                    this.setState({usersTyping: usersTyping})
                }
            }else if(data.message.length === 0){
                console.log('masuk length 0')
                let index = null

                let usersTyping = this.state.usersTyping

                usersTyping.forEach((value, idx) => {
                    if(value.name === data.from){
                        index = idx
                    }
                })

                if(index !== null){
                    usersTyping.splice(index, 1)
                    this.setState({usersTyping: usersTyping})
                }

                console.log(usersTyping)
            }
        })

        this.props.io.on('get-chat-history', (data) => {
            this.setState({history: data})
        })
    }

    onChat = (e) => {
        e.preventDefault();
        
        let data = {
            name: this.props.username,
            message: this.text.value
        }
        
        if(data.message.length !== 0){
            this.props.io.emit('send-chat', data)

            axios.post('http://localhost:5000/send-chat', data)
            .then((res) => {
                console.log(res.data)
            })
            .catch((err) => {
                console.log(err.response)
            })
        }

        this.text.value = ''
    }

    onTyping = () => {
        let data = {
            name: this.props.username,
            message: this.text.value
        }

        this.props.io.emit('typing-message', data)
    }

    render(){
        return(
            <div className="wrapper">
                <div className="main bg-dark">
                    <div className="px-2 scroll rounded-top">
                        <div className="container row bg-dark text-light sticky-top shadow rounded-top align-items-center" style={{width: '109.7vh'}}>
                            <div className="col-2 mr-n2">
                                <img src="https://yt3.ggpht.com/ytc/AAUvwngYUMi690QgWod4PscWXl1WF4GsyiCtsbpSgZe6bw=s900-c-k-c0x00ffffff-no-rj" class="rounded-circle w-50" alt="..." />
                            </div>
                            <div className="col-10 ml-n5">
                                <div class="text-light mt-2 text-capitalize" style={{fontWeight: '500', letterSpacing: '0.5px'}}>
                                    {this.props.room}
                                </div>
                                <div className="mb-2 mt-n1">
                                    <small className="font-weight-normal muted-text">
                                        You
                                        {
                                            this.state.userOnline? 
                                                this.state.userOnline.map((value, index) => {
                                                    if(index === this.state.userOnline.length - 1){
                                                        return(
                                                            <span>
                                                                ,&nbsp;{value.name}
                                                            </span>
                                                        )
                                                    }else{
                                                        return(
                                                            <span>
                                                                ,&nbsp;{value.name}
                                                            </span>
                                                        )
                                                    }
                                                })
                                            :
                                                null
                                        }
                                    </small>
                                </div>
                            </div>
                        </div>
                        <div className="mt-2">
                            {
                                this.state.history?
                                    this.state.history.map((value, index) => {
                                        if(index !== this.state.history.length - 1){
                                            if(this.props.username === value.name){
                                                return(
                                                    <div className="d-flex align-items-center">
                                                        <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                            {value.name[0]}
                                                        </p>
                                                        <div className="pr-2 pl-1"> <span className="name text-light">{value.name} (Me)</span>
                                                            <p className="msg bg-secondary text-light">
                                                                {value.message} <small className="ml-2 muted-text" style={{fontSize: '10px'}}>19:02</small>
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div className="d-flex align-items-center text-right justify-content-end">
                                                        <div className="pr-2 pl-1"> <span className="name text-light">{value.name}</span>
                                                            <p className="msg bg-info text-light">
                                                                {value.message}
                                                            </p>
                                                        </div>
                                                        <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                            {value.name[0]}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                        }else{
                                            if(this.props.username === value.name){
                                                return(
                                                    <>
                                                        <div className="d-flex align-items-center">
                                                            <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                                {value.name[0]}
                                                            </p>
                                                            <div className="pr-2 pl-1"> <span className="name text-light">{value.name} (Me)</span>
                                                                <p className="msg bg-secondary text-light">
                                                                    {value.message}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="text-center mt-3">
                                                            <span className="between text-light">
                                                                Earlier chat
                                                            </span>
                                                        </div>
                                                    </>
                                                )
                                            }else{
                                                return(
                                                    <>
                                                        <div className="d-flex align-items-center text-right justify-content-end">
                                                            <div className="pr-2 pl-1"> <span className="name text-light">{value.name}</span>
                                                                <p className="msg bg-info text-light">
                                                                    {value.message}
                                                                </p>
                                                            </div>
                                                            <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                                {value.name[0]}
                                                            </p>
                                                        </div>
                                                        <div className="text-center mt-3">
                                                            <span className="between text-light">
                                                                Earlier chat
                                                            </span>
                                                        </div>
                                                    </>
                                                    
                                                )
                                            }
                                        }
                                    })
                                :
                                    null
                            }
                            
                            {
                                this.state.message?
                                    this.state.message.map((value, index) => {
                                        if(value.from === 'Bot'){
                                            return(
                                                <div key={index} className="text-center mt-3">
                                                    <span className="between text-light">
                                                        {value.message}
                                                    </span>
                                                </div>
                                            )
                                        }else{
                                            if(this.props.username === value.from){
                                                return(
                                                    <div className="d-flex align-items-center">
                                                        <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                            {value.from[0]}
                                                        </p>
                                                        <div className="pr-2 pl-1"> <span className="name text-light">{value.from} (Me)</span>
                                                            <p className="msg bg-secondary text-light">
                                                                {value.message}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )
                                            }else{
                                                return(
                                                    <div className="d-flex align-items-center text-right justify-content-end">
                                                        <div className="pr-2 pl-1"> <span className="name text-light">{value.from} (Me)</span>
                                                            <p className="msg bg-info text-light">
                                                                {value.message}
                                                            </p>
                                                        </div>
                                                        <p className="rounded-circle bg-light text-center mt-3 mr-2 font-weight-bold text-capitalize" style={{fontSize: '16px', width: '40px', height: '40px', paddingTop: '6px'}} alt="img">
                                                            {value.from[0]}
                                                        </p>
                                                    </div>
                                                )
                                            }
                                        }
                                    })
                                :
                                    null
                            }
                            {
                                this.state.usersTyping?
                                 this.state.usersTyping.map((value, index) => {
                                     return(
                                        <div className="d-flex align-items-center text-right justify-content-end">
                                            <div className="pr-2"><span className="name text-light">{value.name}</span>
                                                <p className="msg bg-secondary text-light">
                                                    typing
                                                    <span class="spinner-grow spinner-grow-sm ml-1"></span>
                                                    <span class="spinner-grow spinner-grow-sm mx-1"></span>
                                                    <span class="spinner-grow spinner-grow-sm"></span>
                                                </p>
                                            </div>
                                        </div> 
                                     )
                                 })
                                :
                                 null
                            }
                            
                        </div>
                        <div className="navbar">

                        </div>
                    </div>
                    
                    {/* ######## CHAT BOX ########*/}
                    <form className="navbar bg-white navbar-expand-sm d-flex justify-content-between rounded-bottom shadow mt-n1" onSubmit={this.onChat}> 
                        <input type="text number" ref={(e) => this.text = e} name="text" className="form-control w-100" placeholder="Type a message..." onChange={this.onTyping} />
                        <div className="icondiv d-flex justify-content-end align-content-center text-center ml-2"> 
                            <i><FontAwesomeIcon icon={faArrowCircleRight} role="button" type="submit" className="text-primary h5" onClick={this.onChat}/></i>
                        </div>
                    </form>
                    {/* ######## CHAT BOX ########*/}
                </div>
            </div>
        )
    }
}

export default Chat