import bme280
import datetime

print "time:\"%s\"\ttemperature:%f\tpressure:%f\thumidity:%f" % ((datetime.datetime.now(), ) + bme280.readData())
