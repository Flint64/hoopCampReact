import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import EventRegistration from './EventRegistration';
// import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <div className="react-eventForm-wrapper">
            {/* <div className="react-eventForm-title">
                <h1>Event Registration</h1>
                <p>Put event name here</p>
            </div> */}
            <div>
                {/* <h2 className="react-eventForm-myself" >Myself</h2> */}
                <EventRegistration/>
            </div>
        </div>
  </React.StrictMode>,
  document.querySelector('#eventRegistrationReactForm')
);

// reportWebVitals();
