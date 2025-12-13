import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from '../App';


function Theme(){

    const customTheme = createTheme({
    palette: {
        // You can set the overall mode (light or dark)
        mode:'dark',
        background: {
        default: '#212121'
        },
    },
    components: {
        // the component name defined in the `name` parameter
        // of the `styled` API
        MuiAppBar: {
        styleOverrides: {
            // the slot name defined in the `slot` and `overridesResolver` parameters
            // of the `styled` API
            root: {
            backgroundColor: '#e79b0dff',
            }
        },
        },
        MuiTextField: {
        styleOverrides: {
            // the slot name defined in the `slot` and `overridesResolver` parameters
            // of the `styled` API
            root: {
            backgroundColor: '#212121',
            }
        },
        },
    }
    });

    return(
        
    );

}

export default Theme