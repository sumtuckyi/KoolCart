from gpiozero import DistanceSensor
import paho.mqtt.client as mqtt
import env.broker_address as broker_address
import env.PORT as port
from time import sleep

sensor = DistanceSensor(echo=15, trigger=14)
topic = "sensor"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    print("1")

def publish_sensor_data(client):
    while True:
        distance = sensor.distance
        print(f'Distance: {distance} [m]')
        client.publish(topic + "/distance", str(distance))
        sleep(0.2)


if __name__ == "__main__":
    client = mqtt.Client()
    client.on_connect = on_connect

    client.connect(broker_address, port, 60)

    client.loop_start()
    publish_sensor_data(client)
