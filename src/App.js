// routes
import {StylesProvider} from '@mui/styles'
import {useEffect} from "react";
import {BusinessRouter, GenericRouter, TryvestorRouter} from './routes';
// theme
import ThemeProvider from './theme';
import './styles.css'

// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {store} from "./index";
import {BUSINESS, TRYVESTOR} from "./UserTypes";
// ----------------------------------------------------------------------

// export const isBusiness = window.location.host.includes("business")
// export const isBusiness = true
// export const business = {businessID: "FB0mjHuGIWOsS3fJ4Idk"}

function RouterChoice() {
    const storeState = store?.getState()
    let userType = storeState?.auth?.userType

    useEffect(() => {
        userType = storeState?.auth?.userType
    }, [storeState])

    const selectRouter = () => {
        switch (storeState) {
            case TRYVESTOR:
                return <TryvestorRouter/>
            case BUSINESS:
                return <BusinessRouter/>
            default:
                return <GenericRouter/>
        }
    }
    return selectRouter()
}

export default function App() {
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
