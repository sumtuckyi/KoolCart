# Raspiberry Pi
---

**Raspiberry Pi 4B (Raspbian OS 64bit Legacy)**
**온/습도 센서 : DHT11**
**초음파 센서 : HCSR04**

---


### 1. 부팅 시 Kiosk 모드로 대기화면 자동 실행

경로 이동: ```cd /home/{USER_NAME}``` 또는 ```cd ~```

#### 1) start_chromium.sh 추가

```start_chromium.sh 파일을 현재 경로에 넣기```
```{YOUR_KIOSK_SERVICE_URL} : 배포한 서비스 URL로 수정```

<br>

#### 2) start_sensor.sh 추가

```start_sensor.sh 파일을 현재 경로에 넣기```


<br>

#### 3) 실행 권한 수정

```sudo chmod +x /home/a101/start_chromium.sh```
```sudo chmod +x /home/a101/start_sensor.sh```

<br>

#### 4) 자동 실행

```sudo vi /etc/xdg/lxsession/LXDE-pi/autostart```
아래 코드 추가
```@/bin/bash /home/a101/start_chromium.sh &```
```@/bin/bash /home/a101/start_sensor.sh &```

<br>

---

### 2. Raspiberry Pi에 필요한 패키지 설치

```sudo apt-get install python3
pip3 install paho-mqtt
sudo apt-get install python3-dev python3-pip
sudo python3 -m pip install --upgrade pip setuptools wheel
sudo pip3 install Adafruit_DHT
```

---

### 3. Python Code

#### 1) 경로 이동 
```cd /home/{USER_NAME}``` 또는 ```cd ~```

#### 2) Project 디렉토리 현재 경로에 배치

#### 3) env.py 수정
```"YOUR_MQTT_BROKER_ADDRESS" : 사용할 MQTT 브로커 IP 주소로 수정```

---

### 4. MQTT BROKER

(사용자의 MQTT 브로커 IP에서 작업)


#### 1) 패키지 설치
```
sudo apt install mosquitto -y
sudo apt install mosquitto-clients -y
```
<br>

#### 2) conf 파일 수정

```sudo vi /etc/mosquitto/mosquitto.conf```
```
# 아래 코드 제일 하단에 추가 후 저장
--------------------------------

# MQTT 포트 설정
listener 1883
protocol mqtt

# WebSocket 포트 설정
listener 8883
protocol websockets 

# bind_address [허용할 IP 주소 작성]

allow_anonymous true
```

<br>

#### 3) 재시작

```
sudo /etc/init.d/mosquitto stop
cd /etc/mosquitto
sudo mosquitto -c mosquitto.conf -v
```

#### 4) Reboot시 자동을 실행 안 될 경우

(재시작이 너무 빨라서 브로커 실행이 안될 수 있음)

##### 4-1) 재시작 시간 수정

```sudo vi /usr/lib/systemd/system/mosquitto.service```


```
# Restart 아래에 한 줄 추가 후 저장
------------------------------
RestartSec=10
```

##### 4-2) 다시 실행

- 재시작
    ```
    sudo systemctl daemon-reload
    sudo systemctl restart mosquitto.service
    ```


- Running 상태 확인
```sudo systemctl status mosquitto.service ```

<br>

- Running이 아닌 경우 Error Log 확인
```sudo journalctl -u mosquitto.service```
또는
```sudo journalctl -xe | grep mosquitto```

