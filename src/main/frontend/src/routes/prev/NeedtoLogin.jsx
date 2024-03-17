// MiddleComponent.js
import React from 'react';
//import '../../styles/DefaultPage.css'; // 스타일 파일 import
import loginQRImage from './images/loginQR.png';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo1.png'

const NeedtoLogin = ({switchToNotificationCenter}) => {
  const navigate = useNavigate();
  const handleCompleteButtonClick = () => {
    // NeedtoLogin 컴포넌트에서 완료하기 버튼 클릭 시 NotificationCenter로 전환
    navigate('/login');
    switchToNotificationCenter();
  };

  return (
    <Box className="Prev-LoginPage-Box"
    sx={{
      width : "100%",
      height: "90%",
      color: "rgb(0,0,0)",
      backgroundColor: "rgba(0, 0, 0, 0.1)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
      zIndex: "999",
      borderRadius : "5%",
      display : "flex",
      flexDirection :"column",
      alignItems : "center",
      justifyContent : "space-evenly",
      }}
    >
      
      <img src={logo} alt="Logo" style={{height:"20%"}}></img>
      <h2 style={{fontSize:"3em"}}>Welcome to Smart Fridge</h2>
      <p style={{fontSize:"2em", fontWeight:"bold"}}>최초 로그인이 필요합니다.</p>
      <p style={{fontSize:"1.5em", fontWeight:"bold"}}>아래 버튼을 클릭하여 로그인 해주시기 바랍니다.</p>
      {/* <img src={loginQRImage} alt="QR Code" width="400" height="400"></img>
      <button className="login-button" onClick={handleCompleteButtonClick} 
      style={{
        width : "30%", 
        height: "10%", 
        fontSize:"3em",
        borderRadius : "1.5em",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
        backgroundColor: "#5cffd1"
        }}>
        로그인 완료
      </button> */}
      
    </Box>
  );
};

export default NeedtoLogin;
