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

function Navigation(props) {
  const [isOpen, toggleOpen] = useState(false);
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  const navLinks = [
    { name: "Upload File", link: "/UploadView" },
    { name: "View Files", link: "/" },
  ];
  

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
              <NavLink
                onClick={() => props.handleLogout()}
                href="/login">
                Log out
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
                  <NavLink href={option.link}>{option.name}</NavLink>
                </NavItem>
              );
            })}
          </Nav>

          <Nav className="ml-auto" nav="true">
            {getDropDown()}
          </Nav>
        </Collapse>
        <NavbarToggler onClick={() => toggleOpen(!isOpen)} />
      </Container>
    </Navbar>
  );
}

export default Navigation;
