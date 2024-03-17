// src/components/Header.js
import Clock from '../../component/Clock';
import WeatherWidget from './WeatherWidget';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//import { format } from 'date-fns';
//import Clock from 'react-live-clock';
import mqtt from 'mqtt';
// import '../../styles/DefaultPage.css'; // 스타일 파일 import
import {Box, Typography} from '@mui/material';
import freezer from './images/freezer.png';

const Header = () => {

  const [currentTime, setCurrentTime] = useState(new Date());
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(null);
  const [sensorData, setSensorData] = useState({ humid: null, temp: null });
  
  const city = 'Seoul';
  const apiKey = '659a46c89e76ba3da34c4d532a6aab18';
  const brokerAddress = 'ws://3.34.179.14';
  const port = 8883;
  const fridgeTopic = 'sensor/dht11';


  useEffect(() => {
    // Time and Weather data fetching
    const fetchData = async () => {
      const timeIntervalId = setInterval(() => {
        setCurrentTime(new Date());
      }, 1000);

      try {
        const coordinates = await axios.get(
          `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
        );
        const desiredCity = coordinates.data.find((c) => c.name === city);
        //console.log(desiredCity.local_names.ko);
        if (desiredCity) {
          const { lat, lon } = desiredCity;
          setCityName(desiredCity.local_names.ko)
          const weatherResponse = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
          );
          //console.log(weatherResponse.data);
          setWeatherData(weatherResponse.data);

        } else {
          console.error(`City not found: ${city}`);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }

      return () => {
        clearInterval(timeIntervalId);
      };
    };

    fetchData();

    // MQTT for Fridge data
    const DHTClient = mqtt.connect(`${brokerAddress}:${port}`);

    DHTClient.on('connect', () => {
      console.log('DTH11 MQTT 연결 성공');
      DHTClient.subscribe(fridgeTopic);
    });

    DHTClient.on('message', (topic, message) => {
      //console.log('메세지 수신');
      //console.log(message);

      const received = message.toString();
      const data = received.match(/[-+]?[0-9]*\.?[0-9]+/g).map(Number);

      setSensorData({
        humid: data[0],
        temp: data[1],
      });
    });

    return () => {
      DHTClient.end();
    };
  }, [city, apiKey, brokerAddress, port, fridgeTopic]);


  return (
    <Box className="Prev-header"
    sx={{
      display : "Flex",
      justifyContent : "space-around",
      width : "85%",
      height: "15%",
    }}
    >
      {/* <Box className="Prev-date-time-weather-box"
      sx={{
        //border : "solid 3px",
        //borderColor : "rgb(92, 255, 209, 1)",
        display : "Flex",
        justifyContent : "space-around",
        width: "65%",
        // backgroundColor: "rgba(28, 245, 234, 0.0)",
        // borderRadius : "3em",
        // boxShadow: "0 10px 10px rgba(0, 0, 0, 0.5)",
        zIndex: "999",
      }}
      > */}
        <Box className="Prev-date-time-box"
        sx={{
          //border : "solid 3px",
          //borderColor : "rgb(92, 255, 209, 1)",
          display : "Flex",
          flexDirection : "column",
          justifyContent : "center",
          alignItems: "center",
          width: "25%",
          color : "rgba(0,0,0,1)",
          fontWeight : "bold",
          backgroundColor: "rgba(84, 124, 247, 0.2)",
          borderRadius : "3em",
          boxShadow: "0 10px 10px rgba(0, 0, 0, 0.5)",
          zIndex: "999",
        }}
        >
            <Clock/>
        </Box>
        <WeatherWidget />
      {/* </Box> */}


      <Box className="Prev-fridgeinfo-box"
      sx={{
        //border : "solid 3px",
        //borderColor : "rgb(92, 255, 209, 1)",
        display : "Flex",
        flexDirection: "column",
        justifyContent : "space-around",
        width: "30%",
        //backgroundColor: "rgba(28, 245, 234, 0.1)",
        backgroundColor: "rgba(84, 124, 247, 0.2)",
        borderRadius : "3em",
        boxShadow: "0 10px 10px rgba(0, 0, 0, 0.5)",
        zIndex: "999",
      }}
      >
        <Box className="Prev-fridgeinfo-text-header"
        sx={{
          height : "30%",
          //border : "solid 3px",
          //borderColor : "rgb(92, 255, 209, 1)",
          fontSize: "1.4em",
          textAlign: "center",
          fontWeight : "bold",
          color : "rgba(0,0,0,1)",
          display : "flex",
          justifyContent : "center",
          alignItems : "center",
        }}
        >Fridge Information</Box>
        <Box className="Prev-fridgeinfo-text-box"
        sx={{
          height : "70%",
          width : "100%",
          //border : "solid 3px",
          //borderColor : "rgb(92, 255, 209, 1)",
          display : "Flex",
          color : "rgba(255,255,255,1)",
          justifyContent: "center",
          alignItems: "center"
        }}
        >
        <Box className="Prev-fridgeinfo-img-box"
        sx={{
          height : "100%",
          width : "40%",
          display: "flex",
          justifyContent:"center",
          alignItems : "center",
        }}
        >
        <img src={freezer} alt="freezer" style={{ width: '90%', height: '90%', objectFit: 'contain',}}></img>
        </Box>
        <Typography
          sx={{
            fontsize:"3em",
            height: "100%",
            width : "60%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <Box className="Prev-fridgeifo-text-wrapper"
          sx={{
            height: "70%",
            width : "100%",
            fontSize: "1.1em",
            color: "#000000",
            fontWeight: "bold",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-evenly",
            alignItems:"center"
          }}
          >
          {sensorData.temp !== null && <p>내부 온도 : {sensorData.temp} °C</p>}
          {sensorData.humid !== null && <p>내부 습도 : {sensorData.humid} %</p>}
          </Box>
          
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
