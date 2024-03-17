
import React from 'react';
import Header from './Header';
import Footer from './Footer';
import MiddleComponent from './MiddleComponent';
import MainBar from '../../component/mainbar';
import {Box, Slide} from '@mui/material';


function Prev() {
  return (
    <Slide direction="right" in={true}>
    <Box className="Prev-box"
    sx={{
      backgroundColor: "rgba(255,255,255,1)",
      display: "flex",
      flexDirection:"column",
      alignItems: "center",
      height : "1280px",
      width : "1024px"
    }}
    >
      <MainBar />
      <Header />
      <MiddleComponent/>
      <Footer />
      {/* <BrightnessControlComponent/> */}
    </Box>
    </Slide>
  );
}

export default Prev;