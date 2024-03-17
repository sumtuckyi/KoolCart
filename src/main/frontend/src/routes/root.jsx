import { Outlet } from "react-router-dom";
import NavBar from "../component/Navbar";
import MainBar from "../component/mainbar";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

// MUI에 적용할 폰트 사용 테마 생성
const theme = createTheme({
    typography: {
      fontFamily: '"SUITE-Regular", sans-serif',
    },
    components: {
      // 모든 MUI 컴포넌트에 대해 기본 스타일을 재정의
      MuiCssBaseline: {
        styleOverrides: `
          @font-face {
            font-family: 'SUITE-Regular';
            font-style: normal;
            font-display: swap;
            font-weight: 400;
          }
        `,
      },
    },
  });

export default function Root() {
    return (
        // MUI 테마 적용
        <ThemeProvider theme={theme}>
        <CssBaseline />
            <NavBar />
                <MainBar />
                <Outlet />      
        </ThemeProvider>
    )
}