import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";
import { Link } from "react-router-dom";
import {Auth} from "aws-amplify";
import {signupAction} from "../actions/signupAction";
import { connect } from "react-redux";






function Navigation(props) {
  const [isOpen, toggleOpen] = useState(false);
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  const navLinks = [
    { name: "Upload File", link: "/UploadView" },
    { name: "View Files", link: "/Categories" },
  ];
  
  function signup () {
    Auth.currentAuthenticatedUser().then(user =>{
      console.log(user);
      props.signupAction({
        email: user.signInUserSession.idToken.payload.email, 
        userid: user.username});
    });
  }

  function getDropDown() {
    if (props.authed) {
      return (
        <Dropdown
          navbar="true"
          isOpen={dropdownOpen}
          toggle={() => toggleDropdownOpen(!dropdownOpen)}
        >
          <DropdownToggle navbar="true" caret>
            Account Options
          </DropdownToggle>
          <DropdownMenu dark="true">
            <DropdownItem>
              <NavLink onClick={()=>Auth.signOut({global:true})} href="/Login" >
                Sign Out
              </NavLink>
              <NavLink>
                {Auth.currentAuthenticatedUser().then(user =>
                  alert("You are signed in as "+user.signInUserSession.idToken.payload.email))}
              </NavLink>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      );
    }
  }

  return (
    <Navbar color="dark" dark={true} expand="sm">
      <Container>
        <NavbarBrand tag={Link} to="/">172 Project 2</NavbarBrand>
        <Collapse isOpen={isOpen} navbar={true}>
          <Nav className="mr-auto" navbar>
            {props.authed && navLinks.map((option, index) => {
              return (
                <NavItem key={index}>
                  <NavLink tag={Link} to={option.link}>{option.name}</NavLink>
                </NavItem>
              );
            })}
          </Nav>

          <Nav className="ml-auto" nav="true">
            {signup()}
            {getDropDown()}
          </Nav>
        </Collapse>
        <NavbarToggler onClick={() => toggleOpen(!isOpen)} />
      </Container>
    </Navbar>
  );
}

const mapStateToProps = state => ({
  
});

export default connect(
  mapStateToProps,
  { signupAction }
)(Navigation);
