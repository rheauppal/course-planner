import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #333;
  padding: 10px 20px;
  color: white;
`;

const Logo = styled.h1`
  font-size: 1.5em;
`;

const NavLink = styled(Link)`
  margin: 0 10px;
  color: white;
  text-decoration: none;

  &:hover {
    color: #f7b731;
  }
`;

const Header: React.FC = () => {
  return (
    <Nav>
      <div>
        <Logo>
          <NavLink to="/">College Planner</NavLink>
        </Logo>
      </div>
      <div>
        <NavLink to="/dashboard">Home</NavLink>
        <NavLink to="/about">About</NavLink>
        <NavLink to="/login">Login</NavLink>
      </div>
    </Nav>
  );
};

export default Header;
