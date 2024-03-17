// src/components/Header.js
import Clock from '../../component/Clock';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {Box, Typography} from '@mui/material';
import humidityicon from './images/humidityicon.png';
import windicon from './images/windicon.png';
import icon01d from './images/weathericons/01d.png';
import icon02d from './images/weathericons/02d.png';
import icon03d from './images/weathericons/03d.png';
import icon04d from './images/weathericons/04d.png';
import icon09d from './images/weathericons/09d.png';
import icon10d from './images/weathericons/10d.png';
import icon11d from './images/weathericons/11d.png';
import icon13d from './images/weathericons/13d.png';
import icon50d from './images/weathericons/50d.png';
import icon01n from './images/weathericons/01n.png';
import icon02n from './images/weathericons/02n.png';
import icon03n from './images/weathericons/03n.png';
import icon04n from './images/weathericons/04n.png';
import icon09n from './images/weathericons/09n.png';
import icon10n from './images/weathericons/10n.png';
import icon11n from './images/weathericons/11n.png';
import icon13n from './images/weathericons/13n.png';
import icon50n from './images/weathericons/50n.png';



const Header = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [cityName, setCityName] = useState(null);
  
  const city = 'Seoul';
  const apiKey = '659a46c89e76ba3da34c4d532a6aab18';

  useEffect(() => {
    // Time and Weather data fetching
    const fetchData = async () => {
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
          //console.log(weatherData);
          //console.log(weatherData.weather[0].icon);
        } else {
          console.error(`City not found: ${city}`);
        }
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchData();
  }, [city, apiKey]);

  const getWeatherIcons = (iconId) => {
    //console.log(iconId);
    switch (iconId) {
      case '01d':
        return icon01d;
      case '02d':
        return icon02d;
      case '03d':
        return icon03d;
      case '04d':
        return icon04d;
      case '09d':
        return icon09d;
      case '10d':
        return icon10d;
      case '11d':
        return icon11d;
      case '13d':
        return icon13d;
      case '50d':
        return icon50d;
      case '01n':
        return icon01n;
      case '02n':
        return icon02n;
      case '03n':
        return icon03n;
      case '04n':
        return icon04n;
      case '09n':
        return icon09n;
      case '10n':
        return icon10n;
      case '11n':
        return icon11n;
      case '13n':
        return icon13n;
      case '50n':
        return icon50n;
      default:
        return null; // 기본값으로 null 반환
    }
  };
  

  return (
        <Box className="Prev-weather-box"
          sx={{
            border : "solid 3px",
            //borderColor : "rgb(92, 255, 209, 1)",
            display : "Flex",
            justifyContent : "space-around",
            width: "40%",
            //backgroundColor: "rgba(28, 245, 234, 0.0)",
            borderRadius : "3em",
            boxShadow: "0 10px 10px rgba(0, 0, 0, 0.5)",
          }}
        >
          {weatherData ? (
            <Box className="Prev-weather-info-box"
            sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                color : "rgba(0,0,0 ,1)"
            }}
            >
                <Box className="Prev-weather-country-img-wrapper"
                sx={{
                    display : "flex",
                    width : "100%",
                    height : "70%"
                }}
                >
                    <Box className="Prev-weather-temp-country-box"
                    sx={{
                        width : "50%",
                        height : "100%",
                    }}
                    >
                        <Box className="Prev-weather-temp-box"
                        sx={{
                            width: "100%",
                            height: "60%",
                            fontSize : "2.3em",
                            fontWeight : "bold",
                            display : "flex",
                            justifyContent: "center",
                            alignItems : "center",
                        }}
                        >
                            {weatherData.main.temp} °C
                        </Box>
                        <Box className="Prev-weather-country-box"
                        sx={{
                            width: "100%",
                            height: "40%",
                            fontSize : "1.2em",
                            fontWeight : "bold",
                            display : "flex",
                            justifyContent: "center",
                            alignItems : "center",
                        }}
                        >
                            현재 지역: {cityName}
                        </Box>
                    </Box>
                    <Box className="Prev-weather-img-box"
                    sx={{
                        width : "50%",
                        height : "100%",
                        display: "flex",
                        justifyContent : "center",
                        alignItems : "center",
                    }}  
                    >
                    <img
                        src={getWeatherIcons(weatherData.weather[0].icon)}
                        alt="Weather Icon"
                        style={{ width: '70%', height: '70%', objectFit: 'contain',}}
                    />
                    </Box>
                </Box>
                <Box className="Prev-weather-humid-wind-wrapper"
                sx={{
                    display: "flex",
                    width: "100%",
                    height: "30%",
                    //justifyContent: "center",
                }}
                >
                        <Box className="Prev-weather-temp-box"
                        sx={{
                            width: "50%",
                            height: "100%",
                            display : "flex",
                            justifyContent: "center",
                            alignItems : "center",
                        }}
                        >   <img src={humidityicon} alt="습도 아이콘" style={{width: '40%', height: '50%', objectFit: 'contain',}}></img>
                            <Typography
                            sx={{
                                fontSize : "1.3em",
                                fontWeight : "bold",
                            }}
                            >{weatherData.main.humidity}%</Typography>
                        </Box>
                        <Box className="Prev-weather-country-box"
                        sx={{
                            width: "40%",
                            height: "100%",
                            display : "flex",
                            justifyContent: "center",
                            alignItems : "center",
                        }}
                        >
                            <img src={windicon} alt="풍속 아이콘" style={{width: '40%', height: '50%', objectFit: 'contain',}}></img>
                            <Typography
                            sx={{
                                fontSize : "1.3em",
                                fontWeight : "bold",
                            }}
                            >{weatherData.wind.speed}m/s</Typography>
                        </Box>
                </Box>
            </Box>
          ) : (
            <p>Loading weather data...</p>
          )}
        </Box>
  );
};

export default Header;
