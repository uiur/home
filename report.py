import bme280
import datetime
from tsl2561 import TSL2561

tsl = TSL2561()
print "time:\"%s\"\ttemperature:%f\tpressure:%f\thumidity:%f\tlux:%d" % ((datetime.datetime.now(), ) + bme280.readData() + (tsl.lux(), ))
