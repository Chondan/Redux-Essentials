import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { PostAuthor } from './PostAuthor';
import { TimeAgo } from './TimeAgo';
import { ReactionButtons } from './ReactionButtons';
import { fetchPosts, selectPostIds, selectPostById } from './postsSlice';

let Post = ({ postId }) => {
  const post = useSelector(state => selectPostById(state, postId));
  return (
    <article>
      <h3>{post.title}</h3>
      <PostAuthor post={post} />
      <TimeAgo timestamp={post.date} />
      <p>{post.content.substring(0, 40)}{post.content.length > 40 ? "..." : ""}</p>
      <ReactionButtons post={post} />
      <Link to={`/Redux-Essentials/posts/${post.id}`}>View Post</Link>{' | '}
      <Link to={`/Redux-Essentials/editPost/${post.id}`}>Edit Post</Link>
    </article>
  );
}
Post = React.memo(Post);

export const PostsList = () => {
  const orderedPosts = useSelector(selectPostIds);

  const dispatch = useDispatch();
  const postStatus = useSelector(state => state.posts.status);
  
  useEffect(() => {
    if (postStatus === "idle") {
      dispatch(fetchPosts());
    }
  }, [postStatus, dispatch]);

  const error = useSelector(state => state.posts.error);

  let content;
  if (postStatus === "loading") {
    content = <div className="loading">Loading...</div>;
  } else if (postStatus === "succeeded") {
    content = orderedPosts.map(postId => (
      <Post key={postId} postId={postId} />
    ));
  } else if (postStatus === "failed") {
    content = <div>{error}</div>;
  }

  return (
    <section>
      {content}
    </section>
  );
}