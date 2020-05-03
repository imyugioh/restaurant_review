import React, { Component } from "react";
import { Container, ListGroup, Row, Col, Form } from "react-bootstrap";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import { Rating, Pagination } from "@material-ui/lab";
import { Button, Typography } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import "../public/Home.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getAllRests,
  updateRest,
  deleteRest,
  addRest
} from "../actions/restaurants";
import isEmpty from "../validation/is-empty";
import validateRestaurant from "../validation/restaurants";
import { logoutUser } from "../actions/authentication";

class Restaurants extends Component {
  constructor() {
    super();
    this.state = {
      editing: false,
      adding: false,
      page: 1,
      rowsPerpage: 10,
      editingItem: {},
      newName: "",
      errors: {}
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    } else {
      this.props.getAllRests();
    }
  }

  checkFormValid(value) {
    const prevErr = this.state.errors;
    const { errors } = validateRestaurant({ name: value });
    this.setState({ errors: { ...prevErr, name: errors.name } });
  }

  onCancalAdding() {
    this.setState({ adding: false, newName: "", errors: {} });
  }

  onClickAdd() {
    this.onClickCancel();
    this.setState({ adding: true });
  }

  onSaveAdding() {
    const { newName } = this.state;
    this.props.addRest(newName);
  }

  onClickEdit(item) {
    this.setState({ editing: true, editingItem: item });
  }

  onClickSave() {
    this.props.updateRest(this.state.editingItem);
    this.setState({ editing: false, editingItem: {}, errors: {} });
  }

  onClickDelete(index, item) {
    const { page, rowsPerpage } = this.state;
    this.props.deleteRest(item);
    if (index === (page - 1) * rowsPerpage)
      this.setState({ page: page - 1 < 1 ? 1 : page - 1 });
    this.setState({ editing: false, editingItem: {} });
  }

  onClickCancel() {
    this.setState({ editing: false, editingItem: {} });
  }

  onClickRest = id => {
    this.props.history.push(`/reviews/${id}`);
  };

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
    const { rests } = this.props;
    const {
      editing,
      editingItem,
      errors,
      adding,
      page,
      rowsPerpage
    } = this.state;
    const { user } = this.props.auth;
    const restItems = rests
      .slice((page - 1) * rowsPerpage, page * rowsPerpage)
      .map((element, key) => {
        return (
          <ListGroup.Item key={key}>
            <Row>
              <Col md={user.role === "admin" ? 7 : 9}>
                {editing === true && editingItem._id === element._id ? (
                  <div>
                    <Form.Control
                      type="text"
                      isInvalid={errors.name}
                      value={editing === true ? editingItem.name : element.name}
                      onChange={event => {
                        this.checkFormValid(event.target.value);
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
                  <div onClick={() => this.onClickRest(element._id)}>
                    {element.name}
                  </div>
                )}
              </Col>

              <Col md={user.role === "admin" ? 2 : 3}>
                <Rating
                  value={Number(element.avrating)}
                  precision={0.5}
                  readOnly
                />
              </Col>

              {user.role === "admin" && (
                <Col md={3}>
                  {editing === true && editingItem._id === element._id ? (
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
                      className="mr-2"
                      onClick={() => {
                        this.onClickEdit(element);
                      }}
                    >
                      Edit
                    </Button>
                  )}

                  {editing === true && editingItem._id === element._id ? (
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
                      onClick={() =>
                        this.onClickDelete(
                          key + (page - 1) * rowsPerpage,
                          element
                        )
                      }
                    >
                      Delete
                    </Button>
                  )}
                </Col>
              )}
            </Row>
          </ListGroup.Item>
        );
      });
    return (
      <Container>
        <Row>
          <Col md={10}>
            <Typography variant="h4">Restaurants</Typography>
          </Col>
          {user.role === "admin" && (
            <Col md={2}>
              <Button
                variant="contained"
                className="ml-2"
                color="primary"
                onClick={() => this.onClickAdd()}
              >
                Add
              </Button>
            </Col>
          )}
        </Row>
        <div className="restlist">
          <ListGroup>
            {rests.length > 0 ? (
              restItems
            ) : (
              <ListGroup.Item>No Restaurant</ListGroup.Item>
            )}
          </ListGroup>
          {rests.length > 0 && (
            <Pagination
              count={Math.ceil(rests.length / rowsPerpage)}
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
          className="addrestdlg"
        >
          <DialogTitle id="form-dialog-title">Add Restaurant</DialogTitle>
          <DialogContent>
            <DialogContentText>Enter the Restaurant Name</DialogContentText>
            <Form.Control
              type="text"
              isInvalid={errors.name}
              placeholder="Name"
              onChange={e => {
                this.checkFormValid(e.target.value);
                this.setState({ newName: e.target.value });
              }}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
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

Restaurants.propTypes = {
  getAllRests: PropTypes.func.isRequired,
  updateRest: PropTypes.func.isRequired,
  addRest: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  deleteRest: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  rests: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  rests: state.rests,
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(mapStateToProps, {
    getAllRests,
    updateRest,
    deleteRest,
    logoutUser,
    addRest
  })(Restaurants)
);
