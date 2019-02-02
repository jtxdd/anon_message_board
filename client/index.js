import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import { NavBar } from '../components/NavBar.js';
import { Home }   from '../components/Home.js';
import { Board }  from '../components/Board.js';
import { Footer } from '../components/Footer.js';
import { SingleThread } from '../components/SingleThread.js';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      board: '',
      threadCrumb: ''
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleMessage = this.handleMessage.bind(this);
    this.autoDismiss = this.autoDismiss.bind(this);
    this.setThreadCrumb = this.setThreadCrumb.bind(this);
  }
  
  componentDidMount() {
    console.log(this.props.location);
  }
  
  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      console.log('route change!');
      console.log(this.props.location);
    }
}
  
  handleClick(id) {
    let { threadCrumb } = this.state;
    
    this.setState({
      board: id === 'home' ? '' : id,
      threadCrumb: ''
    });
  }
  
  handleMessage(message) {
    this.setState({ message });
    setTimeout(this.autoDismiss, 3500);
  }
  
  autoDismiss() {
    this.setState(prev => ({ message: !prev.message }));
  }
  
  setThreadCrumb(threadCrumb) {
    this.setState({ threadCrumb });
  }
  
  render() {
    return(
      <div>
        <NavBar 
          board={this.state.board} 
          thread_id={this.state.threadCrumb} 
          message={this.state.message}
          click={this.handleClick}
        />
        <Switch>
          <Route exact path='/' render={(props) => (
            <Home click={this.handleClick} /> 
          )}/>
          <Route path='/threads/:board' render={(props) => (
            <Board message={this.handleMessage} /> 
          )}/>
          <Route path='/replies/:board' render={(props) => (
            <SingleThread 
              {...props}
              board={this.state.board}
              threadCrumb={this.setThreadCrumb} 
              message={this.handleMessage}
            /> 
          )}/>
        </Switch>
        <Footer />
      </div>
    );
  }
}

ReactDOM.render((
  <BrowserRouter>
    <Route children={({...rest}) => <App {...rest} /> }/>
  </BrowserRouter>
), document.getElementById('application'));