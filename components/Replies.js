import React, { Component } from 'react';

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

const ReplyArrow = () => {
  return(
    <span className="fas fa-angle-right reply-arrow" />
  );
};

const Reply_Id = (props) => {
  return(
    <a href="#" className="reply-id">{props.id}</a>
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

const PostButtons = (props) => {
  return(
    <div className="post-buttons">
      <button className="btn btn-sm btn-link btn-greyish" onClick={() => props.report(props.id)}>report</button>
      <span className="dot" />
      <button className="btn btn-sm btn-link btn-greyish" onClick={() => props.delete(props.id)}>delete</button>
    </div>
  );
};

const Reply = (props) => {
  return(
    <div className="reply-card">
      <div className="reply-header">
        <div className="row">
          <div className="col-">
            <ReplyArrow />
            <Reply_Id id={props.id} />
          </div>
          <div className="col-sm-6 px-0">
            <CreateDate created={props.created} />
          </div>
        </div>
        
      </div>
      <div className="reply-body">
        <p className="reply-body-text">
          {props.text}
        </p>
      </div>  
      <div className="reply-footer">
        <PostButtons 
          report={props.reportReply} 
          delete={props.deleteReply} 
          id={props.id} 
        />
      </div>
    </div>
  );
};

class Replies extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.reportReply = this.reportReply.bind(this);
    this.deleteReply = this.deleteReply.bind(this);
  }
  
  reportReply(id) {
    let route = '/api/replies/' + this.props.board;
    let options = {
      method: 'PUT',
      body: JSON.stringify({
        thread_id: this.props.thread_id, 
        reply_id: id
      }),
      headers: {'Content-Type': 'application/json', 'Accept': 'application/json'}
    };
    
    fetch(route, options)
      .then(res => res.json())
      .then(updated => {
        if (updated) {
          this.props.message('Success');
        } else {
          this.props.message('Failed');
        }
      });
  }
  
  deleteReply(id) {
    let { pathname, search } = window.location;
    
    let delete_password = window.prompt('Delete password?', '');
    
    let route = '/api' + pathname + search;
    let options = {
      method: 'DELETE',
      body: JSON.stringify({
        thread_id: this.props.thread_id, 
        reply_id: id,
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
  
  render() {
    const replies = this.props.replies;
    return(
      <div className="container-fluid px-4">
        {replies.map(reply => 
          <Reply 
            key={reply._id}
            id={reply._id}
            text={reply.text}
            created={new Date(reply.created_on).toLocaleString()}
            reportReply={this.reportReply}
            deleteReply={this.deleteReply}
          />
        )}
      </div>
    );
  }
}

export { Replies }