import { createContext, useContext, useEffect, useReducer } from "react";

const AuthContext = createContext()

const initialState = {
  user: null,
  isAuthenticated: false
}

function reducer(state, action){
  switch(action.type){
    case 'login':
      return {...state, user: action.payload, isAuthenticated: true}
    
    case 'logout':
      return {...state, user: null, isAuthenticated: false} //we could've returned initialState here.
    
    default:
      throw new Error('Unknown action')
  }
}

const FAKE_USER = {
  name: "Tala",
  email: "tala@example.com",
  password: "qwerty",
  avatar: 'https://cdn2.iconfinder.com/data/icons/avatar-profession-circle/100/avatar_profession_traveler_traveling-512.png'
};

function AuthProvider({ children }){
  const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState)

  useEffect(function () {
    const storedAuthState = localStorage.getItem("user");
    if (storedAuthState) {
      const parsedAuthState = JSON.parse(storedAuthState);
      dispatch({ type: "login", payload: parsedAuthState.user });
    }
  }, []);

  function login(email, password){
    if(email === FAKE_USER.email && password === FAKE_USER.password) 
    dispatch({ type: 'login', payload: FAKE_USER})
  }

  function logout(){
    dispatch({ type:'logout' })
  }

  return <AuthContext.Provider 
    value = {{
    user, 
    isAuthenticated, 
    login,
    logout,
    }
  }>{children}</AuthContext.Provider>
}

function useAuth(){
  const context = useContext(AuthContext)
  if (context === undefined) throw new Error('AuthContext was used outside AuthProvider')
  return context;
}

export {AuthProvider, useAuth}  