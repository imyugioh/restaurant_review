import React, { Component } from "react";
import { Container, Table, Row, Col, Form } from "react-bootstrap";
import { Button, Typography } from "@material-ui/core";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Pagination } from "@material-ui/lab";
import { withRouter } from "react-router-dom";
import "../public/Users.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getAllUsers, updateUser, deleteUser, addUser } from "../actions/users";
import isEmpty from "../validation/is-empty";
import validateUser from "../validation/user";
import { logoutUser } from "../actions/authentication";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      editing: false,
      adding: false,
      page: 1,
      rowsPerpage: 8,
      editingItem: {},
      newItem: {
        role: "user"
      },
      errors: {}
    };
  }

  checkFormValid(formID, value) {
    const prevErr = this.state.errors;
    if (formID === "name") {
      const { errors } = validateUser({ name: value });
      this.setState({ errors: { ...prevErr, name: errors.name } });
    } else if (formID === "email") {
      const { errors } = validateUser({ email: value });
      this.setState({ errors: { ...prevErr, email: errors.email } });
    } else if (formID === "password") {
      const { errors } = validateUser({ password: value });
      this.setState({ errors: { ...prevErr, password: errors.password } });
    }
  }

  componentDidMount() {
    const { isAuthenticated, user } = this.props.auth;
    if (!isAuthenticated) {
      this.props.history.push("/login");
    } else {
      if (user.role !== "admin") {
        this.props.history.push("/");
      } else {
        this.props.getAllUsers();
      }
    }
  }

  onCancalAdding() {
    this.setState({ adding: false, newItem: { role: "user" }, errors: {} });
  }

  onSaveAdding() {
    const { newItem } = this.state;
    this.props.addUser({ ...newItem });
  }

  onClickAdd() {
    this.onClickCancel();
    this.setState({ adding: true });
  }

  onClickEdit(item) {
    this.setState({ editing: true, editingItem: item });
  }

  onClickSave() {
    this.props.updateUser(this.state.editingItem);
  }

  onClickDelete(index, item) {
    const { page, rowsPerpage } = this.state;
    this.props.deleteUser(item);
    if (index === (page - 1) * rowsPerpage)
      this.setState({ page: page - 1 < 1 ? 1 : page - 1 });
    this.setState({ editing: false, editingItem: {}, errors: {} });
  }

  onClickCancel() {
    this.setState({ editing: false, editingItem: {}, errors: {} });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
      if (isEmpty(nextProps.errors)) {
        if (this.state.adding) this.onCancalAdding();
        if (this.state.editing) this.onClickCancel();
      }
      if (nextProps.errors.error) {
        if (nextProps.errors.error === "Unauthorized") {
          this.props.logoutUser(this.props.history);
        }
      }
    }
  }

  render() {
    const { users } = this.props;
    const currentUser = this.props.auth.user;
    const {
      editing,
      editingItem,
      newItem,
      errors,
      adding,
      page,
      rowsPerpage
    } = this.state;
    const userItems = users
      .slice((page - 1) * rowsPerpage, page * rowsPerpage)
      .map((elem, key) => {
        return (
          <tr key={key}>
            <td>{key + 1 + (page - 1) * rowsPerpage}</td>
            <td>
              {editing === true && editingItem._id === elem._id ? (
                <div>
                  <Form.Control
                    type="text"
                    value={editing === true ? editingItem.name : elem.name}
                    isInvalid={errors.name}
                    onChange={event => {
                      this.checkFormValid("name", event.target.value);
                      this.setState({
                        editingItem: {
                          ...editingItem,
                          name: event.target.value
                        }
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.name}
                  </Form.Control.Feedback>
                </div>
              ) : (
                elem.name
              )}
            </td>
            <td>{elem.email}</td>
            <td>
              <Form.Control
                as="select"
                value={
                  editing === true && editingItem._id === elem._id
                    ? editingItem.role
                    : elem.role
                }
                onChange={e => {
                  this.setState({
                    editingItem: { ...editingItem, role: e.target.value }
                  });
                }}
                disabled={!(editing === true && editingItem._id === elem._id)}
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </Form.Control>
            </td>
            <td>
              {editing === true && editingItem._id === elem._id ? (
                <Button
                  variant="contained"
                  className="mr-4"
                  onClick={() => this.onClickSave()}
                >
                  Save
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  disabled={currentUser.id === elem._id}
                  className="mr-2"
                  onClick={() => {
                    this.onClickEdit(elem);
                  }}
                >
                  Edit
                </Button>
              )}
              {editing === true && editingItem._id === elem._id ? (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => this.onClickCancel()}
                >
                  Cancel
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="secondary"
                  disabled={currentUser.id === elem._id}
                  onClick={() =>
                    this.onClickDelete(key + (page - 1) * rowsPerpage, elem)
                  }
                >
                  Delete
                </Button>
              )}
            </td>
          </tr>
        );
      });
    return (
      <Container>
        <Row>
          <Col md={10}>
            <Typography variant="h4">Users</Typography>
          </Col>
          <Col>
            <Button
              variant="contained"
              className="ml-2"
              color="primary"
              onClick={() => this.onClickAdd()}
            >
              Add
            </Button>
          </Col>
        </Row>
        <div className="userlist">
          <Table striped bordered hover variant="light">
            <thead>
              <tr>
                <th>No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th></th>
              </tr>
            </thead>
            <tbody>{users.length > 0 ? userItems : <tr></tr>}</tbody>
          </Table>
          {users.length > 0 && (
            <Pagination
              count={Math.ceil(users.length / rowsPerpage)}
              color="primary"
              className="pagination"
              onChange={(event, page) => {
                this.setState({ page });
              }}
            />
          )}
        </div>
        <Dialog
          open={adding}
          onClose={() => this.onCancalAdding()}
          aria-labelledby="form-dialog-title"
          className="addUserDlg"
        >
          <DialogTitle id="form-dialog-title">Add User</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the User Information</DialogContentText>
            <Form.Control
              type="text"
              placeholder="Name"
              isInvalid={errors.name}
              onChange={e => {
                this.checkFormValid("name", e.target.value);
                this.setState({
                  newItem: { ...newItem, name: e.target.value }
                });
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
            <Form.Control
              type="email"
              placeholder="Email"
              isInvalid={errors.email}
              onChange={e => {
                this.checkFormValid("email", e.target.value);
                this.setState({
                  newItem: { ...newItem, email: e.target.value }
                });
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <Form.Control
              type="text"
              placeholder="Password"
              isInvalid={errors.password}
              onChange={e => {
                this.checkFormValid("password", e.target.value);
                this.setState({
                  newItem: { ...newItem, password: e.target.value }
                });
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
            <Form.Control
              as="select"
              onChange={e => {
                this.setState({
                  newItem: { ...newItem, role: e.target.value }
                });
              }}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </Form.Control>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => this.onSaveAdding()} color="primary">
              Save
            </Button>
            <Button onClick={() => this.onCancalAdding()} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    );
  }
}

Users.propTypes = {
  getAllUsers: PropTypes.func.isRequired,
  updateUser: PropTypes.func.isRequired,
  addUser: PropTypes.func.isRequired,
  deleteUser: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  users: state.users,
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(mapStateToProps, {
    getAllUsers,
    updateUser,
    logoutUser,
    addUser,
    deleteUser
  })(Users)
);
