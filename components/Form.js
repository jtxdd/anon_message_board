import React, { Component } from 'react';

const Text = (props) => {
  return(
    <div className="input-group input-group-sm textarea-input">
      <div className="input-group-prepend">
        <span className="input-group-text h-100">Comment</span>
      </div>
      <textarea className="form-control h-100" name="text" value={props.text} onChange={props.change} required />
    </div>
  );
};

const Password = (props) => {
  return(
    <div className="input-group input-group-sm">
      <div className="input-group-prepend">
        <span className="input-group-text">Password</span>
      </div>
      <input type="password" className="form-control" name="delete_password" value={props.password} onChange={props.change} required />
    </div>
  );
};

const Buttons = (props) => {
  return(
    <div className="form-buttons">
      <button 
        type="button" 
        className="btn btn-danger form-cancelBtn mr-1"
        onClick={props.cancel} 
        title="Cancel"
      />
      <button 
        className="btn btn-success form-submitBtn"
        disabled={props.canSubmit}
        title="Submit"
      />
    </div>
  );
};

class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      delete_password: '',
      prevToggled: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
  
  handleCancel() {
    this.setState({ text: '', delete_password: '' });
    //this.props.cancel();
    this.props.cancel(this.props.thread_id);
  }
  
  handleSubmit(e) {
    e.preventDefault();
    
    const { text, delete_password } = this.state;
    //const { board, formType, thread_id } = this.props;
    
    
    let route = '/api/';
    
    let options = {
      method: 'POST',
      body: {},
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    let formType = this.props.formType;
    let board = window.location.pathname.split('/')[2];
    
    if (formType === 'thread') {
      route += 'threads/' + board;
      options.body = JSON.stringify({
        text,
        delete_password
      });
    } else {
      route += 'replies/' + board;
      options.body = JSON.stringify({
        thread_id: this.props.thread_id, 
        text, 
        delete_password
      });
    }
    
    if (formType === 'thread') {
      this.props.submit_newThread(route, options);
    } else {
      this.props.submit_newReply(route, options);
    }
    
    this.setState({ text: '', delete_password: ''});
  }
  
  render() {
    const formTypeClass = this.props.formType === 'thread' ? 'for-newThread ' : 'for-newReply ';
    return(
      <form className={formTypeClass} onSubmit={this.handleSubmit}>
        <div className="container">
          <div className="row mb-1">
            <div className="col textarea-col">
              <Text 
                text={this.state.text} 
                change={this.handleChange} 
              />
            </div>
          </div>
          <div className="row justify-content-between">
            <div className="col-sm-6 mb-1 password-col">
              <Password 
                password={this.state.delete_password} 
                change={this.handleChange} 
              />
            </div>
            <div className="col-sm-6 d-flex justify-content-end align-self-center">
              <Buttons 
                cancel={this.handleCancel} 
                canSubmit={this.state.text.length > 0 ? false : true}
              />
            </div>
          </div>
        </div>
      </form>
    );
  }
}

export { Form };