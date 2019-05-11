var Service, Characteristic;
var request = require("request");


module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;
    homebridge.registerAccessory("homebridge-http-switcher", "HttpSwitcher", HttpSwitcher);
};

function HttpSwitcher(log, config) {
	this.log = log;
	
	// Get config info
	this.name				= config["name"]          	|| "HTTP Switcher";
	this.icon				= config["icon"]			|| 0
	this.timeout            = config["timeout"]         || 5000;
	this.statusUrl          = config["statusUrl"];
	this.durationInSeconds	= config["DefaultDuration"]		|| 60*60; //1 Hour
	
	this.remainingHMS;
	this.remaining 			= 0;
	this.powerOn 			= false;
}

HttpSwitcher.prototype = {

	httpRequest: function (url, body, method, callback) {
		var callbackMethod = callback;
		this.log("Sending API to:", url);
		this.log("API Body is:", body);
		request({
			url: url,
			body: body,
			method: method,
			timeout: this.timeout,
			rejectUnauthorized: false
			},
			function (error, response, responseBody) 
			{
				if (callbackMethod) 
				{
					callbackMethod(error, response, responseBody)
				}
				else 
				{
					//this.log("callbackMethod not defined!");
				}
			})
	},	

	getPowerState: function (callback) {

		this.valveService.getCharacteristic(Characteristic.Active).updateValue(this.powerOn);
        this.valveService.getCharacteristic(Characteristic.InUse).updateValue(this.powerOn);
		callback();            
    },
	
	setPowerState: function (powerOn, callback) {
		var url;
		var body;
		
		if (powerOn) 
		{
			url = this.statusUrl+"/switcher/turn_on";
			body = "{\"minutes\": \"" + this.durationInSeconds/60 + "\"}";
			this.log("Setting power state to ON");
		} 
		else 
		{
			url = this.statusUrl+"/switcher/turn_off";
			this.log("Setting power state to OFF");
		}
		
		this.httpRequest(url, body, "POST", function (error, response, body)
		{
			if (error)
			{
				this.log("HTTP set status function failed %s", error.message);
			} 
		}.bind(this))	

		this.valveService.getCharacteristic(Characteristic.InUse).updateValue(powerOn);
		this.valveService.getCharacteristic(Characteristic.Active).updateValue(powerOn);
		callback();
	},

	getDurationTime: function(callback){
		
		this.valveService.getCharacteristic(Characteristic.SetDuration).updateValue(this.durationInSeconds);
		callback();
	},

	setDurationTime: function(data, callback){
		this.log("Time set to: " , data.newValue/60 , "minutes");
		this.durationInSeconds = data.newValue;
	},

	getRemainingTime: function(callback){
		this.httpRequest(this.statusUrl + "/switcher/get_state", "", "GET", function (error, response, responseBody){
                if (error){
                        this.log('HTTP get status function failed: %s', error.message);
                        callback(error);
                }
                else{
                    var json = JSON.parse(responseBody);
                    this.log("switcher is: ", json.state);

                    this.remainingHMS = json.time_left;
					var a = this.remainingHMS.split(':');
					this.remaining = (+a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]); //In seconds

					this.log("Remaining time is: " + this.remainingHMS);

                    if (json.state == "on")
                    {
                            this.powerOn = 1;
                    }
                    else
                    {
                            this.powerOn = 0;
                    }
                    this.valveService.getCharacteristic(Characteristic.RemainingDuration).updateValue(this.remaining);
                    callback();
                }
            }.bind(this));
	},	

	ChangedInUse: function(data, callback){
		this.powerOn = data.newValue;

        this.valveService.getCharacteristic(Characteristic.Active).updateValue(this.powerOn);
        this.valveService.getCharacteristic(Characteristic.InUse).updateValue(this.powerOn);
        this.valveService.getCharacteristic(Characteristic.RemainingDuration).updateValue(this.durationInSeconds);
	},

	getServices: function (){
		var that = this;
		
		var informationService = new Service.AccessoryInformation();

		informationService
			.setCharacteristic(Characteristic.Manufacturer, "Sprinkler")
			.setCharacteristic(Characteristic.Model, "Sprinkler Model")
			.setCharacteristic(Characteristic.SerialNumber, "Sprinkler");

		this.valveService = new Service.Valve(this.name);
				
		this.valveService.getCharacteristic(Characteristic.ValveType).updateValue(this.icon);// Set The ICON
		
		this.valveService.getCharacteristic(Characteristic.Active)
			.on('set', this.setPowerState.bind(this))
			.on('get', this.getPowerState.bind(this));
				
		
		this.valveService.addCharacteristic(Characteristic.SetDuration);
		this.valveService.addCharacteristic(Characteristic.RemainingDuration);

			//this.valveService.addCharacteristic(Characteristic.IsConfigured);
			
		this.valveService.getCharacteristic(Characteristic.SetDuration)
			.on('change', this.setDurationTime.bind(this))
			.on('get'   , this.getDurationTime.bind(this));
			
		this.valveService.getCharacteristic(Characteristic.RemainingDuration)
			.on('get', this.getRemainingTime.bind(this));

		this.valveService.getCharacteristic(Characteristic.InUse)
			.on('change', this.ChangedInUse.bind(this));

		
		return [this.valveService];
	}
};
