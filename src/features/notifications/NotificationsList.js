import { formatDistanceToNow, parseISO } from 'date-fns';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllUsers } from '../users/usersSlice';
import { selectAllNotifications, allNotificationsRead } from './notificationsSlice';
import classnames from 'classnames';

export const NotificationsList = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(selectAllNotifications);
  const users = useSelector(selectAllUsers);

  useEffect(() => {
    dispatch(allNotificationsRead());
  });
  
  const renderedNotifications = notifications.map(notification => {
    const date = parseISO(notification.date);
    const timeAgo = formatDistanceToNow(date);
    const user = users.find(user => user.id === notification.user) || {
      name: "Unknow User"
    }

    const notificationClassname = classnames("notification", {
      new: notification.isNew
    })

    return (
      <div key={notification.id} className={notificationClassname}>
        <div>
          <b>{user.name}</b> {notification.message}
        </div>
        <div title={notification.date}>
          <i>{timeAgo}</i>
        </div>
      </div>
    )
  });
  return (
    <section>
      <h2>Notifications</h2>
      {renderedNotifications}
    </section>
  );
}