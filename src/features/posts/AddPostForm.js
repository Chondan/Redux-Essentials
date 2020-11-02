import { unwrapResult } from '@reduxjs/toolkit';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersSlice';
import { addNewPost } from './postsSlice';


export const AddPostForm = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const onTitleChange = e => setTitle(e.target.value);
  const onContentChange = e => setContent(e.target.value);
  const dispatch = useDispatch();
  const [userId, setUserId] = useState('');
  const onSelectAuthorChanged = e => setUserId(e.target.value);
  const userOptions = useSelector(selectAllUsers).map(user => (
    <option key={user.id} value={user.id}>{user.name}</option>
  ));
  const cansave = Boolean(title) && Boolean(content) && Boolean(userId);
  const [addRequestStatus, setAddRequestStatus] = useState("idle");
  const onAddPostClicked = async () => {
    if (cansave) {
      try {
        setAddRequestStatus("pending");
        const resultAction = await dispatch(addNewPost({ title, content, user: userId }));
        unwrapResult(resultAction);
        setTitle('');
        setContent('');
        setUserId('');
      } catch (err) {
        console.error("Failed to save the post: ", err);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  }
  return (
    <section>
      <form>
        <label htmlFor="postTitle">Title:</label>
        <input 
          type="text"
          id="postTitle"
          name="postTitle"
          value={title}
          onChange={onTitleChange}
        />
        <label htmlFor="postAuthor">Post Author:</label>
        <select value={userId} onChange={onSelectAuthorChanged}>
          <option value=""></option>
          {userOptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea 
          type="text"
          id="postContent"
          name="postContent"
          value={content}
          onChange={onContentChange}
        />
        <button onClick={onAddPostClicked} type="button" disabled={!cansave}>Add Post</button>
        {' '}<span>{addRequestStatus}</span>
      </form>
    </section>
  );
}