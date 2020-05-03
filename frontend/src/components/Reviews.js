import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { Rating, Pagination } from "@material-ui/lab";
import { Button, Typography } from "@material-ui/core";
import { Container, ListGroup, Row, Col, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  getReviewsByResID,
  getAllReviews,
  updateReview,
  deleteReview,
  addReview
} from "../actions/reviews";
import { getAllRests } from "../actions/restaurants";
import moment from "moment";
import isEmpty from "../validation/is-empty";
import validateReview from "../validation/review";
import { logoutUser } from "../actions/authentication";
import "../public/Review.css";

class ReviewComponent extends Component {
  constructor() {
    super();
    this.state = {
      editing: false,
      page: 1,
      rowsPerpage: 6,
      editingItem: {},
      newItem: {
        rate: 0,
        comment: ""
      },
      errors: {}
    };
  }

  componentDidMount() {
    if (!this.props.auth.isAuthenticated) {
      this.props.history.push("/login");
    } else {
      this.props.getAllRests();
      this.props.getAllReviews();
    }
  }

  checkFormValid(formID, value) {
    const prevErr = this.state.errors;
    if (formID === "comment") {
      const { errors } = validateReview({ comment: value });
      this.setState({ errors: { ...prevErr, comment: errors.comment } });
    } else if (formID === "rate") {
      const { errors } = validateReview({ rate: value });
      this.setState({ errors: { ...prevErr, rate: errors.rate } });
    }
  }

  onClickEdit(item) {
    this.setState({ editing: true, editingItem: item });
  }

  onClickAdd() {
    const resid = this.props.match.params.id;
    const newItem = { ...this.state.newItem, resid };
    this.props.addReview(newItem);
  }

  onClickCancel() {
    this.setState({ editing: false, editingItem: {} });
  }

  onClickSave() {
    this.props.updateReview(this.state.editingItem);
  }

  onClickDelete(index, item) {
    const { page, rowsPerpage } = this.state;
    this.props.deleteReview(item);
    if (index === (page - 1) * rowsPerpage)
      this.setState({ page: page - 1 < 1 ? 1 : page - 1 });
    this.setState({ editing: false, editingItem: {} });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
      if (isEmpty(nextProps.errors)) {
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
    const { reviews, rests, match } = this.props;
    const {
      editing,
      editingItem,
      newItem,
      errors,
      page,
      rowsPerpage
    } = this.state;
    const { user } = this.props.auth;
    const resid = match.params.id;
    const currentRest = rests.find(elem => {
      return elem._id === resid;
    });
    const currentReviews = reviews.filter(elem => {
      return elem.resid === resid;
    });
    const lastReview = currentReviews.find(elem => {
      return elem._id === currentRest.lastratingid;
    });
    currentReviews.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const givenFeedback = currentReviews.find(elem => {
      return elem.userid === user.id;
    });

    // const tempReview = [...currentReviews];
    // tempReview.sort((a, b) => {return b.rate - a.rate});
    // console.log(tempReview[0]);
    // console.log(tempReview[tempReview.length - 1]);

    const reviewList = currentReviews
      .slice((page - 1) * rowsPerpage, page * rowsPerpage)
      .map((elem, key) => {
        var date = new Date(elem.date).toLocaleString("en-US", {
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
        date = moment(date).format("YYYY-MM-DD HH:mm");
        return (
          <ListGroup.Item key={key}>
            <Row>
              <Col md={2}>
                {editing === true && editingItem._id === elem._id ? (
                  <div>
                    <Rating
                      name={elem._id}
                      value={editing === true ? editingItem.rate : elem.rate}
                      onChange={(event, newValue) => {
                        this.checkFormValid("rate", newValue);
                        this.setState({
                          editingItem: { ...editingItem, rate: newValue }
                        });
                      }}
                    />
                    <Form.Control hidden isInvalid={errors.rate} />
                    <Form.Control.Feedback type="invalid">
                      {errors.rate}
                    </Form.Control.Feedback>
                  </div>
                ) : (
                  <Rating value={Number(elem.rate)} precision={0.5} readOnly />
                )}
              </Col>

              <Col md={user.role === "admin" ? 7 : 10}>
                <Row>
                  <Col md={8}>
                    {editing === true && editingItem._id === elem._id ? (
                      <div>
                        <Form.Control
                          type="text"
                          isInvalid={errors.comment}
                          value={
                            editing === true
                              ? editingItem.comment
                              : elem.comment
                          }
                          onChange={event => {
                            this.checkFormValid("comment", event.target.value);
                            this.setState({
                              editingItem: {
                                ...editingItem,
                                comment: event.target.value
                              }
                            });
                          }}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.comment}
                        </Form.Control.Feedback>
                      </div>
                    ) : (
                      elem.comment
                    )}
                  </Col>
                  <Col>
                    <Typography
                      variant="caption"
                      display="block"
                      style={{ color: "grey" }}
                    >
                      {date}
                    </Typography>
                  </Col>
                </Row>
              </Col>

              {user.role === "admin" && (
                <Col md={3}>
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
                      className="mr-4"
                      onClick={() => this.onClickEdit(elem)}
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
                      onClick={() =>
                        this.onClickDelete(key + (page - 1) * rowsPerpage, elem)
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
          <Col md={2}>
            <Link to="/">
              <Button variant="contained" color="primary">
                Back
              </Button>
            </Link>
          </Col>
          <Col>
            <Typography variant="h4">
              {currentRest && currentRest.name} Review
            </Typography>
          </Col>
        </Row>
        {currentReviews.length > 0 && (
          <div className="ratingBox">
            <div className="ratingContainer">
              <Row>
                <Col md={4}>
                  <Row>
                    Average Rating
                    <Rating
                      value={Number(currentRest.avrating)}
                      precision={0.5}
                      readOnly
                    />
                    {Number(currentRest.avrating).toFixed(2)}
                  </Row>
                </Col>
                <Col md={4}>
                  <Row>
                    Highest Rating
                    <Rating
                      value={Number(currentRest.maxrating)}
                      precision={0.5}
                      readOnly
                    />
                  </Row>
                </Col>
                <Col md={4}>
                  <Row>
                    <Typography>Lowest Rating</Typography>
                    <Rating
                      value={Number(currentRest.minrating)}
                      precision={0.5}
                      readOnly
                    />
                  </Row>
                </Col>
              </Row>
            </div>
            {lastReview && (
              <div className="lastRating">
                <Row>
                  <Col md={2}>Latest Review</Col>
                  <Col>
                    <Row>
                      <Rating
                        value={Number(lastReview.rate)}
                        precision={0.5}
                        style={{ marginRight: "10px" }}
                        readOnly
                      />
                      {lastReview.comment}
                    </Row>
                  </Col>
                </Row>
              </div>
            )}
          </div>
        )}
        <div className="rateus">
          {givenFeedback === undefined ? (
            <Row>
              <p className="ratetag">Please Rate US!</p>
              <Form inline style={{ width: "100%" }} redirect="#">
                <Col md={2}>
                  <Rating
                    name="newRating"
                    onChange={(event, newValue) => {
                      this.checkFormValid("rate", newValue);
                      this.setState({
                        newItem: { ...newItem, rate: newValue }
                      });
                    }}
                  />
                  <Form.Control hidden isInvalid={errors.rate} />
                  <Form.Control.Feedback type="invalid">
                    {errors.rate}
                  </Form.Control.Feedback>
                </Col>
                <Col md={8}>
                  <Form.Control
                    type="textedit"
                    placeholder="Comment"
                    isInvalid={errors.comment}
                    style={{ width: "100%" }}
                    onChange={e => {
                      this.checkFormValid("comment", e.target.value);
                      this.setState({
                        newItem: { ...newItem, comment: e.target.value }
                      });
                    }}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.comment}
                  </Form.Control.Feedback>
                </Col>
                <Col md={2}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => this.onClickAdd()}
                  >
                    Rate
                  </Button>
                </Col>
              </Form>
            </Row>
          ) : (
            <Row>
              <p
                style={{
                  margin: "auto",
                  paddingTop: "10px"
                }}
              >
                Thanks for your feedback!
              </p>
            </Row>
          )}
        </div>
        <div className="reviewlist">
          <ListGroup>
            {currentReviews.length > 0 ? (
              reviewList
            ) : (
              <ListGroup.Item>No Reviews</ListGroup.Item>
            )}
          </ListGroup>
          {currentReviews.length > 0 && (
            <Pagination
              count={Math.ceil(currentReviews.length / rowsPerpage)}
              color="primary"
              className="pagination"
              onChange={(event, page) => {
                this.setState({ page });
              }}
            />
          )}
        </div>
      </Container>
    );
  }
}

ReviewComponent.propTypes = {
  getReviewsByResID: PropTypes.func.isRequired,
  getAllReviews: PropTypes.func.isRequired,
  updateReview: PropTypes.func.isRequired,
  deleteReview: PropTypes.func.isRequired,
  getAllRests: PropTypes.func.isRequired,
  addReview: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  reviews: PropTypes.array.isRequired,
  rests: PropTypes.array.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  reviews: state.reviews,
  rests: state.rests,
  auth: state.auth,
  errors: state.errors
});

export default withRouter(
  connect(mapStateToProps, {
    getAllRests,
    getAllReviews,
    getReviewsByResID,
    deleteReview,
    logoutUser,
    updateReview,
    addReview
  })(ReviewComponent)
);
