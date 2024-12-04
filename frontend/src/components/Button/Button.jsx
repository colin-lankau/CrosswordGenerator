import React from 'react';
import './Button.css';

function Button({children, ...rest}) {

  return (
    <>
        <button type="button" className="btn btn-blue inline-flex items-center" {...rest}>{children}</button>
    </>
  )
}

export default Button;