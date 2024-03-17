#! /bin/bash
sleep 15
/usr/bin/python3 /home/{USER_NAME}/Project/2_DHT11.py &
/usr/bin/python3 /home/{USER_NAME}/Project/1_distance_sensor.py &

# /usr/bin/python3 /home/{USER_NAME}/websocket/test2.py &
# /usr/bin/python3 /home/{USER_NAME}/websocket/testdistance.py &
