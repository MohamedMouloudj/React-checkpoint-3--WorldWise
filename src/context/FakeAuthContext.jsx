import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();
const initialState = {
  user: null,
  isAuthenticated: false,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "login":
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return state;
  }
};

const FAKE_USER = {
  name: "Chebrag",
  email: "user@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=ab",
};

function AuthProvider({ children }) {
  const [{ isAuthenticated, user }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    } else {
      alert("Incorrect email or password. Try again");
    }
  }
  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export { AuthProvider, useAuth };
