import { toast } from "react-toastify";

const authReducer = (state = {}, action) => {
  console.log("state is")
  console.log(action.type)
  switch (action.type) {
    case "SIGN_IN_USER":
      console.log("hello im loggin in")
      toast("Welcome back..");
      return {...state, user: action.user, userType: action.userType};
    case "SIGN_IN_BUSINESS":
      toast("Welcome back..");
      return {...state, business: action.payload, userType: action.userType};
    case "SIGN_IN_ERR":
      toast.error("Sign in error...");
      return state;
    case "SIGN_OUT":
      toast("You signed out..");
      return {...state, user: null, userType: null};
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