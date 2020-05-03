import axios from "axios";
import { GET_ALL_RESTAURANTS } from "./types";
import { setError } from "./errors";

export const getAllRests = () => dispatch => {
  axios
    .get("/api/restaurants/all")
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllRests(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const updateRest = item => dispatch => {
  axios
    .put(`/api/restaurants/edit/${item._id}`, { name: item.name })
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllRests(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const deleteRest = item => dispatch => {
  axios
    .delete(`/api/restaurants/delete/${item._id}`)
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllRests(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const addRest = name => dispatch => {
  axios
    .post("/api/restaurants/add/", { name })
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllRests(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const setAllRests = rests => {
  return {
    type: GET_ALL_RESTAURANTS,
    payload: rests
  };
};
