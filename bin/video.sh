#!/bin/bash

gst-launch-1.0 -v rpicamsrc name=src preview=0 exposure-mode=night fullscreen=0 bitrate=1000000 ! video/x-h264,width=960,height=540,framerate=12/1 ! queue max-size-bytes=0 max-size-buffers=0 ! h264parse ! tee name=rtmpstream ! queue leaky=1 ! rtph264pay config-interval=1 pt=96 ! udpsink host=127.0.0.1 port=5004 sync=false rtmpstream. ! queue leaky=1 ! flvmux streamable=true ! rtmpsink location=rtmp://127.0.0.1:1935/cam sync=false
