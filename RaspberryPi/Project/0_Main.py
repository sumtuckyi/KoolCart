import threading
import subprocess


def run_DHT11():
    subprocess.run(["/usr/bin/python3", "2_DHT11.py"])


def run_distance():
    subprocess.run(["/usr/bin/python3", "1_distance_sensor.py"])


if __name__ == "__main__":
    # Temperature
    #temp_thread = threading.Thread(target=run_temp)
    #temp_thread.start()

    # Humidity
    #humid_thread = threading.Thread(target=run_humid)
    #humid_thread.start()
    
    # DHT11
    DHT11_thread = threading.Thread(target=run_DHT11)
    DHT11_thread.start()

    # Distance
    distance_thread = threading.Thread(target=run_distance)
    distance_thread.start()
    
    # Waiting in Main Thread
    #temp_thread.join()
    #humid_thread.join()
    DHT11_thread.join()
    distance_thread.join()
