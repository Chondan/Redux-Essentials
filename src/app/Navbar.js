import React from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchNotifications, selectAllNotifications } from '../features/notifications/notificationsSlice';

export const Navbar = () => {
  const dispatch = useDispatch();

  const notifications = useSelector(selectAllNotifications);
  const numUnreadNotifications = notifications.filter(notification => !notification.read).length;

  let unreadNoificationsBadge;
  if (numUnreadNotifications > 0) {
    unreadNoificationsBadge = (
      <span className="badge">{numUnreadNotifications}</span>
    );
  }
  
  const fetchNewNotifications = () => {
    dispatch(fetchNotifications());
  }
  return (
    <nav>
      <section>
        <h1>Redux Essentials Example</h1>

        <div className="navContent">
          <div className="navLinks">
            <Link to="/Redux-Essentials">Posts</Link>
            <Link to="/Redux-Essentials/users">Users</Link>
            <Link to="/Redux-Essentials/notifications">
              Notifications {unreadNoificationsBadge}
            </Link>
          </div>
          <button className="button notification-btn" onClick={fetchNewNotifications}>
            Refresh Notifications
          </button>
        </div>
      </section>
    </nav>
  )
}
