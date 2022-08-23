// routes
import {StylesProvider} from '@mui/styles'
import {useEffect} from "react";
import { useDispatch, useSelector} from "react-redux";
import {onAuthStateChanged} from "firebase/auth";
import {BusinessRouter, GenericRouter, TryvestorRouter} from './routes';
// theme
import ThemeProvider from './theme';
import './styles.css'

// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {store} from "./store.ts";
import {BUSINESS, TRYVESTOR} from "./UserTypes";
import { login, logout, selectUser } from './features/userSlice';
import { auth } from './firebase';
import {apiTryvestors} from "./utils/api/api-tryvestors";

// ----------------------------------------------------------------------

// export const isBusiness = window.location.host.includes("business")
// export const isBusiness = true
// export const business = {businessID: "FB0mjHuGIWOsS3fJ4Idk"}

const selectRouter = (userType) => {
    switch (userType) {
        case TRYVESTOR:
            return <TryvestorRouter/>
        case BUSINESS:
            return <BusinessRouter/>
        default:
            return <GenericRouter/>
    }
}

function RouterChoice() {
    const userType = useSelector(state => state.user?.user?.userType)
    return selectRouter(userType)
}


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
                <RouterChoice />
            </ThemeProvider>
        </StylesProvider>
    );
}
