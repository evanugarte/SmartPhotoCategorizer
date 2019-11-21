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
import { connect } from "react-redux";
import {Auth} from "aws-amplify";
import {signUpAction} from "../actions/signUpAction";

function Navigation(props) {
  const [isOpen, toggleOpen] = useState(false);
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  const navLinks = [
    { name: "Upload File", link: "/UploadView" },
    { name: "View Files", link: "/Categories" },
    { name: "Profile", link: "/ProfileView" }
  ];
  
  function signup() {
    Auth.currentAuthenticatedUser().then(user =>{
      //console.log(user);
      props.signUpAction({
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
            {props.user.userInfo.email}
          </DropdownToggle>
          <DropdownMenu dark="true">
            <DropdownItem>
              <NavLink onClick={()=>Auth.signOut({})} href="/Login" >
                Sign Out
              </NavLink>
              <NavLink onClick={()=>Auth.currentAuthenticatedUser().then(user =>
                alert("You are signed in as "+
                user.signInUserSession.idToken.payload.email ))}>
                Current User
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
        <NavbarBrand href="/">172 Project 2</NavbarBrand>
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
  user: state.user
});

export default connect(mapStateToProps,
  {signUpAction}
)(Navigation);
