import React from 'react';

const Footer = (props) => {
  return(
    <div id="footer" className="bg-dark p-3">
      <div id="foot-body" className="d-flex justify-content-between">
        <div>
          <h6>
            <a href="#" className="text-white">MessageBoard</a>
          </h6>
        </div>
        <div className="text-white">
          <span className="mx-1">2019</span>
          <span className="far fa-copyright mx-1" />
          <span className="far fa-registered mx-1" />
          <span className="fas fa-trademark mx-1" />
        </div>
        <div>
          <a href="#" className="far fa-question-circle mx-1" />
          <a href="#" className="fas fa-headset mx-1" />
        </div>
      </div>
    </div>
  );
};

export { Footer };