# Redux toolkit

Go to Application: https://chondan.github.io/Redux-Essentials

`npm install @reduxjs/toolkit`

## Libraries
- @reduxjs/toolkit
- redux
- react-redux
- react-router-dom
 - useHistory -> The useHistory hook gives you access to the `history` instance that you may use to navigate.
- nanoid -> generate a random unique ID
- date-fns -> parsing and formatting dates.
```JavaScript
import { parseISO, formatDistanceToNow } from 'date-fns';
let timeAgo = '';
const timestamp = new Date().toISOString();
const date = parseISO(timestamp);
const timePeriod = formatDistanceToNow(date);
timeAgo = `${timePeriod} ago`;
```

```JavaScript
import { sub } from 'date-fns';
const date = sub(new Date(), { minutes: 10 }).toISOString();
```

- classnames -> A simple JavaScript utility for conditionally joining classNames together.

```JavaScript
import classnames from 'classnames';
classnames('foo', { bar: true, duck: false }); // 'foo bar'
classnames({ 'foo-bar': false }); // ''
// --- other falsy valuse are just ignored
classnames(null, false, 'bar', undefined, 0, 1, { baz: null }, ''); // 'bar 1'
```

## Tricks
- **Object.entries()** method returns an array of a given object's own enumerable string keyed property `[key, value]` pairs, in the same order as that provided by a `for...in` loop.
```JavaScript
const obj = { foo: "bar", baz: 42 };
console.log(Object.entries(obj)); // [['foo', 'bar'], ['baz', 42]]
```

- **String.prototype.localeCompare()** -> The `localeCompare()` method returns a number indicating whether a reference string comes before, or after, or is the same as the give string in sort order
	- **Return value** -> A negative number if `referenceStr` occurs before `compareString`; positive if the `referenceStr` occurs after `compareString`; 0 if they are equivalent
```JavaScript
'check'.localeCompare('against'); /// 2 or 1 (or some other positive value)
```

- **sort**
```JavaScript
const sortedArr = arr.sort((a, b) => a - b); // if return = negative then a come before a; if-else return = positive then a come after b; else return = 0 then a is equivalent to b
```

- **The toString() method returns a string representing the object**
```JavaScript
function Dog(name) {
	this.name = name;
}
const dog1 = new Dog("Gabby");
Dog.prototype.toString = function dogToSgring() {
	return `${this.name}`;
}
console.log(dog1.toString());
```

if you call `someObject.toString()`, This means we can pass them as ES6 object literal computed properties, and the return of `someObject.toString()` will become the keys of the object.

- array destructuring
```JavaScript
const numbers = [1, 2, 3, 4, 5];
const [x] = numbers; // access the first member of the array
console.log(x); // 1
const [a,,,,b] = numbers;
console.log(a, b) // a=1, b=5
```

---


## Redux Middleware

Redux itself is synchronous, so how the **async** operations like network request work with Redux? Here middlewares come handy. As discussed earlier, reducers are the place where all the execution logic is written. Reducer has nothing to do with who performs it, how much time it is taking or logging the state of the app before and after the action is dispatched. 

In this case, Redux milldeware function provides a medium to interact  with dispatched action before they reach the reducer. Customized middleware functions can be created by writing high order function (a function that returns another function), which wraps around some logic. Multiple middlewares can be combined together to add new functionality, and each middleware requires on knowledge of what came before and after. You can imaging middlewares somewhere between action dispatched and reducer.

Commonly, middlewares are used to deal with asynchrounous actions in your app. Redux provides with API called applyMiddleware which allows us to use custom middleware as well as Redux middlewares like redux-thunk and redux-promise. It applies middlewares to store.

The syntax of using applyMiddleware API is

`applyMiddleware(...middleware)`

```JavaScript
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
const store = createStore(reducer, applyMiddleware(thunk));
```

Middlewares will let you write an action dispatcher which returns a function instead of an action object. Example for the same is shown below

```JavaScript
function getUser() {
	return function() {
		return axios.get('/get_user_details');
	};
}
```

Conditional dispatch can be written inside middleware. Each middleware receives store's dispatch so that they can dispatch new action, and getState function as argument so that they can access the current state and return a function. 

> Any return value form an inner function will be available as the value of dispatch function itself.

The following is the syntax of middleware 

`({ getState, dispatch }) => next => action`

The getState function is useful to decide whether new data is to be fetched or cache result should get returned, depending upont the current state.

Let us see an example of a custom middleware logger function. It simple logs the action and new state.

```JavaScript
import { createStore, applyMiddleware } from 'redux';
import userLogin from './reducers';

function logger({ getState }) {
	return next => action => {
		console.log("action", action);
		const returnVal = next(action);
		console.log("state when action is dispatched", getState());
		return returnVal;
	}
}
```
---

## Redux Overview and Concepts

### What is Redux?
- What does it do?
- What problems does it help me solve?
- Why would I want to use it?

**Redux is a pattern and library for managing and updating application state, using events called "actions".** It servers as a centralized store for state that needs to be used across your entire application, with rules ensuring that the state can only be updated in a predictable fashion.

### Why Should I Use Redux?
Reudx helps you manage "global" state - state that is needed across many parts of your application.

**The patterns and tools provide by Redux make it easier to understand when, where, why, and how the state in your application is being updated, and how your application logic will behave when those changes occur.**

### When Should I Use Redux?
- You have large amounts of application state that are needed in many places in the app
- The app state is updated frequently over time
- The logic to udpate that state may be complex
- The app has a medium or large-sized codebase, and might be worked on by many people

### Terminology

#### Actions
An actions is a plain JavaScript object that has a `type` field.

The `type` field should be a string that gives this action a descriptive name, like `todos/todoAdded`. We usually write that type string lik `domain/eventName`, where  the first part is the feature or category that this action belongs to, and the second part is the specific thing that happened.

An action object can have other fields with additional information about what happened. By convention, we put that information in a field called `payload`.

#### Reducers
Reducers must always follow some specific rules
- They should only calculate the new state value based on the `state` and `action` arguments
- They are not allowed to modify the existing `state`
- They must not do any asynchronous logic, calculate random values, or cause other "side effects"

#### Selectors
Selectors are functions that know how to extract specific pieces of information from a store state value. As an application grows bigger, this can help avoid repeating logic as different parts of the app need to read the same data.

```JavaScript
const selectCounterValue = state => state.value;
const currentValue = selectCounterValue(store.getState());
```
---

## Redux App Structure

### configureStore

The Redux store is created using the `configureStore` function from Redux Toolkit. `configureStore` requires that we pass in a `reducer` argument.

Our application might be made up of many different features, and each of those features might have its own reducer function. When we call `configureStore`, we can pass in all of the different reducers in an object. The key names in the object will define the keys in our final state value.

We have a file named `features/counter/counterSlice.js` that exports a reducers function for the counter logic. We can import that `counterReducer` function here, and include it when we create the store.

When we pass in an object like {counter: counterReducer}, that says that we want to have a `state.counter` section of our Redux state object, and that we want the `counterReducer` function to be in charge of deciding if and how to update the `state.counter` section whenever an action is dispatched.

Redux allows store setup to be customized with different kinds of plugins ("middleware" and "enhancers"). `configureStore` automatically adds several middleware to the store setup by default to provide a good developer experience, and also sets up the store so that the Redux DevTools Extension can inspect its content.

```JavaScript
import { configureStore } from '@reduxjs/toolkit';

const reducers = { reducer1, reducer2 };
const rootReducer = combineReducers({ ...reducers });
const store = configureStore({ reducer: rootReducer });
```

OR

```JavaScript
const store = configureStore({ reducer: {
	counter: couterReducer,
	todos: todosReducer
}});
```

And then export default the store

```JavaScript
export default store;
```

### Creating Slice Reducers and Actions

#### Redux Slices 
**A "slice" is a collection of Redux reducer logic and actions for a single feature in your app**, typically defined together in a single file. The name comes from splitting up the root Redux state object into multiple "slices" of state.

Redux Toolkit has a function called `createSlice`, which takse care of the work of generating action type strings, action creator functions, and action objects. All you have to do is define a name for this slice, write an object that has some reducer functions in it, and it generates the corresponding action code automatically. The string from the `name` option is used as the first part of each action type, and the key name of each reducer function is used as the second part. So, the `"counter"` name + the `"increment"` reducer function generated an action type of `{type: "counter/increment"}`.

In addition to the `name` field, `createSlice` needs us to pass in the initial state value for the reducers, so that ther is a `state` the first time it gets called. In this case, we're providing an object with a `value` field that starts off at 0.

`createSlice` automatically generates action creators with the same names as the reducer functions we wrote. We can check that by calling one of them and seeing what it returns.

```JavaScript
console.log(counterSlice.actions.increment());// { type: "counter/increment" }
```

```JavaScript
const counterSlice = createSlice({
	name: "counter",
	initialState: {
		value: 0
	},
	reducers: {
		increment: state => {
			state.value += 1;
		},
		decrement: state => {
			state.value -= 1;
		},
		incrementByAmount: (state, action) => {
			state.value += action.payload;
		}
	}
});

// createSlice() method return these 4 value below
const { name, actions, reducer, caseReducers } = counterSlice;

// export
export const { increment, decrement, incrementByAmount } = actions;
export default reducer;
```

### Reducers and Immutable Updates

**Warning**
> In Redux, our reducers are never allowed to mutate the original / current state values!

So if we can't change the originals, how do we return an update state?

**Tip**
> Reducers can only make *copies* of the original values, and then they can mutate the copies.

Writing immutable update logic by hand is *hard*, and accidentally mutating state in reducers is the single most common mistake Redux users make.

**That's why Redux Tookit's `createSlice` function lets you write immutable updates an easier way!**

`createSlice` uses a library called *immer* inside. Immer uses a special JS tool called a `Proxy` to wrap the data you provide, and lets you write code that "mutates" that wrapped data, But, Immer tracks all the changes you've tried to make, and then uses that list of changes to return a safely immutable updated value, as if you'd written all the immutable update logic by hand.

**Warning**
> You can *only* write "mutating" logic in Redux Toolkit's `createSlice` and `createReducer` because they use Immer inside! If you write mutating logic in reducers without Immer, it *will* mutate the state and cause bugs!

### Writing Asynce Logic with Thunks
So far, all the logic in our application has been synchronous. Actions are dispatched, the store runs the reducers and calculates the new state, and the dispatch function finishes. But, the JavaScript language has many ways to write code that is asynchronous, and our apps normally have async logic for things like fetching data from an API. We need a place to put that async logic in our Redux apps.

A **thunk** is a specific kind of Redux function that can contain asynchronous logic. Thunks are written using two functions:
- An inside thunk function, which gets `dispatch` and `getState` as arguments
- The outside creator function, which creates and returns the thunk function

```JavaScript
// The function below is called a thunk and allows us to perform async logic.
// It can be dispatched like a regular action: `dispatch(incrementAsync(10))`
// This will call the thunk with the `dispatch` function as the first argument
// Async code can then be executed and other actions can be diapatched.
export const incrementAsync = amount => dispatch => {
	setTimeout(() => {
		dispatch(incrementByAmount(amount))
	}, 1000);
}
```

We can use them the same way we use a typical Redux action creator
```JavaScript
store.dispatch(incrementAsync(5));
```

However, using thunks requires that the `redux-thunk` *middleware* (a type of plugin for Redux) be added to the Redux store when it's created. Fortanately, Redux Toolkit's `configureStore` function already sets that up for us automatically, se we can go ahead and use thunks here.

When you need to make AJAX calls to fetch data from the server, you can put that call in a thunk. Here's an example that's written a bit longer, so you can see how it's defined

```JavaScript
// the outside "thunk creator" function
const fetchUserById = userId => {
	// the inside "thunk function"
	return async (dispatch, getState) => {
		try {
			// makw an async call in the thunk
			const user = await userAPI.fetchById(userId);
			// dispatch an action when we get the response back
			dispatch(userLoaded(user));
		} catch (err) {
			// If something went wrong, handle it here.
		}
	}
}
```

**Detailed Explanation: Thunks and Async Logic**
We know that we're not allowed to put any kind of async logic in reducers. But, that logic has to live somewhere.

If we have access to the Redux store, we could write some async code and call `store.dispatch()` when we're done:

```JavaScript
const store = configureStore({ reducer: counterReducer });
setTimeout(() => {
	store.dispatch(increment())
}, 250);
```

But, in a real Redux app, we're not allowed to import the store into other files, especially in our React components, because it makes that code harder to test and reuse.

In addition, we often need to write some async logic that we know will be used with some store, eventually, but we don't know which store.

The Redux store can be extended with "middleware", which are a kind of add-on or plugin that can add extra abilities. The most common reason to use middleware is to let you write code that can have async logic, but still talk to the store at the same time. They can also modify the store so that we can call dispatch() and pass in values that are not plain action objects, like functions or Promises.

The Redux Thunk middlware modifies the store to let you pass functions into `dispatch`.

```JavaScript
const thunkMiddleware = ({ dispatch, getState }) => next => action => {
	if (typeof action === "function") {
		return action(dispatch, getState, extraArgument);
	}
	return next(action);
}
```

It looks to see if the "action" that was passed into `dispatch` is actually a function instead of a plain object. If it's actually a function, it calls the function, and returns the result. Otherwise, since this must be an action object, it passes the action forward to the store.

This give us a way to write whatever sync or async code we want, while still having access to `dispatch` and `getState`

### The React Counter Component
```JavaScript
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { decrement, increment, incrementByAmount, incrementAsyncByAmount, selectCount } from './counterSlice';
import styles from './counter.module.css';
export function Counter() {
	const conunt = useSelector(selectCount);
	const dispatch = useDispatch();
	const [incrementAmount, setIncrementAmount] = useState('2');
	return (
		<div>
			...
		</div>
	);
}
```

Like with the earlier plain React example, we have a function component called `Counter`, that stores some data in a `useState` hook

However, in our component, it doesn't look like we're storing the actual current counter value as state. There is a *variable* called `count`, but it's not coming from a `useState` hook

While React includes several built-in hoooks like `useState` and `useEffect`, other libraries can create their own custom hooks that use React's hooks to build custom logic.

The React-Redux library has a set of custom hooks that allow your React component to interact with a Redux store.

### Reading Data with `useSelector`

First, the `useSelector` hook lets our component extract whatever pieces of data it needs from the Redux store state.

Earlier, we saw that we can write "selector" functions, which take `state` as an argument and return some part of the state value.

Our `counterSlice.js` has this selector function at the bottom.

```JavaScript
// The function below is called a selector and allow us to select a value from 
// the state. Selectors can also be defined inline where they're used instead of 
// in the slice file. For example `useSelector((state) => state.counter.value)`
export const selectCount = state => state.counter.value;
```

if we had access to a Redux store, we could retrieve the current counter value as:

```JavaScript
const count = selectCount(store.getState());
console.log(count);
```

Our components can't talk to the Redux store directly, because we're not allowed to import it into component files. But `useSelector` takes care of talking to the Redux store behind the scences for us. If we pass in a selector function, it calls `someSelector(store.getState())` for us, and returns the result.

So, we can get the current store counter value by doing:
```JavaScript
const count = useSelector(selectCount);
```

We don't have to *only* use selectors that have already been exported, either. For example, we could write a selector function as an inline argument to `useSelector`:

```JavaScript
const countPlusTwo = useSelector(state => state.counter.value + 2);
```

Any time an action has been dispatched and the Redux store has been updated, `useSelector` will re-ren our selector
function. If the selector returns a different value than last time, `useSelector` will make sure our component re-renders with the new value.

### Dispatching Actions with `useDispatch`

Similarly, we know that if we had access to a Redux store, we could dispatch actions using action creators, like
`store.dispatch(increment())`. Since we don't have access to the store itself, we need some way to have access to just the `dispatch` method.

The `useDispatch` hook does that for us, and gives us the actual `dispatch` method from the Redux store.

```JavaScript
const dispatch = useDispatch();
```

From there, we can dispatch actions when the user does something like clicking on a button:

```JavaScript
<button
	className={styles.button}
	aria-label="Increment value"
	onClick={() => dispatch(increment())}
>+</button>
```

### Component State and Forms

By now you might be wondering, "Do I always have to put all my app's state into the Redux store?"

The answer is **NO. Global state that is needed across the app should go in the Redux store. State that's only needed in one placre should be kept in component state.**

In this example, we have an input textbox where the user can type in the next number to be added to the counter

We could keep the current number string in the Redux store, by dispatching an action in the input's `onChange` handler and keeping it in our reducer. But, that doesn't give us any benefit. The only place that text string is used is here, in the `<Counter>` component. (Sure, ther's only one other component in this example: `<App>`. But even if we had a larger application with many components, only `<Counter>` cares about this input value)

So, it makes sense to keep that value in a `useState` hook here in the `<Counter>` component.

Similarly, if we had a boolean flag called `isDropdownOpen`, no other components in the app would care about that - it should really stay local to this component.

**In a React + Redux app, your global state should go in the Redux store, and your local state should stay in React components.**

If you're not sure where to put something, here are some common rules of thumb for detemining what kind of data should be put into Redux:
- Do other parts of the application care about this data?
- Do you need to be able to create further derived data based on this original data?
- Is the same data being used to drive multiple components?
- Is there value to you in being able to restore this state to given point in time (ie, time travel debugging)?
- Do you want to cache the date (ie, use what's in state if it's already there instead of re-requesting it)?
- Do you want to keep this data consistent while hot-reloading UI components (which may lose their internal state when swapped)?

This is also a good example of how to think about forms in Redux in general. **Most form state probably shouldn't be kept in Redux.** Instead, keep the data in your form components as you're editing it, and then dispatch Redux actions to update the store when the user is done.

One other thing to note before we move on: remember that `incrementAsync` thunk from `counterSlice.js`? We're using it here in this component. Notice that we use it the same way we dispatch the other normal action creators. This component doesn't care whether we're dispatching a normal action or starting some async logic. It only know that when you click that button, it dispatches something.

### Providing the Store
We've seen that our components can use the `useSelector` and `useDispatch` hooks to talk to the Redux store. But, since we didn't import the store, how do those hooks know what Redux store to talk to?

Now that we've seen all the different pieces of this application, it's time to circle back to the starting point of this application and se how the last pieces of the puzzel fit together.

```JavaScript
import { Provider } from 'react-redux';
ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById("root"));
```

We always have to call `ReactDOM.render(<App />)` to tell React to start rendering our root `<App>` component. In order for our hooks like `useSelector` to work right, we need to use a component called `<Provider>` to pass down the Redux store behind the scences so they can access it.

Now, any React components that all `useSelector` or `useDispatch` will be talking to the Redux store we gave to the `<Provider>`

---

## Basic Redux Data Flow

### Preparing Action Payloads
We just saw that action creators from `createSlice` normally expect one argument, which becomes `action.paayload`. This simplifies the most common usage pattern, but sometimes we need to do more work to prepare the contents of an action object. In the case of our `postAdded` action, we need to generate a unique ID for the new post, and we also need to make sure that the payload is an object that looks like `{id, title, content}`.

Right now, we're generating the ID and creating the payload object in our React component, and passing the payload object into `postAdded`. But, what if we needed to dispatch the same action from different components, or the logic for preparing the payload is complicated? We'd have to duplicate that logic every time we wanted to dispatch the action, and we're forcing the component to know exactly what the payload for this action should look like.

**CAUTION**
> If an action needs to contain a unique ID or some other random value, always generate that first and put it in the action object. **Reducers should never calculate random values,** because that makes the result unpredictable.

if we were writing the `postAdded` action creator by hand, we could have put the setup logic inside of it ourselves.

```JavaScript
function postAdded(title, content) {
	const id = nanoid();
	return {
		type: "posts/postAdded",
		payload: { id, title, content }
	}
}
```

But, Redux Toolkit's `createSlice` is generating these action creators for us. That makes the code shorter because we don't have to write them ourselves, but we still need a way to customize the contents of `action.payload`

Fortunately, `createSlice` lets us define a "prepare callback" function when we write a reducer. The "prepare callback" function can take multiple arguments, generate random values like unique IDs, and run whatever other synchronous logic is needed to decide what values go into the action object. It should then return an object with the `payload` field inside. (The return object may also contain a `meta` field, which can be used to add extra descriptive values to the action, and an `error` field, which should be a boolean indicating whether this action represents some kind of an error.)

Inside of the `reducers` field in `createSlice`, we can define one of the fields as an object that looks like `{reducer, prepare}`

```JavaScript
const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {
		postAdded: {
			reducer(state, action) {
				state.push(action.payload);
			},
			prepare(title, content) {
				return {
					payload: {
						id: nanoid(),
						title,
						content
					}
				}
			}
		},
		// other reducers here
	}
});
```

Now our component doesn't have to worry about what the payload object looks like - the action creator will take care of putting it together the right way. So, we can update the component so that it passes in `title` and `content` as arguments when it dispatches `postAdded`

```JavaScript
const onSavePostClicked = () => {
	if (title && content) {
		dispatch(postAdded(title, content));
		setTitle('');
		setContent('');
	}
}
```

---

## Async Logic and Data Fetcing
So far, all the data we've worked with has been directly inside of our React client application. However, most real applications need to work with data from a server, by making HTTP API calls to fetch and save items.

In this section, we'll convert our social media app to fetch the posts and users data from an API, and add new posts by saving them to the API.

### Example REST API and Client
To keep the example project isalated but realistic, the initial project setup already included a fake in-memory REST API for our data (configured using [the Mirage.js mock API tool](https://miragejs.com/)). The API uses `/fakeApi` as the base URL for the endpoints, and supports the typical `GET/POST/PUT/DELETE` HTTP methods for `/fakeApi/posts`, `/fakeApi/users`, and `fakeApi/notifications`. It's defined in `src/api/server.js`.

### Thunks and Async Logic
#### Using Middleware to Enable Async Logic
By itself, a Redux store doesn't know anything about async logic. It only knows how to synchronously dispatch actions, update the state by calling the root reducer function, and notify the UI that something has changed. Any asynchronicity has to happen outside the store.

But, what if you want to have async logic interact with the store by dispatching or checking the current store state? That's where **Redux middleware** come in. They extend the store, and allow you to:
- Execute extra logic when any action is dispatched (such as logging the action and state)
- Pause, modify, delay, replace, or halt dispatched actions
- Write extra code that has access to `dispatch` and `getState`
- Teach `dispatch` how to accept other values beside plain action object, such as functions and promises, by intercepting them and dispatching real action objects instead.

**The most common reason to use middleware is to allow different kinds of async logic to interact with the store.** This allows you to write code that can dispatch actions and check the store state, while keeping that logic separate from your UI.

There are many kinds of async middleware for Redux, and each lets you write your logic using differect syntax. The most common async middleware is `redux-thunk`, which lets you write plain functions that may contain async logic directly. Redux Toolkit's `configureStore` function automatically sets up the thunk middleware by default, and we recommend using thunks as the standard approach for writing async logic with Redux.

### Thunk Functions
Once the thunk middleware has been added to the Redux store, it allows you to *pass thunk functinos* directly to `store.dispatch`. A thunk function will always be called with `(dispatch, getState)` as its arguments, and you can use them inside the thunk as needed.

Thunks typically dispatch plain actions using actino creators, like `dispatch(increment())`

```JavaScript
const store = configureStore({ reducer: counterReducer });
const exampleThunkFunction = ({ dispatch, getState }) => {
	const stateBefore = getState();
	console.log(`Counter before: ${stateBefore.counter}`);
	dispatch(increment());
	const stateAfter = getState();
	console.log(`Counter After: ${stateAfter.counter}`);
}
store.dispatch(exampleThunkFunction);
```

For consistency with dispatching normal action objects, we typically write these as *thunk action creators*, which return the thunk function. These action creators can take arguments that can be used inside the thunk.

```JavaScript
const logAndAdd = amount => {
	return (dispatch, getState) => {
		const stateBefore = getState();
		console.log(`Counter before: ${stateBefore.counter}`);
		dispatch(incrementByAmount(amount));
		const stateAfter = getState();
		console.log(`Counter After: ${stateAfter.counter}`);
	}
}
store.dispatch(logAndAdd(5))
```

Thunks are typically written in "slice" files. `createSlice` itself does not have any special support for defining thunks, so you should write them as separate functinos in the same slice file. That way, they have access to the plain actino creators for that slice, and it's easy to find where the thunk lives.

### Writing Async Thunks
Thunks may have async logic inside of them, such as `setTimeout`, `Promise`s, and `async/await`. This makes them a good plac to put AJAX calls to a server API.

Data fetching logic for Redux typically follows a predictable pattern: 
- A "start" action is dispatched before the request, to indicate that the request is in progress. This may be used to track loading state to allow skipping duplicate requests or show loading indicators in the UI.
- The async request is made
- Depending on the request result, the async logic dispatches either a "success" action containing the result data, or a "failure" action containing error details. The reducer logic clears the loading state in both cases, and either processes the result data from the success case, or store the error value for potential display.

These steps are not required, but are commonly used. (If all you care about is a successful result, you can just dispatch a single "success" action when the request finishes, and skip the "start" and "failure" actions)

Redux Toolkit provides a `createAsyncThunk` API to implement the creation and dispatching of these actions, and we'll look at how to use it shortyly.

**Detailed Explanation: Dispatching Request Status Actinos in Thunks**

If we were to write out the code for a typical async thunk by hand, it might look like this:

```JavaScript
const getRepoDetailsStarted = () => ({
	type: "repoDetails/fetchStarted"
});
const getRepoDetailsSuccess = repoDetails => ({
	type: "repoDetails/fetchSucceeded",
	payload: repoDetails
});
const getRepoDetailsFailed = error => ({
	type: "repoDetails/fetchFailed",
	error
});
const fetchIssueCount = (org, repo) => async dispatch => {
	dispatch(getRepoDetailsStarted());
	try {
		const repoDetails = await getRepoDetais(org, repo);
		dispatch(getRepoDetailsSuccess(repoDetails));
	} catch (err) {
		dispatch(getRepoDetailsFailed(err.toString()));
	}
}
```

However, writing code using this approach is tedious. Each separate type of request needs repeated similar implementation:
- Uniqe action types need to be defined for the three different cases
- Each of those action types usually has a corresponding action creator function
- A thunk has to be written that dispatches the correct actions in the right sequence

`createAsyncThunk` abstracts this pattern by generating the action types and action creators, and generating a thunk that dispatches those actions automatically. You provide a callback function that makes the async call and returns a Promise with the result.

### Loading Posts
So far, our `postsSlice` has used some hardcoded sample data as its initial state. We're going to switch that to start with an empty array of  posts instead, and then fetch a list of posts from the server.

In order to do that, we're going to have to change the structure of the state in our `postsSlice`, so that we can keep track of the current state of the API request.

### Extracting Posts Selectors
Right now, the `postsSlice` state is a single array of `posts`. We need to change that to be an object that has the `posts` array, plus the loading state fields.

Meanwhile, the UI components like `<PostsList>` are trying to read posts from `state.posts` in their `useSelector` hooks, assuming that that field is an array. We need to change those locations also to match the new data.

It would be nice if we didn't have to keep rewriting our components every time we made a change to the data format in our reducers. One way to avoid this is to define reusable selector functions in the slice files, and have the components use those selectors to extract the data they need instead of repeating the selector logic in each component. That way, if we do change our state structure again, we only need to update the code in the slice file.

The `<PostsList>` component needs to read a list of all the posts, and the `<SinglePostPage>` and `<EditPostForm>` components need to look up a single post by its ID. Let's export two small selector functions from `postsSlice.js` to cover those cases.

It's often a good idea to encapsulate data lookups by writing reusable selectors. you can also create  "memoized" selectors that can help improve performance, which we'll look at in a later part of this tutorial.

But, like any abstractin, it's not something you should do all the time, everywhere. Writing selectors means more code to understand and maintain. **Don't feel like you need to write selectors for every single field of you state.** Try starting without any selectors, and add some later when you find yourself looking up the same values in many parts of your application code.

### Loading State for Requests
When we make an API call, we can view its progress as a small state machine that can be in one of four possible states:
- The request hasn't started yet
- The request is in progress
- The request succeeded, and we not have the data we need
- The request failed, and there's probably an error message

We could track that information using some booleans, like `isLoading: true`, but it's better to track these states as a single enum value. A good patter for this is to hava s state section that looks like: 

```JavaScript
{
	status: "idle" | "loading" | "succeeded" | "failed",
	error: string | null
}
```

These fields would exist alongside whatever actual data being stored. These specific string state names aren't required - feel free to use other names if you want, like `'pending'` instead of `'loading'`, or `'complete'` instead of `'succeeded'`.

We can use this information to decide what to show in our UI as the request progresses, and also add logic in our reducers to prevent cases like loading data twice.

Let's update our `postsSlice` to use this pattern to track loading state for a "fetch posts" request. We'll switch our state from being an array of posts by itself, to look likt `{posts, status, error}`. We'll also remove the old sample post entries from our initial state. As part of this change, we also need to change any uses of `state` as an array to be `state.posts` instead, because the array is now one level deeper.

### Fetching Data with `createAsyncThunk`
Redux Toolkit's `createAsyncThunk` API generates thunks that automatically dispatch those "start/success/failure" actions for you.

Let's start by adding a thunk that will make an AJAX call to retrieve a list of posts. We'll import the `client` utility from the `src/api` folder, and use that to make a request to `/fakeApi/posts`.

```JavaScript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { client } from '../../api/client';

export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const response = client.get("/fakeApi/posts");
	return response.posts;
});
```

`createAsyncThunk` accepts two arguments: 
- A string that will be used as the prefix for the generated action types
- A "payload creator" callback function that should return a `Promise` containing some data, or a rejected `Promise` with an error.

The payload creator will usually make an AJAX call of some kind, and can either return the `Promise` from the AJAX call directly, or extract some data from the API response and return that. We typically write this using the JS `async/await` syntax, which lets us write functions that use `Promise`s while using standard `try/catch` logic instead of `somePromise.then()` chains.

In this case, we pass in `posts/fetchPosts` as the action type prefix. Our payload creation callback waits for the API call to return a response. The response object looks like `{posts: []}`, and we want our dispatched Redux action to have a payload that is just the array of posts. So, we extract `response.posts`, and return that from the callback.

If we try calling `dispatch(fetchPosts())`, the `fetchPosts` thunk will first dispatch an action type of `posts/fetchPosts/pending`

We can listen for this action in our reducer and mark the request status as `loading`.

Once the `Promise` resolves, the `fetchPosts` thunk takes the `response.posts` array we returned from the callback, and dispatches a `posts/fetchPosts/fullfilled` action containing the posts array as `action.payload`

### Reducers and Loading Actions
Next up, we need to handle both these actions in our reducers. This requires a bit deeper look at the `createSlice` API we've been using.

We've already seen that `creatsSlice` will generate an action creator for every reducer function we difine in the `reducer` field, and that the generated action types include the name of the slice, like:

```JavaScript
console.log(postUpdated({ id: '123', title: "First Post", content: "Some text here" }));
// { type: 'posts/postUpdated', payload: { id: '123', title: 'First Post', content: 'Some text here' } }
```

However, there are times when a slice reducer needs to respond to other actions that weren't defined as part of this slice's `reducers` field. We can do that using the slice `extraReducers` field instead.

**Detailed Explanation: Adding Extra Reducers to Slices**
The keys in the `extraReducers` object should be Redux action type strings, like `counter/increment`. We could write those by hand ourselves, although we'd have to quote the keys if they contain any characters like '/':

```JavaScript
const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: {
		"counter/increment": (state, action) => {
			// normal reducer logic to update the posts slice
		}
	}
})
```

However, action creators generated by Redux Toolkit automatically return their action type string if you call `actionCreator.toString()`.
This means we can pass them as ES6 object literal computed properties, and the action types will become the keys of the object:

```JavaScript
import { increment } from '../features/coutner/counterSlice';
const object = {
	[increment]: () => {}
};
console.log(object);
// { "counter/increment": Function }
```

This works for the `extraReducers` field:

```JavaScript
import { increment } from '../features/counter/counterSlice';
const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {},
	extraReducers: {
		[increment]: (state, action) => {
			// normal reducer logic to update the posts slice
		}
	}
})
```

We can also add extra reducers by using the "building callback" syntax for `extraReducers`. If we pass a function for the `extraReducers` instead of an object, we can use the `builder` parameter to add individual cases. The `builder.addCase()` function takes either a plain string action type to listen for, or a Redux Toolkit action creator:

In this case, we need to listen for the "pending" and "fulfilled" action types dispatched by our `fetchPosts` thunk. Those action creators are attached to our actual `fetchPosts` function, and we can pass those to `extraReducers` to listen for those actions:

```JavaScript
const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
	const response = await client.get("/fakeApi/posts");
	return reponse.posts; // payload
});

const postsSlice = createSlice({
	name: "posts",
	initialState,
	reducers: {}, 
	extraReducers: {
		[fetchPosts.pending]: (state, action) => {
			state.status = "loading";
		},
		[fetchPosts.fulfilled]: (state, action) => {
			state.status = "succeeded";
			state.posts = states.posts.concat(action.payload);
		},
		[fetchPosts.rejected]: (state, action) => {
			state.status = "failed";
			state.error = action.error.message;
		}
	}
})
``` 

We'll hangle all three action types that could be dispatched by the thunk based on the `Promise` we returned:
- When the request starts, we'll set the `status` enum to `'loading'`
- If the request succeeds, we mark the `status` as `succeeded`, and add the fetched post to `state.posts`
- If the request fails, we'll mark the `status` as `failed`, and save any error message into the state so we can display it

---

## Performance and Normalizing Data

### Thunk Argument
If you look at our `fetchNorifications` thunk. it has something new that we haven't seen before. Let's talk about thunk arguments for a minute.

We've already seen that we can pass an argument into a thunk action creator when we dispatch it, like `dispatch(addPost(newPost))`. For `createAsyncThunk` specifically, you can only pass in one argument, and whatever we pass in becomes the first argument of the payload creation callback.

The second argument to our payload creator is a `thunkAPI` object containing several useful functions and pieces of information:
- `dispatch` and `getState`: the actual `dispatch` and `getState` methods from our Redux store. You can use these inside the thunk to dispatch more actions, or get the latest Redux store state (such as reading an updated value after another action is dispatched).
- `extra`: the "extra argument" that can be passed into the thunk middleware when creating the store. This is typically some kind of API wrapper, such as a set of functions that know how to make API calls to you application's server and return data, so that your thunks don't have to have all the URLs and query logic directly inside.
- `requestId`: a uniqe random ID value for this thunk call. Useful for tracking status of an individual request.
- `signal`: An `AbortController.signal` function that can be used to cancel an in-progress request.
- `rejectWithValue`: a utility that helps customize the contents of a `rejected` action if the thunk receives an error.

(If you're writing a thunk by hand instead of using `createAsyncThunk`, the thunk functino will get `(dispatch, getState)` as separate arguments, instead of putting them together in one object.)

In this case, we know that the list of notifications is in our Redux store state, and that the latest notification should be first in the array. We can destructure the `getState` function out of the `thunkAPI` object, call it to read the state value, and use the `selectAllNotifications` selector to give us just the array of notifications. Since the array of notifications is sorted newest first, we can grab the latest one using array destructuring.

### Improving Render Performance
#### Investigating Render Behavior
We can use the React DevTools Profiler to view some graphs of what components re-render when state is updated. We know that `useSelector` will re-run every time an action is dispatched, and that it forces the component to re-render if we return a new reference value.

We're calling `filter()` inside of our `useSelector` hook, so that we only return the list of posts that belong to this user. Unfortunately, **this means that `useSelector` always returns a new array reference, and so our component will re-render after every action even if the posts data hasn't changed!.**

### Memoizing Selector Functions
What we really need is a way to only calculate the new filtered array if either `state.posts` or `userId` have changed. If they haven'y changed, we want to return the same filtered array reference as the last time.

This idea is called "memoization". We want to save a previous set of inputs and the calculated result, and if the inputs are the same, return the previous result instead of recalculating it again.

So far, we've been writing selector functions by ourselves, and just so that we don't have to copy and paste the code for reading data from the store. It would be great if there was a way to make our selector functions memoized.

**Reselect is a library for creating memoized selector functions**, and was specifically designed to be used with Redux. It has a `createSelector` function that generates memoized selectors that will only recalculate results when the inputs change. Redux Toolkit exports the `createSelector` function. so we already have it available.

Let's make a new `selectPostsByUser` selector function, using Reselect and use it here.

```JavaScript
import { createSelector } from '@reduxjs/toolkit';
export const selectPostsByUser = createSelector(
	[selectAllPosts, (state, userId) => userId],
	(posts, userId) => posts.filter(post => post.user === userId)
);
```

`createSelector` takes one or more "input selector" functions as argument, plus an "output selector" function. When we call `selectPostsByUser(state, userId), createSelector` will pass all of the arguments into each of our input selectors. Whatever those input selectors return becomes the arguments for the output selector.

In this case, we know that we need the array of all posts and the user ID as the two arguments for our output selector. We can reuse our existing `selectAllPosts` selector to extract the posts array. Since the user ID is the second argument we're passing into `selectPostsByUser`, we can write a small selector that just returns `userId`.

Our output selector then takes `posts` and `userId`, and returns the filtered array of posts for just that user.

If we try calling `selectPostsByUser` multiple times, it will only re-run the output selector if either `posts` or `userId` has changed.

```JavaScript
const state1 = getState();
// Output selector runs, because it's the first call 
selectPostsByUser(state1, "user1");
// Output selector does not run, because the arguments haven't changed
selectPostsByUser(state1, "user1");
// Output selector runs, because `userId` changed
selectPostsByUser(state1, "user2");

dispatch(reactionAdded())
const state2 = getState()
// Output selector does not run, because `posts` and `userId` are the same
selectPostsByUser(state2, "user2");

// Add some more posts
dispatch(addNewPost());
const state3 = getState();
// Output selector runs, because `posts` has changed
selectPostsByUser(state3, "user3");
```

If we call this selector in `<UserPage>` and re-run the React profiler while fetching notifications, we should see that `<UserPage>` doesn't re-render this time:

Memoized selectors are a valuable tool for improving performance in a React + Redux application, because they can help us avoid unnecessary re-renders, and also avoid doing potentially complex or expensive calculations if the input data hasn't changed.

### Investigating the Post List
If we go back to our `<PostsList>` and try clicking a reaction button on one of the post while capturing a React profiler trace, we'll see that not only did the `<PostsList>` and the updated `<PostExcerpt>` instance render, all of the `<PostExcerpt>` components rendered:

Why is that? None of the other posts changed, so why would they need to re-render?

**React's default behavior is that when a parent component renders, React will recursively render all child components inside of it!.** The immutable update of one post object also created a new `posts` array. Our `<PostsList>` had to re-render because the `posts` array was a new reference, so after it rendered, React continued downwards and re=rendered all of the `<PostExcerpt>` components too.

This isn't a serious problem for our small example app, but in a larger real-world app, we might have some very long lists or very large component trees, and having all those extra components re-render might slow things down.

There's a few different ways we could optimize this behavior in `<PostsList>`.

First, we could wrap the `<PostExcerpt>` component in `React.memo()`, which will ensure that the component inside of it only re-renders if the props have actually changed. This will actually work quite well - try it out and see what  happens:

```JavaScript
let PostExcerpt = ({ post }) => {
	// omit logic
}
PostExcerpt = React.memo(PostExcerpt);
```

Another option is to rewrite `<PostsList>` so that it only selects a list of post IDs from the store instead of the entire `posts` array, and rewrite `<PostExcerpt>` so that it receives a `postId` prop and calls `useSelector` to read the post object it needs. If `<PostsList>` gets the same list of IDs as before, it won't need to re-render, and so only our one change `<PostExcerpt>` component should have to render.

Unfortunately, this gets tricky because we also need to have all our posts sorted by date and rendered in the right order. We could update our `postsSlice` to keep the array sorted at all times, so we don't have to sort it in the component, and use a memoized selector to extract just the list of post IDs. We could aslo customize the comparison function that `useSelector` runs to check the results, like `useSelector(selectPostId, shallowEqual)`, so that will skip re-rendering if the contents of the IDs array haven't changed.

The last option is to find some way to have our reducer keep a separate array of IDs for all the posts, and only modify that array when posts are added or removed, and do the same rewrite of `<PostsList>` and `<PostExcerpt>`. This way, `<PostsList>` only  needs to re-render when that IDs array changes.

Conveniently, Redux Toolkit has a `createEntityAdapter` function that will help us do just that

### Normalizing Data
You've seen that a lot of our logic has been looking up items by their ID field. Since we've been storing our data in arrays, that means we have to loop over all the items in the array using `array.find()` until we find the item with the ID we're looking for.

Realistically, this doesn't take vary long, but if we had arrays with hundreds or thousands of items inside, looking through the entire array to find one item becomes wasted effort. 

**What we need is a way to look up a single item based on its ID, directly, without having to check all the other items. This process is knows as "normalization"**

### Normalized State Structure
"Normalized state" means that: 
- We only have one copy of each particular piece of data in our state, so there's no duplication.
- Data that has been normalized is kept in a lookup table, where the item IDs are the keys, and the items themselves are the values.
- There may also be an array of all of the IDs for a particular item type

JavaScript objects can be used as lookup tables, similar to "maps" or "dictionaries" in other languages. Here's what the normalized state for a group of `user` objects might look like:

```JavaScript
{
	users: {
		ids: ["user1", "user2", "user3"],
		entities: {
			"user1": {id: "user1", firstName, lastName},
			"user2": {id: "user2", firstName, lastName},
			"user3": {id: "user3", firstName, lastName},
		}
	}
}
```

This makes it easy to find a particular `user` object by its ID, without having to loop through all the other user objects in an array:

```JavaScript
const userId = "user2";
const userObject = state.users.entities[userId];
```

### Managing Normalized State with `createEntityAdapter`
Redux Toolkit's `createEntityAdapter` API provides a standardized way to store your data in a slice by taking a collection of items and putting them into the shape of `{ids: [], entities: {}}`. Along with this predefined state shape, it generates a set of reducer functions and selectors that know how to work with that data.

This has several benefits:
- We don't have to write the code to manage the normalization ourselves
- `createEntityAdapter`'s pre-built reducer functions handle common cases like "add all these items", "update one item", or "remove multiple items"
- `createEntityAdapter` can keep the ID array in a sorted order based on the contents of the items, and will only update that array if items are added / removed of the sorting order changes.

`createEntityAdapter` accepts an options object that may include a `sortComparer` function, which will be used to keep the item IDs array in sorted order by comparing two items (and works the same way as `Array.sort())`

It returns an object that contains a set of generated reducer functions for adding, updating, and removing items from an entity state object. These reducer functinos can either be used as a case reducer for a specific action type, or as a "mutatinng" utility function within another reducer in `createSlice`.

The adapter object also has a `getSelectors` function. You can pass in a selector that returns this particular slice of state from the Redux root state, and it will generate selectors like `selectAll` and `selectById`.

Finally, the adapter object has a `getInitialState` function that generates an empty `{ids: [], entities: {}}` object. You can pass in more fields to `getInitialState`, and those will be merged in.

---