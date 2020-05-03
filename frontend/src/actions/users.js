import axios from "axios";
import { GET_ALL_USERS } from "./types";
import { setError } from "./errors";

export const getAllUsers = () => dispatch => {
  axios
    .get("/api/users/all")
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllUsers(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const updateUser = user => dispatch => {
  axios
    .put(`/api/users/edit/${user._id}`, { name: user.name, role: user.role })
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllUsers(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const deleteUser = user => dispatch => {
  axios
    .delete(`/api/users/delete/${user._id}`)
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllUsers(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const addUser = user => dispatch => {
  axios
    .post("/api/users/add/", user)
    .then(res => {
      dispatch(setError({}));
      dispatch(setAllUsers(res.data));
    })
    .catch(err => {
      if (err.response.status === 401)
        dispatch(setError({ error: "Unauthorized" }));
      else dispatch(setError(err.response.data));
    });
};

export const setAllUsers = users => {
  return {
    type: GET_ALL_USERS,
    payload: users
  };
};
