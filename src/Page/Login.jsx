import React from 'react'

class Login extends React.Component{
   
    onSubmitButton = (e) => {
        e.preventDefault();

        let name = this.name.value
        let room = this.room.value

        this.props.io.emit('user-join', {name, room})
        this.props.io.on('total-user', (data) => {
            if(data < 5){
                this.props.onSubmitButton(name, room)
            }else{
                alert('room full')
            }
        })

        localStorage.setItem('name', name)
    }

    render(){
        return(
            <div className="bg-dark">
                <div className="container-md">
                    <div className="row justify-content-center align-items-center" style={{height: '100vh'}}>
                        <div className="col-12 col-md-6 col-sm-12 col-xs-12">
                            <div className="card bg-dark p-4 p-md-4 text-white border-0 shadow">
                                <h6>Hi! Welcome to cozylife</h6>
                                <p className="font-weight-normal">Please insert your username and your desired chat room</p>
                                <form className="form-row justify-content-center my-3 mt-n1" onSubmit={this.onSubmitButton}>
                                    <div className="form-group"> 
                                        <label>Username</label> 
                                        <input type="text" ref={(el) => this.name = el} height="30px" className="form-control bg-transparent border border-light text-light" /> 
                                    </div>
                                    <div className="col-12">

                                    </div>
                                    <div className="form-group"> 
                                        <label>Room</label> 
                                        <input type="text" ref={(el) => this.room = el} height="30px" className="form-control bg-transparent border border-light text-light" /> 
                                    </div>
                                    <button type="submit" class="col-12 btn btn-info" onClick={this.onSubmitButton}>
                                        Start chat
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login