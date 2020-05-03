import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authentication";
import { withRouter } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import "../public/NavBar.css";
class NavBar extends Component {
  onLogout(e) {
    e.preventDefault();
    this.props.logoutUser(this.props.history);
    this.props.history.push("/login");
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;
    const userAuthLinks = (
      <Nav className="ml-auto">
        <Nav.Item onClick={this.onLogout.bind(this)}>
          Log Out {user.name}
        </Nav.Item>
      </Nav>
    );
    const adminAuthLinks = (
      <Nav className="ml-auto">
        <Nav.Item>
          <Link to="/">Restaurants</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/users">Users</Link>
        </Nav.Item>
        <Nav.Item onClick={this.onLogout.bind(this)}>
          Log Out {user.name}
        </Nav.Item>
      </Nav>
    );
    const guestLinks = (
      <Nav className="ml-auto">
        <Nav.Item>
          <Link to="/register">Sign Up</Link>
        </Nav.Item>
        <Nav.Item>
          <Link to="/login">Sign In</Link>
        </Nav.Item>
      </Nav>
    );
    return (
      <Navbar bg="light" variant="light">
        <Navbar.Brand>
          <Link to="/">
            {isAuthenticated && user.role === "admin"
              ? "Restaurants Management System"
              : "Restaurants"}
          </Link>
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          {isAuthenticated
            ? user.role === "user"
              ? userAuthLinks
              : adminAuthLinks
            : guestLinks}
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { logoutUser })(withRouter(NavBar));
