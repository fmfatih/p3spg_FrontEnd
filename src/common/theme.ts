import { createTheme } from "@mui/material";

const palette = {
  primary: {
    dark: '#0979aa',
    main: '#0C9FDC',
    light: '#85CFED',
    lighter: '#B6E2F5',
    extraLight: '#E7F5FB',
    extraLighter: '#F3FAFD'
  },
  text: {
    default: '#41414d',
    subtle: '#85858d',
    disabled: '#c0c0c7',
    onDark: '#FFFFFF',
  },
  success: {
    main: '#00B0A6',
    light: '#80D7D2',
    lighter: '#B3E7E4',
    extraLight: '#E6F7F6',
    extraLighter: '#F2FBFB'
  },
  warning: {
    active: '#eeab00',
    main: '#ffb800',
    light: '#FFDB80',
    lighter: '#FFEAB3',
    extraLight: '#FFF8E6',
    extraLighter: '#FFFBF2'
  },
  error: {
    active: '#d3003f',
    main: '#f5004a',
    light: '#FA80A4',
    lighter: '#FCB3C9',
    extraLight: '#FEE6ED',
    extraLighter: '#FFF2F6'
  },
  info: {
    active: '#0068c8',
    main: '#007cee'
  },
  background: {
    default: '#FAF5F5',
    paper: '#FFFFFF'
  },
  contrastThreshold: 3,
  // Used by the functions below to shift a color's luminance by approximately
  // two indexes within its tonal palette.
  // E.g., shift from Red 500 to Red 300 or Red 700.
  tonalOffset: 0.2,
}

const typography = {
  h1: {
    fontFamily: 'Inter',
    fontWeight: 900,
    fontSize: '64px',
  },
  h2: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '40px',
  },
  h3: {
    fontFamily: 'Inter',
    fontWeight: 700,
    fontSize: '24px',
  },
  h4: {
    fontFamily: 'Montserrat',
    fontWeight: 600,
    fontSize: '20px',
  },
  h5: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: '14px',
  },
  h6: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: '12px',
  },
  body: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: '16px',
  },
  body2: {
    fontFamily: 'Montserrat',
    fontWeight: 500,
    fontSize: '14px',
  },
  button: {
    fontFamily: 'Montserrat',
    fontWeight: 700,
    fontSize: '14px',
  },
  overline: {
    fontFamily: 'Inter',
    fontWeight: 400,
    fontSize: '12px',
  },
  caption: {
    fontFamily: 'Montserrat',
    fontWeight: 400,
    fontSize: '10px',
  },
  
}

export const theme = createTheme({
  palette,
  typography,
});
