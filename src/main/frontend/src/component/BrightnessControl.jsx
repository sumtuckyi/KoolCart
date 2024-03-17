import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
// import "../routes/prev/Brightness.css"

// 거리 업데이트 이벤트 핸들러들을 관리
const distanceUpdateHandlers = [];

// 거리 업데이트 이벤트를 구독하는 함수
export const onDistanceUpdate = (handler) => {
  distanceUpdateHandlers.push(handler);
};

// 거리 업데이트 이벤트를 구독 해제하는 함수
export const offDistanceUpdate = (handler) => {
  const index = distanceUpdateHandlers.indexOf(handler);
  if (index !== -1) {
    distanceUpdateHandlers.splice(index, 1);
  }
};

//BrightnessControl 컴포넌트 
const BrightnessControl = () => {

  const broker_address = 'ws://3.34.179.14';
  const PORT = 8883;
  const distanceTopic = 'sensor/distance';
  //거리, 밝기를 상태로 State로 관리
  const [distance, setDistance] = useState(null);
  const [brightness, setBrightness] = useState(0);
  let timeoutId;  //타이머 변수
  let lightstate = 0;  //밝기 on/off 상태 변수

  // 컴포넌트가 마운트되거나 업데이트될 때 실행되는 효과
  useEffect(() => {

    /*MQTT 관련 코드*/

    //MQTT Client 생성
    const distanceClient = mqtt.connect(`${broker_address}:${PORT}`);

    //MQTT 연결
    distanceClient.on('connect', () => {
      //console.log('Distance Sensor MQTT 연결 성공');
      distanceClient.subscribe(distanceTopic);
    });

    //MQTT 메세지 Callback 함수 (거리 갱신)
    distanceClient.on('message', (topic, message) => {
      //console.log("거리 메세지 수신");
      //console.log(message);
      const receivedDistance = parseFloat(message.toString()) * 100;
      // console.log(receivedDistance);
      setDistance(receivedDistance);

      distanceUpdateHandlers.forEach((handler) => {
        handler(receivedDistance);
      });
    });

    //거리 업데이트 핸들러 함수 (거리에 따른 밝기 조절)
    const handleDistanceUpdate = (newDistanceValue) => {
      //console.log('New Distance Value:', newDistanceValue);
      if (window.innerWidth < 600) {
        console.log('Web 크기');
        console.log(window.innerWidth);
        // 모바일 크기의 웹
        setBrightness(100);
        document.documentElement.style.setProperty('--initial-brightness-display', '100%');
        //console.log('Brightness set to 100%');
      }
      else{
        if (newDistanceValue <= 80) {
            //console.log(window.location.href)
            lightstate = 1;
            setBrightness(100);
            document.documentElement.style.setProperty('--initial-brightness-display', '100%');
            //console.log('Brightness set to 100%');

            if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
            }
        } else {
            if (lightstate === 1) {
            setBrightness(50);
            document.documentElement.style.setProperty('--initial-brightness-display', '50%');
            //console.log('Brightness set to 50%');
            }

            if (!timeoutId && lightstate === 1) {
            timeoutId = setTimeout(() => {
                setBrightness(0);
                lightstate = 0;
                document.documentElement.style.setProperty('--initial-brightness-display', '0%');
                //console.log('Brightness set to 0%');
                timeoutId = null;
                window.location.href="http://i10a101.p.ssafy.io";
            }, 10000); // 5초
            }
        }
    }
    };
    //거리 업데이트 이벤트 구독
    onDistanceUpdate(handleDistanceUpdate);

    //언마운트 시 Clean Up 함수
    return () => {
      if (distanceClient) {
        distanceClient.unsubscribe(distanceTopic);
        distanceClient.end();
      }
      //Default로 변경
      setBrightness(0); 
      lightstate = 0; 
      offDistanceUpdate(handleDistanceUpdate); //구독 해제
      clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return null;
};

export default BrightnessControl;
