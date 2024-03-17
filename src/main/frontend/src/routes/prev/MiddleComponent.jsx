// MiddleComponent.js

import React, { useEffect, useState } from 'react';
import NotificationCenter from './NotificationCenter';
import NeedtoLogin from './NeedtoLogin';
import Footer from './Footer';
import {Box} from '@mui/material';
import { useSelector } from 'react-redux';

const MiddleComponent = () => {
  const userId = useSelector((state) => state.user.userSeq);
  
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(()=>{
    if (userId > 0) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [userId]);

  const switchToNotificationCenter = () => {
    setIsLoggedIn(true);
  };

  return (
    <Box className='Prev-middle-component'
    sx={{
      // border : "solid 3px",
      // borderColor : "rgba(255,255,255,1)",
      width : "85%",
      height: "65%",
      display: "flex",
      flexDirection: "column",
      justifyContent : "center",
    }}>
      {/* 사용자가 로그인한 상태이면 NotificationCenter를 띄우기 */}
      {isLoggedIn ? (
      <>
      <NotificationCenter />
      {/* <Footer /> */}
      </>
      ) : <NeedtoLogin switchToNotificationCenter={switchToNotificationCenter} />}
    </Box>
  );
};

export default MiddleComponent;
