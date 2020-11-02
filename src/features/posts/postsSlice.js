import { createSlice, nanoid, createAsyncThunk, createSelector, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const reactionEmoji = {
  thumbsUp: '👍',
  hooray: '🎉',
  heart: '❤️',
  rocket: '🚀',
  eyes: '👀'
};

const reactions = Object.keys(reactionEmoji).reduce((nextObj, key) => {
  nextObj[key] = 0;
  return nextObj;
}, {});

const postsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = postsAdapter.getInitialState({
  status: "idle",
  error: null
});

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await client.get("/fakeApi/posts");
  return response.posts;
});

export const addNewPost = createAsyncThunk(
  "posts/addNewPosts",
  async initialPost => {
    const response = await client.post("/fakeApi/posts", { post: initialPost });
    return response.post;
  }
)

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    postAdded: {
      reducer(state, action) {
        state.posts.push(action.payload);
      },
      prepare(title, content, userId) {
        return {
          payload: {
            id: nanoid(),
            title,
            content,
            date: new Date().toISOString(),
            user: userId,
            reactions
          }
        }
      }
    },
    postUpdated: {
      reducer(state, action) {
        const { id, title, content, date } = action.payload;
        const existingPost = state.entities[id];
        existingPost.title = title;
        existingPost.content = content;
        existingPost.date = date;
      },
      prepare(id, title, content, date) {
        return {
          payload: {
            id, title, content, date
          }
        }
      }
    },
    reactionAdded: {
      reducer(state, action) {
        const { postId, emojiName } = action.payload;
        const existingPost = state.entities[postId];
        existingPost.reactions[emojiName]++;
      },
      prepare(postId, emojiName) {
        return {
          payload: {
            postId, emojiName
          }
        }
      }
    },
  },
  extraReducers: {
    [fetchPosts.pending]: (state, action) => {
      state.status = "loading";
    },
    [fetchPosts.fulfilled]: (state, action) => {
      state.status = "succeeded";
      // Use the 'upsertMany` reducer as a mutating update utility
      postsAdapter.upsertMany(state, action.payload);
    },
    [fetchPosts.rejected]: (state, action) => {
      state.status = "failed";
      state.error = action.error.message;
    },
    [addNewPost.fulfilled]: postsAdapter.addOne
  }
});

const { actions, reducer } = postsSlice;
export const { postAdded, postUpdated, reactionAdded } = actions;
export default reducer;
export const selectPostByUserId = (state, userId) => state.posts.posts.filter(post => post.user === userId);

// Export the customized selectors for this adapter using 'getSelectors'
export const { 
  selectAll: selectAllPosts, 
  selectById: selectPostById,
  selectIds: selectPostIds
}  = postsAdapter.getSelectors(state => state.posts);

export const selectPostsByUser = createSelector(
  [selectAllPosts, (state, userId) => userId],
  (posts, userId) => posts.filter(post => post.user === userId)
);