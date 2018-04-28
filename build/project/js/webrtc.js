
//var server = "https://192.168.1.50:8089/janus";
var server = "/janus";

var janus = null;
var streaming = null;
var started = false;
var selectedStream = null;

var streamContext = StreamContext;
var audioSpectrumWidget = AudioSpectrumWidget;

$(document).ready(function() {
	// Initialize the library (all console debuggers enabled)
	Janus.init({debug: "all", callback: function() {
			// Make sure the browser supports WebRTC
		if(!Janus.isWebrtcSupported()) {
			window.alert("No WebRTC support... ");
			return;
		}
		
		// Create session
		janus = new Janus(
			{
				server: server,
				success: function() {
					// Attach to streaming plugin
					
					janus.attach(
						{
							plugin: "janus.plugin.streaming",
							success: function(pluginHandle) {
								streaming = pluginHandle;
								Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
								loadStream();
							},
							error: function(error) {
								Janus.error("  -- Error attaching plugin... ", error);
								window.alert("Error attaching plugin... " + error);
							},
							onmessage: function(msg, jsep) {
								Janus.debug(" ::: Got a message :::");
								Janus.debug(JSON.stringify(msg));
								var result = msg["result"];
								if(result !== null && result !== undefined) {
									if(result["status"] !== undefined && result["status"] !== null) {
										var status = result["status"];
										if(status === 'starting')
											$('#status').removeClass('hide').text("Starting, please wait...").show();
										else if(status === 'started')
											$('#status').removeClass('hide').text("Started").show();
										else if(status === 'stopped')
											stopStream();
									}
								} else if(msg["error"] !== undefined && msg["error"] !== null) {
									window.alert(msg["error"]);
									stopStream();
									return;
								}
								if(jsep !== undefined && jsep !== null) {
									Janus.debug("Handling SDP as well...");
									Janus.debug(jsep);
									// Answer
									streaming.createAnswer(
										{
											jsep: jsep,
											media: { audioSend: false, videoSend: false },	// We want recvonly audio/video
											success: function(jsep) {
												Janus.debug("Got SDP!");
												Janus.debug(jsep);
												var body = { "request": "start" };
												streaming.send({"message": body, "jsep": jsep});
											},
											error: function(error) {
												Janus.error("WebRTC error:", error);
												window.alert("WebRTC error... " + JSON.stringify(error));
											}
										});
								}
							},
							onremotestream: function(stream) {
								Janus.debug(" ::: Got a remote stream :::");
								Janus.debug(JSON.stringify(stream));
								
								Janus.attachMediaStream($('#video').get(0), stream);
								streamContext.init(stream);
								audioSpectrumWidget.enable();
								
							},
							oncleanup: function() {
								Janus.log(" ::: Got a cleanup notification :::");
							}
						});
				},
				error: function(error) {
					Janus.error(error);
					window.alert(error, function() {
						//window.location.reload();
					});
				},
				destroyed: function() {
					//window.location.reload();
				}
			});
	}});
});

function loadStream() {
	var body = { "request": "list" };
	Janus.debug("Sending message (" + JSON.stringify(body) + ")");
	streaming.send({"message": body, success: function(result) {
		if(result === null || result === undefined) {
			window.alert("Got no response to our query for available streams");
			return;
		}
		if(result["list"] !== undefined && result["list"] !== null) {
			var list = result["list"];			
			Janus.log("Got a list of available streams");
			Janus.debug(list);
			selectedStream = list[0]["id"]
		}
		startStream();
	}});
}

function startStream() {
	Janus.log("Selected video id #" + selectedStream);
	if(selectedStream === undefined || selectedStream === null) {
		window.alert("Select a stream from the list");
		return;
	}
	var body = { "request": "watch", id: parseInt(selectedStream) };
	streaming.send({"message": body});
}
