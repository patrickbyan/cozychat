import React from 'react'
import axios from 'axios'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'

class Chat extends React.Component{
    state = { 
        userOnline: [],
        message: [],
        typing: false,
        history: null,
        usersTyping: [],
        error: null
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

        this.props.io.on('error-message', (data) => {
            console.log(data)
            this.setState({error: data})
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
            this.setState({history: data.result})
        })
    }

    onChat = (e) => {
        e.preventDefault();
        
        let data = {
            name: this.props.username,
            message: this.text.value
        }

        console.log(data)
        
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
            <div className="bg-dark">
                <div className="container d-flex justify-content-center align-items-center vh-100">
                    <div className="bg-dark h-sm-50 h-md-50 h-75 mt-n5 rounded shadow">
                        <div className="scroll rounded-top">
                            <div className="row bg-dark text-light sticky-top shadow rounded-top align-items-center p-0 m-0">
                                <div className="mx-xl-4 mx-2 mt-2">
                                    <FontAwesomeIcon icon={ faChevronLeft } className="h4" role="button" />
                                </div>
                                <div className="col-xl-1 col-2 p-1">
                                    <img src="https://yt3.ggpht.com/ytc/AAUvwngYUMi690QgWod4PscWXl1WF4GsyiCtsbpSgZe6bw=s900-c-k-c0x00ffffff-no-rj" className="rounded-circle my-1" style={{width: '100%'}} alt="..." />
                                </div>
                                <div className="col-xl-10 col-9">
                                    <div class="text-light mt-2 text-capitalize h4" style={{fontWeight: '500', letterSpacing: '0.5px'}}>
                                        {this.props.room}
                                    </div>
                                    <div className="mb-xl-2 mt-xl-n1">
                                        <small className="font-weight-normal muted-text h6">
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
                            <div className="mt-2 ml-2">
                                {
                                    this.state.error?
                                        <div className="text-center mt-3">
                                            <span className="between text-light">
                                                {this.state.error.message}
                                            </span>
                                        </div>
                                    :
                                        null
                                }
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
                        <div className="w-100">

                        </div>
                        {/* ######## CHAT BOX ########*/}
                        <form className="navbar bg-white navbar-expand-sm d-flex justify-content-between rounded-bottom shadow mt-n1" onSubmit={this.onChat}> 
                            <input type="text number" ref={(e) => this.text = e} name="text" className="form-control w-md-80 w-100" placeholder="Type a message..." onChange={this.onTyping} />
                            <input type="submit" value="Send" className="btn btn-info" onClick={this.onChat} disabled={this.state.error? this.state.error.error : null} />
                        </form>
                        {/* ######## CHAT BOX ########*/}
                    </div>
                </div>
            </div>
        )
    }
}

export default Chat