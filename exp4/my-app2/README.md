Experiment–2: State Management Using Redux (Counter Application)
Aim

To implement centralized state management using Redux Toolkit in a React application.

Software Requirements

Node.js

React (Vite)

Redux Toolkit

React-Redux

VS Code

Web Browser

Theory

Redux is a predictable state container for JavaScript applications. It stores the entire application state in a single global store. The state can only be changed by dispatching actions, which are handled by reducers.

Redux Toolkit simplifies Redux development by reducing boilerplate code and providing recommended best practices.

Key Concepts

Store: Central location where the application state is stored.

Slice: A feature-based section containing state and reducer logic.

Action: An event that describes what should change.

Reducer: A function that updates state based on the action.

Provider: Makes the Redux store available to the application.

useSelector: Reads state from the store.

useDispatch: Sends actions to update state.

Project Structure
src/
 ├── main.jsx
 ├── App.jsx
 ├── app/
 │     └── store.js
 └── features/
       └── counter/
             └── counterSlice.js

![counter](https://github.com/AdarshDeep999/fullstack2/blob/a144fbe017b5af2515b7afcb3162f6021689732e/exp4/my-app2/screenshots/cntr.png)