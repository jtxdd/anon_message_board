import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Thread } from '../components/Thread.js';
import { Form }   from '../components/Form.js';


const Pages = (props) => {
  const { pages, board } = props;
  return(
    pages.map((el, i) => 
      <Link 
        key={board + '_page_' + i}
        to={'/threads/' + board + '?page=' + el}
        className="page-link-num">
        {el}
      </Link> 
    )
  );
};
    
const Pagination = (props) => {
  return(
    props.numThreads > 0 ? (
      <div className="page-links">
        <a href="#" className="prev-button">Prev</a>
        <Pages 
          pages={props.pages} 
          board={props.board} 
        />
        <a href="#" className="next-button">Next</a>
      </div>  
    ) : (
      <span />
    )
  );
}; 
    


const NewThreadButton = (props) => {
  return(
    <div className="d-flex">
      <div>
        <span className="create-color">Created</span>
      </div>
      <div>
        <span className="bump-color">Bumped</span>
      </div>
      <div className="ml-auto">
        <button id="newThread" onClick={props.toggle_newThread}>
          <span className="mr-1 fas fa-plus-circle" />
          New Thread
        </button>
      </div>
    </div>
  );
};

const NewThreadForm = (props) => {
  return(
    props.newThread ? ( 
      <Form 
        formType={'thread'} 
        cancel={props.cancel}
        submit_newThread={props.submit_newThread}
        board={props.board}
      />
    ) : (
      <span />
    )
  );
};




    
class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '',
      threads: [],
      newThread: false,
      pages: [],
      toggleIndex: -1
    };
    this.getThreads = this.getThreads.bind(this);
    this.toggle_newThread = this.toggle_newThread.bind(this);
    this.toggle_newReply = this.toggle_newReply.bind(this);
    this.submit_newThread = this.submit_newThread.bind(this);
    this.submit_newReply = this.submit_newReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
  }
  
  componentDidMount() {
    this.getThreads();
  }
  
  getThreads() {
    const board = window.location.pathname.split('/')[2];
    const route = '/api/threads/' + board;
    
    fetch(route)
      .then(res => res.json())
      .then(data => {
        const pages = Array.from(Array(data.pages).keys(), n => n + 1);
        const threads = data.threads;
      
        threads.forEach(thread => thread.threadForm = false);
      
        this.setState({ board, threads, pages });
    });
  }
  
  toggle_newThread() {
    let { threads, toggleIndex } = this.state;
    
    if (toggleIndex >= 0) {
      threads[toggleIndex].threadForm = false;
    }
    
    this.setState(prev => ({
      threads: [...threads],
      toggleIndex: -1,
      newThread: !prev.newThread,
    }));
  }
  
  toggle_newReply(id, index) {
    let { threads, toggleIndex } = this.state;
    
    if (toggleIndex >= 0) {
      threads[toggleIndex].threadForm = false;
      threads[index].threadForm = true;
    } else {
      threads[index].threadForm = true;
    }
    
    this.setState({
      threads: [...threads], 
      toggleIndex: index, 
      newThread: false
    });
  }
  
  cancelReply(id) {
    let { threads, toggleIndex } = this.state;
    
    if (toggleIndex > -1) {
      threads[toggleIndex].threadForm = false;
      
      this.setState({
        threads: [...threads],
        toggleIndex: -1
      });
    }
  }
  
  submit_newThread(route, options) {
    fetch(route, options)
      .then(res => res.json())
      .then(updated => {
        if (updated) {
          this.getThreads();
          this.props.message('Success');
          this.toggle_newThread();
        } else {
          this.props.message('Failed');
        }
      });
  }
  
  submit_newReply(route, options) {    
    fetch(route, options)
      .then(res => res.json())
      .then(updated => {
        if (updated) {
          this.getThreads();
          this.props.message('Success');
        } else {
          this.props.message('Failed');
        }
      });
  }
  
  render() {
    return(
      <div id="board-page">
        
        {!this.state.newThread &&
          <NewThreadButton 
            toggle_newThread={this.toggle_newThread}
          />
        }
        
        <NewThreadForm 
          newThread={this.state.newThread} 
          cancel={this.toggle_newThread}
          submit_newThread={this.submit_newThread}
          board={this.state.board}
        />
        
        <div id="thread-stream">
          {this.state.threads.map((thread, index) => 
            <Thread
              key={thread._id} 
              thread={thread}
              thread_index={index}
              toggle_newReply={this.toggle_newReply}
              cancelReply={this.cancelReply}
              submit_newReply={this.submit_newReply}
              message={this.props.message}
              updateThreads={this.getThreads}
            />
          )}
        </div>
        <Pagination 
          numThreads={this.state.threads.length} 
          pages={this.state.pages}
          board={this.state.board}
        />
      </div>
    );
  }
}

export { Board };