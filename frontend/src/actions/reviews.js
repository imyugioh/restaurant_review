import axios from "axios";
import { GET_REVIEWS } from "./types";
import { getAllRests } from "./restaurants";
import { setError } from "./errors";

export const getAllReviews = () => dispatch => {
  axios
    .get("/api/reviews/all")
    .then(res => {
      dispatch(setError({}));
      dispatch(setRestReviews(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const getReviewsByResID = resid => dispatch => {
  axios
    .get(`/api/reviews/get/${resid}`)
    .then(res => {
      dispatch(setError({}));
      dispatch(setRestReviews(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const updateReview = item => dispatch => {
  axios
    .put(`/api/reviews/edit/${item._id}`, {
      rate: item.rate,
      comment: item.comment
    })
    .then(res => {
      dispatch(setError({}));
      dispatch(setRestReviews(res.data));
      dispatch(getAllRests());
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const deleteReview = item => dispatch => {
  axios
    .delete(`/api/reviews/delete/${item._id}`)
    .then(res => {
      dispatch(setError({}));
      dispatch(setRestReviews(res.data));
      dispatch(getAllRests());
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const addReview = item => dispatch => {
  axios
    .post("/api/reviews/add/", item)
    .then(res => {
      dispatch(setError({}));
      dispatch(setRestReviews(res.data));
      dispatch(getAllRests());
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const setRestReviews = rests => {
  return {
    type: GET_REVIEWS,
    payload: rests
  };
};
