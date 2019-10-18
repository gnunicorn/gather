
import { createMuiTheme } from '@material-ui/core/styles';

export const mixins = {
  absoluteCenteringViaParent: {
    position: "relative",
    "& > *:first-child":{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)"
    }
  },
}

export const constants = {
  footerArea: 120
}

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
  overrides:{
    MuiTypography:{
      h1:{
        fontSize: 28,
        margin: "10px 0 15px"
      }
    }
  }
});

export default theme;
