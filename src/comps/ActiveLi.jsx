import React from 'react';
import { Link, Route } from 'react-router-dom';

export const ActiveLi = ({ to, ...rest }) => (
  <Route path={to} children={({ match }) => (
    <li role="presentation" className={match ? 'active' : ''}>
      <Link to={to} {...rest}/>
    </li>
  )}/>
);
