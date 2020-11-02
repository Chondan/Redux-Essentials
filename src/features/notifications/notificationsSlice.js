import { createSlice, createAsyncThunk, createEntityAdapter } from '@reduxjs/toolkit';
import { client } from '../../api/client';

const notificationsAdapter = createEntityAdapter({
  sortComparer: (a, b) => b.date.localeCompare(a.date)
});

const initialState = notificationsAdapter.getInitialState();

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const allNotifications = selectAllNotifications(getState());
    const [latestNotification] = allNotifications;
    const latestTimeStamp = latestNotification ? latestNotification.date : "";
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimeStamp}`
    );
    return response.notifications;
  }
)

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach(notification => {
        notification.read = true
      });
    }
  },
  extraReducers: {
    [fetchNotifications.fulfilled]: (state, action) => {
      Object.values(state.entities).forEach(notification => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read;
      })
      notificationsAdapter.upsertMany(state, action.payload);
    }
  }
});

const { reducer, actions } = notificationsSlice;
export default reducer;
export const { allNotificationsRead } = actions;
export const {
  selectAll: selectAllNotifications
} = notificationsAdapter.getSelectors(state => state.notifications);