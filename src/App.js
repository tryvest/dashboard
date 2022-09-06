// routes
import {StylesProvider} from '@mui/styles'
import { useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {onAuthStateChanged} from "firebase/auth";
import {BusinessRouter, GenericRouter, TryvestorRouter} from './routes';
// theme
import ThemeProvider from './theme';
import './styles.css'

// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {BUSINESS, TRYVESTOR} from "./UserTypes";
import { login, logout, selectUser } from './features/userSlice';
import {apiTryvestors} from "./utils/api/api-tryvestors";
import {auth} from "./firebase";
import {CustomRouter} from "./routes/routes";

// ----------------------------------------------------------------------

export default function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {

        apiTryvestors.getSingle(userAuth.uid).then((user) => {
          const payload = {
            userType: TRYVESTOR,
            uid: userAuth.uid,
            data: user
          };
          dispatch(login(payload));
        });
        // user is logged in, send the user's details to redux, store the current user in the state
      } else {
        dispatch(logout());
      }
    });
  }, []);

    return (
        <StylesProvider injectFirst>
            <ThemeProvider>
              <ScrollToTop />
                <BaseOptionChartStyle />
                <CustomRouter />
            </ThemeProvider>
        </StylesProvider>
    );
}
