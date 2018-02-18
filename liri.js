require("dotenv").config();
const keys = require('./keys.js');
let Spotify = require('node-spotify-api');
let Twitter = require('twitter');
const request = require('request');
let fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

//---------------------------------------------------------------------------------------------------

function retrieveTweets() {

	fs.appendFile('./log.txt', 'User Command: node liri.js my-tweets\n\n', (err) => {
		if (err) throw err;
	});

	var params = {screen_name: '_angrbrd', count: 20};

	client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (error) {
			var errorStr = 'ERROR: Retrieving user tweets -- ' + error;

			fs.appendFile('./log.txt', errorStr, (err) => {
				if (err) throw err;
				console.log(errorStr);
			});
			return;
		} else {
			var outputStr = '------------------------\n' +
							'User Tweets:\n' + 
							'------------------------\n\n';

			for (var i = 0; i < tweets.length; i++) {
				outputStr += 'Created on: ' + tweets[i].created_at + '\n' + 
							 'Tweet content: ' + tweets[i].text + '\n' +
							 '------------------------\n';
			}

			fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
				if (err) throw err;
				console.log(outputStr);
			});
		}
	});
}

//------------------------------------------------------------------------------------------------------

function spotifySong() {

    song = process.argv[3];

	fs.appendFile('./log.txt', 'User Command: node liri.js spotify-this-song ' + song + '\n\n', (err) => {
		if (err) throw err;
	});

	spotify.search({ type: 'track', query: song}, function(error, data) {
	    if (error) {
			var errorStr1 = 'ERROR: Retrieving Spotify track -- ' + error;

			fs.appendFile('./log.txt', errorStr1, (err) => {
				if (err) throw err;
				console.log(errorStr1);
			});
			return;
	    } else {
			var songInfo = data.tracks.items[0];
			if (!songInfo) {
				var errorStr2 = 'ERROR: No song info retrieved, please check the spelling of the song name!';

				fs.appendFile('./log.txt', errorStr2, (err) => {
					if (err) throw err;
					console.log(errorStr2);
				});
				return;
			} else {
				var outputStr = '------------------------\n' + 
								'Song Information:\n' + 
								'------------------------\n\n' + 
                                'Artist: ' + songInfo.artists[0].name + '\n' + 
                                'Song Name: ' + songInfo.name + '\n'+
                                'Preview Link: ' + songInfo.preview_url + '\n' +
                                'Album: ' + songInfo.album.name + '\n';

				fs.appendFile('./log.txt', 'LIRI Response:\n\n' + outputStr + '\n', (err) => {
					if (err) throw err;
					console.log(outputStr);
				});
			}
	    }
	});
}

//-------------------------------------------------------------------------------------------------------

function retrieveOMDBInfo() {

    var movieName = process.argv[3];
    
	if (movieName === '') {
        movieName = 'Mr.+Nobody'
	} else {
		movieName = movieName
    }

    // movieName = movieName.split(' ').join('+');
    console.log(movieName);

	var queryURL = 'http://www.omdbapi.com/?t=' + movieName + '&y=&plot=short&apikey=trilogy';


	request(queryURL, function (error, response, body) {
		if(!error && response.statusCode === 200) {

		    	var outputStr = '------------------------\n' + 
								'Movie Information:\n' + 
								'------------------------\n\n' +
								'Movie Title: ' + JSON.parse(body).Title + '\n' + 
								'Year Released: ' + JSON.parse(body).Released + '\n' +
								'IMBD Rating: ' + JSON.parse(body).imdbRating + '\n' +
                                'Rotten Tomatoes Rating: ' + JSON.parse(body).tomatoRating + '\n' +
                                'Country Produced: ' + JSON.parse(body).Country + '\n' +
                                'Language: ' + JSON.parse(body).Language + '\n' +
                                'Plot: ' + JSON.parse(body).Plot + '\n' +
                                'Actors: ' + JSON.parse(body).Actors + '\n';

				
					console.log(outputStr);
				
		}
	});
}
//----------------------------------------------------------------------------------------------------

function doWhatItSays() {
    fs.readFile('random.txt', 'utf8', function(err, data) {
        if(err) {
            console.log(err);
        }
        else{
            var dataArry = data.split(',');
            console.log(dataArry[1]);
        }
    })
}
//----------------------------------------------------------------------------------------------------

if(process.argv[2] ==="my-tweets") {
    retrieveTweets();
}
else if(process.argv[2] === "spotify-this-song") {
    spotifySong();
}
else if(process.argv[2] === "movie-this") {
    retrieveOMDBInfo();
}
else if(process.argv[2] ==="do-what-it-says") {
    doWhatItSays();
}
