import { toast } from "react-toastify";

const authReducer = (state = {}, action) => {
  switch (action.type) {
    case "SIGN_IN_USER":
      toast("Welcome back..");
      return {...state, user: action.payload};
    case "SIGN_IN_BUSINESS":
      toast("Welcome back..");
      return {...state, business: action.payload};
    case "SIGN_IN_ERR":
      toast.error("Sign in error...");
      return state;
    case "SIGN_OUT":
      toast("You signed out..");
      return {...state, user: null};
    case "SIGN_UP":
      toast("Welcome..");
      return {...state, user: action.payload};
    case "SIGN_UP_ERR":
      toast.error("Sign up error...");
      return state;
    case "SET_USER_TYPE":
      return {...state, userType: action.userType}
    default:
      return state;
  }
};


export default authReducer;