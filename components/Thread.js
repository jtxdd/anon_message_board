import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { OriginalPost } from '../components/OriginalPost.js';
import { Replies } from '../components/Replies.js';
import { Form }   from '../components/Form.js';


function dateTime(str) {
  const dateFormat = (d) => {
    d = d.split('/');
    let date = d.map((el,i) => i === 2 ? el.slice(2) : el);
    return date.join('/') + ',';
  };

  const timeFormat = (t) => {
    let period = t.slice(-3);
    let end = t.lastIndexOf(':');
    return t.slice(0, end) + period;
  };

  let date = dateFormat(str.split(',')[0]);
  let time = timeFormat(str.split(',')[1]);
  
  return date + time;
}

function grammar(num) {
  return num > 0 ? (num > 1 ? num + ' comments' : num + ' comment') : num + ' comments';
}


const MinimizeButton = (props) => {
  return(
    <div className={props.singleThread ? 'not-visible float-left' : 'float-left'}>
      {props.open ? (
        <button 
          className={'min-btn btn btn-outline-secondary fas fa-minus'} 
          onClick={props.collapse}
        />
      ) : (
        <button 
          className={'min-btn btn btn-outline-secondary fas fa-plus'} 
          onClick={props.collapse} 
        />
      )}
    </div>
  );
};

const CreateDate = (props) => {
  return(
    <div className="create-date">
      <span className="dot">
        <span className="meta-txt">{dateTime(props.created)}</span>
      </span>
    </div>
  );
};

const BumpDate = (props) => {
  return(
    <div className="bump-date">
      <span className="dot">
        <span className="bump-meta-txt">{dateTime(props.bumped)}</span>
      </span>
    </div>
  );
};

const Collapsed = (props) => {
  return(
    <div className="thread-card-collapsed container">
      <div className="collapsed">
        <MinimizeButton collapse={() => props.collapse(props.id)} open={props.open} />
        <div className="collapsed-meta">
          <a href="#">{props.id}</a>
          <CreateDate created={props.created} />
          <BumpDate bumped={props.bumped} />
          <span className="dot">
            <span className="meta-txt">{grammar(props.numReplies)}</span>
          </span>
        </div>
      </div>
    </div>
  );
};


const ViewAllLink = (props) => {
  return(
    props.viewAll ? (
      <Link to={props.route}>View all replies</Link>
    ) : (
      <span />
    )
  );
};


class Thread extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: '', 
      open: true,
    };
    this.deleteThread = this.deleteThread.bind(this);
    this.reportThread = this.reportThread.bind(this);
    this.viewAllRoute = this.viewAllRoute.bind(this);
    this.handleCollapse = this.handleCollapse.bind(this);
  }
  
  componentDidMount() {
    this.setState({ board: window.location.pathname.split('/')[2] });
  }
  
  viewAllRoute(id) {
    const { board } = this.state;
    return '/replies/' + board + '?thread_id=' + id;
  }
  
  deleteThread(id) {
    let { board } = this.state;
    
    let delete_password = window.prompt('Delete password?', '');
    
    let route = '/api/threads/' + board;
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
        .then(result => {
          if (result.message === 'Success') {
            this.props.message('Success');
            this.props.updateThreads();
          } else {
            this.props.message('Incorrect Password');
          }
        });
    }
  }
  
  reportThread(id) {
    let { board } = this.state;
    
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
  
  handleCollapse(id) {
    this.props.cancelReply();
    this.setState(prev => ({ open: !prev.open }));
  }
  
  render() {
    const { thread } = this.props;
    return(
      this.state.open ? (
        <div className="thread-card container">
          <OriginalPost
            id={thread._id}
            created={new Date(thread.created_on).toLocaleString()}
            bumped={new Date(thread.bumped_on).toLocaleString()}
            text={thread.text}
            numReplies={thread.comments}
            toggle_newReply={this.props.toggle_newReply}
            deleteThread={this.deleteThread} 
            reportThread={this.reportThread}
            collapse={this.handleCollapse}
            open={this.state.open}
            singleThread={false}
            thread_index={this.props.thread_index}
          />
          
          {thread.threadForm && 
            <Form 
              formType={'reply'}
              thread_id={thread._id}
              cancel={this.props.cancelReply}
              submit_newReply={this.props.submit_newReply}
              board={this.state.board}
            />
          }
          
          <Replies 
            replies={thread.replies}
            thread_id={thread._id}
            board={this.state.board}
            message={this.props.message}
            updateThreads={this.props.updateThreads}
          />
          
          <ViewAllLink 
            viewAll={thread.comments > 3} 
            route={this.viewAllRoute(thread._id)}
          />
        </div>
      ) : (
        <Collapsed 
          open={this.state.open} 
          collapse={this.handleCollapse}
          id={thread._id}
          created={new Date(thread.created_on).toLocaleString()}
          bumped={new Date(thread.bumped_on).toLocaleString()}
          numReplies={thread.comments}
        />
      )
    );
  }
}

export { Thread };