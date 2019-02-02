import React from 'react';
import { Link } from 'react-router-dom';

const boards = ['general','funny','politics','sports','tech'].map((board, i) => ({
    name:  board, 
    key:   board + i, 
    route: '/threads/' + board
  })
);

const BoardsList = (props) => {
  return(
    <div id="boards-list">
      {boards.map(board => 
        <li key={board.key}>
          <Link 
            to={board.route} 
            onClick={(clicked) => props.click(board.name)}>
            {board.name}
          </Link>
        </li>
      )}
    </div>
  );
};

const Home = (props) => {
  return(
    <div id="home-page" className="d-flex flex-column align-items-center mt-3">
      <header id="home-header">Boards</header>
      <BoardsList click={props.click} />
    </div>
  );
};

export { Home };