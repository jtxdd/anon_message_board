import React from 'react';


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
          onClick={() => props.collapse(props.id)} 
        />
      ) : (
        <button 
          className={'min-btn btn btn-outline-secondary fas fa-plus'} 
          onClick={() => props.collapse(props.id)} 
        />
      )}
    </div>
  );
};

const Thread_Id = (props) => {
  return(
    <a href="#">{props.id}</a>
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

const PostButtons = (props) => {
  return(
    <div className="post-buttons">
      <button 
        className="btn btn-sm btn-link btn-greenish" 
        onClick={() => props.reply(props.id, props.thread_index)}>
        {grammar(props.numReplies)}
      </button>
      <span className="dot"/>
      <button 
        className="btn btn-sm btn-link btn-greyish"
        onClick={() => props.report(props.id)}>
        report
      </button>
      <span className="dot" />
      <button 
        className="btn btn-sm btn-link btn-greyish"
        onClick={() => props.delete(props.id)}>
        delete
      </button>
    </div>
  );
};

const OriginalPost = (props) => {
  return(
    <div className="op-card">
      
      <div className="op-header">
        <MinimizeButton 
          collapse={props.collapse}
          open={props.open}
          singleThread={props.singleThread}
          id={props.id}
        />
        
        <div className="row">
          
          <div className="col-">
            <Thread_Id id={props.id} />
          </div>
          
          <div className="col-sm-6 px-0">
            <div className="d-flex">
              <CreateDate created={props.created} />
              {props.numReplies > 0 && 
                <BumpDate bumped={props.bumped} />
              }
            </div>
                
              
            
          </div>
        </div>
        
      </div>
      
      <div className="op-body">
        <p className="body-text">
          {props.text}
        </p>
      </div>
      
      <div className="op-footer">
        <PostButtons 
          numReplies={props.numReplies}
          reply={props.toggle_newReply} 
          report={props.reportThread}
          delete={props.deleteThread}
          id={props.id}
          thread_index={props.thread_index}
        />
      </div>
    </div>
  );
};


export { OriginalPost };