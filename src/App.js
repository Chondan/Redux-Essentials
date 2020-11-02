import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom'
import { Navbar } from './app/Navbar'
import { AddPostForm } from './features/posts/AddPostForm';
import { PostsList } from './features/posts/PostsList';
import { SinglePagePost } from './features/posts/SinglePagePost';
import { EditPostForm } from './features/posts/EditPostForm';
import { UsersList } from './features/users/UsersList';
import { UserPage } from './features/users/UserPage';
import { NotificationsList } from './features/notifications/NotificationsList';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="App">
        <Switch>
          <Route
            exact
            path="/Redux-Essentials"
            render={() => (
              <>
                <AddPostForm />
                <PostsList />
              </>
            )}
          />
          <Route path="/Redux-Essentials/posts/:postId" component={SinglePagePost} />
          <Route path="/Redux-Essentials/editPost/:postId" component={EditPostForm} />
          <Route exact path="/Redux-Essentials/users" component={UsersList} />
          <Route path="/Redux-Essentials/users/:userId" component={UserPage} />
          <Route exact path="/Redux-Essentials/notifications" component={NotificationsList} />
          <Redirect to="/Redux-Essentials" />
        </Switch>
      </div>
    </Router>
  )
}

export default App
