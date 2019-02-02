import React, { Component } from 'react';


import { OriginalPost } from '../components/OriginalPost.js';
import { Replies } from '../components/Replies.js';
import { Form }   from '../components/Form.js';

class SingleThread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      thread: {},
    };
    this.toggle_newReply = this.toggle_newReply.bind(this);
    this.cancelReply = this.cancelReply.bind(this);
    this.submit_newReply = this.submit_newReply.bind(this);
    this.deleteThread = this.deleteThread.bind(this);
    this.reportThread = this.reportThread.bind(this);
    this.getThread = this.getThread.bind(this);
  }
  
  componentDidMount() {
    const { pathname, search } = this.props.location;
    
    let threadCrumb = search.slice(search.indexOf('=') + 1);
    this.props.threadCrumb(threadCrumb);
    
    this.getThread();
  }
  
  getThread() {
    const { pathname, search } = this.props.location;
    const route = '/api' + pathname + search;
    
    fetch(route)
      .then(res => res.json())
      .then(thread => {
        thread.threadForm = false;
        this.setState({ thread });
      });
  }
  
  toggle_newReply() {
    let { thread } = this.state;
    thread.threadForm = true;
    this.setState({ thread });
  }
  
  cancelReply() {
    let { thread } = this.state;
    thread.threadForm = false;
    this.setState({ thread });
  }
  
  deleteThread(id) {
    let board = this.props.board;
    let pushUrl = '/threads/' + board;
    
    let delete_password = window.prompt('Delete password?', '');
    
    let route = '/api/replies/' + board;
    let options = {
      method: 'DELETE',
      body: JSON.stringify({
        thread_id: id,
        delete_password
      }),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    if (delete_password) {
      fetch(route, options)
        .then(res => res.json())
        .then(updated => {
          if (updated) {
            this.props.message('Success');
            this.props.threadCrumb('');
            this.props.history.push(pushUrl);
          } else {
            this.props.message('Incorrect Password');
          }
        });
    }
  }
  
  reportThread(id) {
    let board = this.props.board
    
    let route = '/api/threads/' + board;
    let options = {
      method: 'PUT',
      body: JSON.stringify({ thread_id: id }),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    fetch(route, options)
      .then(res => res.json())
      .then(result => {
        if (result.message === 'Success') {
          this.props.message('Success');
        } else {
          this.props.message('Failed');
        }
      });
  }
  
  submit_newReply(route, options) {
    let { thread } = this.state;
    
    route += '?thread_id=' + thread._id;
    
    fetch(route, options)
      .then(res => res.json())
      .then(updated => {
        if (updated) {
          this.getThread();
          this.props.message('Success');
        } else {
          this.props.message('Failed');
        }
      });
  }
  
  render() {
    const { thread } = this.state;
    return(
      <div id="single-thread">
        {Object.keys(thread).length > 0 ? (
          <div className="thread-card container">
            <OriginalPost
              id={thread._id}
              created={new Date(thread.created_on).toLocaleString()}
              bumped={new Date(thread.bumped_on).toLocaleString()}
              text={thread.text}
              numReplies={thread.replies.length}
              toggle_newReply={this.toggle_newReply}
              deleteThread={this.deleteThread} 
              reportThread={this.reportThread}
              singleThread={true}
            />
            
            {thread.form &&
              <Form 
                formType={'reply'}
                thread_id={thread._id}
                cancel={this.cancelReply}
                submit_newReply={this.submit_newReply}
              />
            }

            <Replies 
              replies={thread.replies}
              thread_id={thread._id}
              message={this.props.message}
              updateThreads={this.getThread}
            />
          </div>
        ) : (
          <div>loading...</div>
        )}
        
      </div>
    );
  }
}

export { SingleThread };