import React from 'react';
import './Button.css';

function Button({children, ...rest}) {

  return (
    <div>
        <button type="button" className="btn btn-blue" {...rest}>{children}</button>
    </div>
  )
}

export default Button;