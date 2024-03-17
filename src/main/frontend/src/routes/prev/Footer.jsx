// Footer.js
import React, { useEffect, useState } from 'react';
import {Box, Slide} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import PrevService from './Service/PrevService';
import { useSelector } from 'react-redux';

const Footer = () => {

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

  const navigate = useNavigate();

  const goToMain = () => {
    navigate('/home');
    window.scrollTo(0, 0);
  };

  const goToLogin = () => {
    navigate('login');
    window.scrollTo(0,0);
  }


  const handleButtonClick = () => {
    if (isLoggedIn) {
      goToMain();
    } else {
      goToLogin();
    }
  };

  // const deliveryHandler = async()=>{
  //   try {
  //     await PrevService.addDeliveryAlarms(1,20,false)
  //   } catch (error) {
  //     console.error('배송현황 알림추가 오류 발생:', error);
  //   }  
  // }
  // const regularHandler = async()=>{
  //   try {
  //     await PrevService.addRegularAlarms(1,82)
  //   } catch (error) {
  //     console.error('정기배송 알림추가 오류 발생:', error);
  //   }  
  // }
  // const inventoryHandler = async()=>{
  //   try {
  //     await PrevService.addInventoryAlarms(1,7)
  //   } catch (error) {
  //     console.error('유통기한 알림추가 오류 발생:', error);
  //   }  
  // }

  return (
    <Box className="Prev-footer"
    sx={{
      // border : "solid 3px",
      // borderColor : "rgba(255,255,255,1)",
      display : "Flex",
      justifyContent : "center",
      alignItems : "center",
      width : "85%",
      height: "10%"
    }}
    >
      <button onClick={handleButtonClick} style={{
        height: "70%", width: "25%", backgroundColor: "rgba(40, 90, 244, 0.2)", fontSize: "1.2em", color: "#000000", fontWeight: "bold",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
        zIndex: "999",
        borderRadius : "1em",
        border : "solid 3px",
        }}
        >{isLoggedIn ? "나만의 냉장고 바로가기" : "로그인하러 가기"}</button>
    </Box>
  );
};

export default Footer;

