import React from 'react';

// eslint-disable-next-line react/prop-types
export const EllipsisDropdownToggle = React.forwardRef(({children, onClick}, ref) => (
  <a
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span className="fa-solid fa-ellipsis"></span>
    {children}
  </a>
))

EllipsisDropdownToggle.displayName = 'EllipsisDropdownToggle'

