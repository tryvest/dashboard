// routes
import {StylesProvider} from '@mui/styles'
import {useEffect} from "react";
import {useSelector} from "react-redux";
import {CustomRouter} from './routes/routes';
// theme
import ThemeProvider from './theme';
import './styles.css'

// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {store} from "./store.ts";
import {BUSINESS, TRYVESTOR} from "./UserTypes";
// ----------------------------------------------------------------------

// export const isBusiness = window.location.host.includes("business")
// export const isBusiness = true
// export const business = {businessID: "FB0mjHuGIWOsS3fJ4Idk"}

// const selectRouter = (userType) => {
//     switch (userType) {
//         case TRYVESTOR:
//             return <TryvestorRouter/>
//         case BUSINESS:
//             return <BusinessRouter/>
//         default:
//             return <GenericRouter/>
//     }
// }

// function RouterChoice() {
//     const userType = useSelector(state => state.auth?.userType)
//     return selectRouter(userType)
// }

export default function App() {
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
