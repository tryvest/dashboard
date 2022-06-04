// routes
import Router from './routes';
// theme
import ThemeProvider from './theme';
// components
import ScrollToTop from './ScrollToTop';
import { BaseOptionChartStyle } from './components/chart/BaseOptionChart';
import {AuthProvider} from "./contexts/AuthContext";

// ----------------------------------------------------------------------

export default function App() {
  return (
      <AuthProvider>
        <ThemeProvider>
          <ScrollToTop />
          <BaseOptionChartStyle />
          <Router />
        </ThemeProvider>
      </AuthProvider>
  );
}
