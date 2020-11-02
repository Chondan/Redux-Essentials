import React from 'react';
import { useSelector } from 'react-redux';
import { selectPostsByUser } from '../posts/postsSlice';
import { selectUserById } from './usersSlice';
import { Link } from 'react-router-dom';

export const UserPage = ({
  match
}) => {
  const { userId } = match.params;
  const user = useSelector(state => selectUserById(state, userId));
  const userPosts = useSelector(state => selectPostsByUser(state, userId));

  const renderedPostsTitle = userPosts.map(post => (
    <li key={post.id}>
      <Link to={`/Redux-Essentials/posts/${post.id}`}>{post.title}</Link>
    </li>
  ));
  return (
    <section>
      <h2>{user.name}</h2>
      <ul>{renderedPostsTitle}</ul>
    </section>
  );
}