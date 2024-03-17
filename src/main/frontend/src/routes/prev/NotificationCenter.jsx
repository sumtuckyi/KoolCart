import React, { useState, useRef, useEffect } from 'react';
//import '../../styles/DefaultPage.css';
import PrevService from './Service/PrevService';
import {Box, Typography} from "@mui/material";
import deliveryStatusImg from "./images/deliveryStatus.jpg";
import regularDeliveryImg from "./images/regularDelivery.png";
import expirationImg from "./images/expiration.png";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { order } from '../../api/getData';
import axios from 'axios';
/*
1. 각 페이지에서 추가여부를 나타내는 전역변수 Trigger (ex. 유통기한  변수, 정기배송 변수, 배송현황 변수)
2. 추가 여부가 참인 경우의 페이지들 update 시키고 다시 Trigger를 Default로 변경 

*/

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const listRef = useRef(null);
  const navigate = useNavigate();
  const userId = useSelector((state) => state.user.userSeq);
  console.log("USER : " + userId);

  function calculateTimeLeft(expiryDate){
      const difference = +new Date(expiryDate) - +new Date();
      let timeLeft = {};

      if (difference > 0) {
        timeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        };
        //console.log(timeLeft);
        if(timeLeft.days>0) return `${timeLeft.days}일 남았습니다.`; 
        else return `유통기한이 오늘까지 입니다.`;
      }
      else return "유통기한이 지났습니다.";
  }

  // Spring Boot API 호출로부터 알림을 가져오는 함수
  const fetchNotifications = async () => {
    try {
      const response = await axios.post(`/api/message/listAll/default`, {
        "user_seq": userId,
      });
      const alarmData = response.data;
      //console.log(alarmData);
      const processedNotifications = await Promise.all(alarmData.map(async (notification) => {
        if (notification.alarmCategory === 1) {
          return await fetchOrderName(notification);
        } else if (notification.alarmCategory === 2 && notification.regularId === null) {
          return await fetchOrderName(notification);
        }
        return notification;
      }));
      //console.log(processedNotifications);
      setNotifications(processedNotifications.reverse());
    } catch (error) {
      console.error('알림을 불러오는 중 오류 발생:', error);
    }
  };
  
  const fetchOrderName = async (notification) => {
    const { orderId } = notification;
    try {
      const response = await axios.get(`http://i10a101.p.ssafy.io:8000/api4/order/${orderId}`);
      const orderName = response.data[0].name;
      const orderNum = response.data.length;
      // 알림 데이터에 주문 이름 추가
      notification.orderName = orderName;
      notification.orderNum = orderNum;
      return notification;
    } catch (error) {
      console.error('Error fetching order name:', error);
      return notification;
    }
  };

  const updateNotifications = () => {
    if (listRef.current) {
      listRef.current.scrollTop = 0;
    }
    fetchNotifications();
  };

  const removeNotification = async (alarmId) => {
    try {
      await PrevService.checkAlarm(userId, alarmId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification.alarmId !== alarmId)
      );
      updateNotifications();
    } catch (error) {
      console.error('알림 삭제 중 오류 발생:', error);
    }
  };


  const handleCheckAllNotifications = async () => {
    try {
      await PrevService.checkAllAlarms(userId);
      setNotifications([]);
      updateNotifications();
    } catch (error) {
      console.error('모든 알림 확인 중 오류 발생:', error);
    }
  };

  const handleNotificationClick = (mc_seq) => {
    switch(mc_seq){
      case 1: 
        navigate('/regular');
      case 2:
        navigate('/regular');
      case 3:
        navigate('/stock');
    }
  };


  // 알림이 추가될 때마다 스크롤을 가장 위로 이동
  useEffect(() => {
    updateNotifications();

    const intervalId = setInterval(() => {
      updateNotifications();
    }, 20000); // 10초마다 실행

    return () => clearInterval(intervalId);
  }, []);

  const renderNotificationList = () => (
    <Box className="Prev-notification-list-wrapper"
    sx={{
      display: "flex",
      flexDirection : "column",
      height : "100%"
    }}
    >
      {notifications.length > 0 ? (
        <Box className="Prev-notification-list"
        sx={{
          // border : "solid 3px",
          // borderColor : "rgba(255,255,255,1)",
          borderRadius : "2%",
          height : "95%",
          overflowY: "auto", /* 여기에만 스크롤이 생기도록 적용 */
          maxHeight: "100%", /* 화면 높이에서 Header와 Footer, h2, 버튼의 높이를 제외한 값으로 조절 */
          width : "100%",
         /* 반응형 스크롤바 스타일링 */
          "&::-webkit-scrollbar": {
            width: "1vw", // 스크롤바의 너비를 viewport width의 1%로 지정
            backgroundColor: "rgba(0,0,0,0.1)",
            borderRadius: "1em"
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,0.5)",
            borderRadius: "1em",
          },
        }}
        >
          {notifications.map((notification) => (
            <Box key={notification.alarmId} className="Prev-notification"
            sx={{
              cursor: "pointer",
              height : "15%",
              // border : "solid 3px",
              // borderColor : "rgba(255,255,255,1)",
              //backgroundColor: "rgba(28, 245, 234, 0.1)",
              backgroundColor: "rgba(88, 168, 221, 0.2)",
              borderRadius : "2em",
              boxShadow: "0 10px 10px rgba(0, 0, 0, 0.4)",
              display : "flex",
              justifyContent : "space-between",
              marginBottom : "1.2em",
              
            }}
            >
              <Box className="Prev-notification-image"
              sx={{
                // border : "solid 3px",
                // borderColor : "rgba(255,255,255,1)",
                width : "15%",
                height : "100%",
                display: "flex",
                justifyContent : "center",
                alignItems : "center",
              }}
              >
                {getImageByType(notification)}
              </ Box>
              <Box className="Prev-notification-summary-box"
              sx={{
                // border : "solid 3px",
                // borderColor : "rgba(255,255,255,1)",
                fontSize: "2em",
                width : "60%",
              }}
              >{getContentByType(notification)}</Box>
              <Box className="Prev-notification-button-box"
              sx={{
                width : "20%",
                height : "100%",
                // border : "solid 3px",
                // borderColor : "rgba(255,255,255,1)",
                display : "flex",
                justifyContent: "space-evenly",
                alignItems : "center"
              }}
              >
                <button onClick={() => removeNotification(notification.alarmId)} 
                style={{width : "40%", 
                height: "40%", 
                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
                borderRadius:"1em",
                borderColor : "#5cffd1",
                backgroundColor: "rgba(6,202,254,0.4)", 
                color: "#000000",
                fontWeight: "bold",
                fontSize: "1.2em"
                }}>확인</button>
                <button
                  onClick={() => {
                    removeNotification(notification.alarmId);
                    handleNotificationClick(notification.alarmCategory);
                  }}

                  style={{width : "40%", 
                  height: "40%", 
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
                  borderRadius:"1em",
                  borderColor : "#99ccff",
                  backgroundColor: "#99ccff", 
                  color: "#000000", // 검은색
                  fontWeight: "bold",
                  fontSize: "1.2em",
                }}
                >
                  이동
                </button>
              </Box>
            </Box>
          ))}
        </Box>
      ) : (
        <Typography className="notification-list-container"
        sx={{
          width: "100%",
          height: "30%",
          fontSize: "2em",
          fontWeight : "bold",
          color: "#000000",
          display: "flex",
          justifyContent: "center",
          alignItems : "center"
        }}
        >알림이 없습니다.</Typography>
      )}
    </Box>
  );
  

  
  const getContentByType = (notification) => {
    //console.log(notification.alarmCategory);
      switch (notification.alarmCategory) {
      case 1:
        return <Box className="Prev-notification-content-box" 
        sx={{
          height : "100%",
          width : "100%",
          color : "#000000"
        }}
        >
          <Box className="Prev-notification-content-header"
          sx={{
            display : "flex",
            justifyContent: "space-between",
            height : "40%",
            width : "100%",
            alignItems : "center",
          }}
          >
          <Typography variant="h5" sx={{fontWeight: "bold",}}>배송현황 알림</Typography>
          <Typography variant="h5">{notification.logTime}</Typography>
          </Box>
          <Box className="Prev-notification-content-summary"
          sx={{
            height : "60%",
            width : "100%",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-evenly"
          }}
          >
            <Typography sx={{ fontSize: "0.5em", fontWeight:"bold" }}>
              상품: {notification.orderName}외 {notification.orderNum}개의 상품
            </Typography>
            <Typography sx={{ fontSize: "0.5em" , fontWeight:"bold" }}>배송 완료</Typography>
          </Box>
        </Box>;
      case 2:
        return <Box className="Prev-notification-content-box"
        sx={{
          color : "#000000",
          height : "100%",
          width : "100%",
        }}
        >
        <Box className="Prev-notification-content-header"
        sx={{
            display : "flex",
            justifyContent: "space-between",
            height : "40%",
            width : "100%",
            alignItems : "center",
            
        }}
        >
        <Typography variant="h5" sx={{fontWeight: "bold",}}>정기배송 알림</Typography>
        <Typography variant="h5">{notification.logTime}</Typography>
        </Box>
        <Box className="Prev-notification-content-summary"
          sx={{
            height : "60%",
            width : "100%",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-evenly"
          }}
          >
            {notification.regularId === null ? (
        // regularId가 null인 경우
        <>
            <Typography sx={{ fontSize: "0.5em" , fontWeight:"bold"}}>
                상품: {notification.orderName}외 {notification.orderNum}개의 상품
            </Typography>
            <Typography sx={{ fontSize: "0.5em" , fontWeight:"bold"}}>배송 완료</Typography>
        </>
    ) : (
        // regularId가 null이 아닌 경우
        <>
            <Typography sx={{ fontSize: "0.5em" , fontWeight:"bold"}}>상품: {notification.regularId.name}</Typography>
            <Typography sx={{ fontSize: "0.5em" , fontWeight:"bold"}}>
                예정일 : {notification.regularId.nextOrder} (1일 남음)
            </Typography>
        </>
    )}
        </Box>
      </Box>;
      case 3:
        return <Box className="Prev-notification-content-box"
          sx={{
            color : "#000000",
            height : "100%",
            width : "100%",
          }}
        >
        <Box className="Prev-notification-content-header"
        sx={{
            display : "flex",
            justifyContent: "space-between",
            height : "40%",
            width : "100%",
            alignItems : "center"
        }}
        >
        <Typography variant="h5" sx={{fontWeight: "bold",}}>유통기한 알림</Typography>
        <Typography variant="h5">{notification.logTime}</Typography>
        </Box>
        <Box className="Prev-notification-content-summary"
          sx={{
            height : "60%",
            width : "100%",
            fontWeight: "bold",
            display : "flex",
            flexDirection : "column",
            justifyContent : "space-evenly"
          }}
          >
        <Typography sx={{fontSize: "0.5em", fontWeight:"bold"}}>유통기한 임박 품목 : {notification?.itemId?.name}</Typography>
        <Typography sx={{fontSize: "0.5em", fontWeight:"bold"}}>잔여 유통기한 : {calculateTimeLeft(notification?.itemId?.exp)}</Typography>
        </Box>
      </Box>;
      default:
        return '';
    }
  };

  const getImageByType = (notification) => {
    
    switch (notification.alarmCategory){
      case 1:
        return <img src={deliveryStatusImg} alt="배송현황" style={{ width: '70%', height: '70%', objectFit: 'contain', }}/>;
      case 2:
        return <img src={regularDeliveryImg} alt="정기배송" style={{ width: '60%', height: '60%', objectFit: 'contain' }}/>;
      case 3:
        return <img src={expirationImg} alt="유통기한" style={{ width: '50%', height: '50%', objectFit: 'contain' }}/>;
      default:
        return <img src="/images/error.jpg" alt="Error" />;
    }
  };


  return (
    <Box className="Prev-notification-center"
    sx={{
    height: "95%",
    color: "#fff",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
    zIndex: "999",
    overflow: "hidden", /* 스크롤이 생기지 않도록 숨김 */
    transition: "max-height 0.3s, width 0.3s",
    borderRadius : "5%",
    display : "flex",
    flexDirection :"column",
    alignItems : "center",
    justifyContent : "space-around",
    
    }}
    >
      <Box className="Prev-notification-center-header-box"
      sx={{
        height : "10%",
        width : "90%",
        display: "flex",
        justifyContent : "space-between",
        alignItems : "center"
      }}
      >
        <h1 style={{textAlign:"center", fontSize: "2.2em", color: "rgba(0,0,0,1)"}}>Notification Center</h1>
        <button style={{
          height : '50%', 
          width : "15%",
          
          // borderColor : "#FFFFFF",
          //backgroundColor: "rgba(92,255,209,0.5)",
          backgroundColor: "rgba(40, 90, 244, 0.2)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.6)",
          borderRadius:"2em",
          color: "#000000",
          fontWeight: "bold",
          fontSize: "1.2em",
          border : "solid 3px",
          }} onClick={handleCheckAllNotifications}>전체 확인</button>
      </Box>
      <Box className="Prev-notification-list-box"
      sx={{
        width : "90%",
        height : "90%"
      }}
      >
        {renderNotificationList()}
      </Box>
          
    </Box>
  );
};

export default NotificationCenter;
