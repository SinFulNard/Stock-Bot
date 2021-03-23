var Discord = require('discord.js');
var auth = require('./credentials.json');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');

console.log('Starting up!');

const bot = new Discord.Client();

bot.login(auth.token);

bot.on('ready', () => {
  console.log(`Logged in as ${bot.user.tag}!`);
});

//bot.on('message', function(user, userID, channelID, message, event) {
bot.on('message', message => {
	var rxp = new RegExp(/^(asx:)[a-z0-9]{3}/i);
	var msg = message.content
	console.log('Stock request received. Message: %s', msg);
	if (rxp.test(msg)){
		var market = msg.substr(0,3).toUpperCase();
		var code = msg.substr(4,3).toUpperCase();
		console.log('Market: %s', market);
		console.log('Code: %s', code);
		//var url = "https://finance.google.com/finance/getprices?p=1d&i=60&x=ASX&f=c&q="+code;
		var url = "https://www2.asx.com.au/markets/company/"+code;
		console.log(url);
		scrape(url, message, code, market);
	} else {
		console.log('Regex failed, not responding.');
	}
});

function scrape(url, message, code, market){
    request(url, function(error, response, html){
		console.log('error:', error); // Print the error if one occurred
		console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
	        var reg = new RegExp(/[a-zA-Z]/);
		if(!error){
	        	var rows = html.split(/\r?\n/);
			console.log('html:', html);
			if(!reg.test(rows[rows.length - 2])){
				var price = "**"+code+"** is currently trading for **$"+rows[rows.length - 2]+"** on the **"+market+"**";
				console.log("Price: "+price);
				message.channel.send( price );
			} else {
				message.channel.send( "Invalid Stock" );
			}
        	} else {
			message.channel.send( "Failed to get price" );
		}
	});
}
