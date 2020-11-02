import React from 'react';
import { useSelector } from 'react-redux';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { selectPostById } from './postsSlice';
import { useHistory } from 'react-router-dom';

export const SinglePagePost = ({ match }) => {
  const { postId } = match.params;
  const post = useSelector(state => selectPostById(state, postId));
  const history = useHistory();
  if (!post) {
    return (
      <section>
        <article>
          <span>Post Not Found</span>
        </article>
      </section>
    );
  }
  return (
    <section>
      <article>
        <h3>{post.title}</h3>
        <PostAuthor post={post} />
        <TimeAgo timestamp={post.date} />
        <p>{post.content}</p>
        <span style={{ cursor: "pointer", color: "blue" }} onClick={() => history.goBack()}>Go back</span>
      </article>
    </section>
  );
}