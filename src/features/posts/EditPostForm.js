import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useInputForm } from '../../customHooks/useInputForm';
import { postUpdated, selectPostById } from './postsSlice';

export const EditPostForm = ({ match }) => {
  const { postId } = match.params;
  const post = useSelector(state => selectPostById(state, postId));
  const [ title, onTitleChanged ] = useInputForm(post.title);
  const [ content, onContentChanged ] = useInputForm(post.content);
  const dispatch = useDispatch();
  const history = useHistory();
  const onSavePostClicked = (e) => {
    e.preventDefault();
    dispatch(postUpdated(postId, title, content, new Date().toISOString()));
    history.goBack();
  }
  const cansave = Boolean(title) && Boolean(content);
  return (
    <section>
      <form>
        <label htmlFor="postTitle">Title:</label>
        <input 
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChanged}
        />
        <label htmlFor="postConten">Content:</label>
        <textarea 
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChanged}
        />
        <button onClick={onSavePostClicked} disabled={!cansave}>Save Post</button>
      </form>
    </section>
  );
}