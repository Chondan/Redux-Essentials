import React from 'react';
import { useDispatch } from 'react-redux';
import { reactionAdded } from './postsSlice';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
}

export const ReactionButtons = ({ post }) => {
  const dispatch = useDispatch();
  const onReactionClicked = (postId, emojiName) => {
    // post & name
    dispatch(reactionAdded(postId, emojiName));
  }
  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => (
    <button 
      type="button" 
      className="muted-button reaction-button" 
      key={name}
      onClick={() => onReactionClicked(post.id, name)}
    >
    {emoji} {post.reactions[name]}
    </button>
  ));
  
  return (
    <div>{reactionButtons}</div>
  );
}