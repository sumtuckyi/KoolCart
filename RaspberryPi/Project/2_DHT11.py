import Adafruit_DHT
import paho.mqtt.client as mqtt
import env.broker_address as broker_address
import env.PORT as port
from time import sleep

sensor = Adafruit_DHT.DHT11
pin = 2
topic = "sensor"

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    print(rc)

def publish_sensor_data(client):
    while True:
        data = Adafruit_DHT.read_retry(sensor, pin)
        print(f'Humidity: {data[0]} [%RH]')
        print(f'Temperature: {data[1]} [°C]')
        #const parsedData = str(data[0]+'/'+data[1])
        client.publish(topic + "/dht11",str(data))

if __name__ == "__main__":
    client = mqtt.Client()
    client.on_connect = on_connect

    client.connect(broker_address, port, 60)

    client.loop_start()
    publish_sensor_data(client)

