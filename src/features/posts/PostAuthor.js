import React from "react";
import { useSelector } from "react-redux";
import { selectUserById } from "../users/usersSlice";

export const PostAuthor = ({ post }) => {
  const user = useSelector((state) => selectUserById(state, post.user));
  return <span>By {user ? user.name : "Unknown Author"}</span>;
};
