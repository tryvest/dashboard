// routes
import {StylesProvider} from '@mui/styles'
import {BusinessRouter, TryvestorRouter} from './routes';
// theme
import ThemeProvider from './theme';
import './styles.css'

// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';

// ----------------------------------------------------------------------

// export const isBusiness = window.location.host.includes("business")
export const isBusiness = true
export const business = {businessID: "FB0mjHuGIWOsS3fJ4Idk"}

export default function App() {

    return (
        <StylesProvider injectFirst>
            <ThemeProvider>
              <ScrollToTop />
                <BaseOptionChartStyle />
                {
                    isBusiness ? <BusinessRouter/> : <TryvestorRouter/>
                }
            </ThemeProvider>
        </StylesProvider>
    );
}
