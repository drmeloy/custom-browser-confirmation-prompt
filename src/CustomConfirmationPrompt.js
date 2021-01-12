import React from 'react';
import ReactDOM from 'react-dom';

export default function CustomConfirmationPrompt(message, callback, CustomPrompt) {
  const promptEl = document.createElement('div');
  document.body.appendChild(promptEl);

  const closeModal = userResponse => {
    ReactDOM.unmountComponentAtNode(promptEl);
    document.body.removeChild(promptEl);
    callback(userResponse);
  };

  ReactDOM.render(<CustomPrompt message={message} closeModal={closeModal} />, promptEl)
}
