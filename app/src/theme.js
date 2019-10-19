
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
  ellipsisOverflow:{
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    width: "100%"
  }
}

export const constants = {
  footerArea: 80,
  headerArea: 64,
  colors:{
    pink: "#ff1864",
    pinkDark: "#F40052",
    orange: "#FF5318",
    purple: "#541388",
    blue: "#30C5FF",
    green: "#388659",
    white: "#FFF",
    red: "#D90429"
  }
}


// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: constants.colors.pink,
    },
    secondary: {
      main: constants.colors.orange,
    },
    error: {
      main: constants.colors.pinkDark,
    },
    background: {
      default: constants.colors.white,
    },
  },
  overrides:{
    MuiTypography:{
      h1:{
        fontSize: 28,
        margin: "10px 0 15px"
      },
      h2:{
        fontSize: 24,
        margin: "8px 0 12px"
      },
      h3:{
        fontSize: 18,
        margin: "4px 0 8px"
      }
    }
  }
});

export default theme;
