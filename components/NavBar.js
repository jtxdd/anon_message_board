import React from 'react';
import { NavLink } from 'react-router-dom';

const Home = (props) => {
  return(
    <NavLink 
      to="/"
      id="home-link"
      onClick={(clicked) => props.click('home')}>
      MessageBoard
    </NavLink>
  );
};

const BoardCrumb = (props) => {
  return(
    props.board ? (
      <span>
        <span className="mx-2 crumb-slash" />
        <NavLink 
          to={'/threads/' + props.board} 
          className="crumb"
          onClick={(clicked) => props.click(props.board)}>
          {props.board}
        </NavLink>
      </span>
    ) : (
      <span/>
    )
  );
};

const ThreadCrumb = (props) => {
  return(
    props.thread_id ? (
      <span>
        <span className="mx-2 crumb-slash" />
        <span className="crumb">{props.thread_id}</span>
      </span>
    ) : (
      <span/>
    )
  );
};

const Message = (props) => {
  return(
    <div className="ml-auto">
      <h5>
        <span className={props.message === 'Success' ? 'badge badge-success' : 'badge badge-danger'}>
          {props.message}
        </span>
      </h5>
    </div>
  );
};

const NavBar = (props) => {
  return(
    <nav className="navbar navbar-dark bg-dark">
      <Home click={props.click} />
      <BoardCrumb 
        board={props.board} 
        click={props.click} 
      />
      <ThreadCrumb 
        thread_id={props.thread_id} 
        board={props.board} 
      />
      <Message message={props.message} />
    </nav>
  );
};

export { NavBar };