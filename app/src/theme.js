
import { createMuiTheme } from '@material-ui/core/styles';

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#ff1864',
    },
    secondary: {
      main: '#FF5318',
    },
    error: {
      main: "#F40052",
    },
    background: {
      default: '#fff',
    },
  },
});

export default theme;
