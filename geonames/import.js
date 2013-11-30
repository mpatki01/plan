var mongoose = require('mongoose');
var databaseName = 'geonames';
var connection_string = 'mongodb://192.168.2.2/'+databaseName;
var db = mongoose.connect(connection_string);

var schema_geonames = mongoose.Schema({ 
					geonameid		: 	Number, 
					name			: 	String,							
					asciiname  		: 	String,
					alternatenames  : 	String,
					loc				:   [Number],
					feature_class   : 	String,
					feature_code	: 	String,
					country_code  	: 	String,
					alternatenames  : 	String,
					cc2			    : 	String,
					admin1			: 	String,
					admin2			: 	String,
					admin3			: 	String,
					admin4			: 	String,
					population		: 	String,
					elevation		: 	Number,
					dem			    : 	String,
					timezone		: 	String,
					modification_date	: 	String
							});

schema_geonames.index ({
       loc : "2d",
       asciiname : 1,
       name : 1
});


var Geonames = db.model('Geonames', schema_geonames);

var carrier = require('carrier');
var fs = require('fs');
var filename = './data/allCountries.txt';
var inStream = fs.createReadStream(filename, {flags:'r'});
var geoname = null;
var index = 1;

carrier.carry(inStream)
	.on('line', 
	
		function(line) {
	    	
			var fields =  line.split('\t');
			
			geoname = new Geonames({
					geonameid			: 	fields[0], 
					name				: 	fields[1],							
					asciiname  			: 	fields[2],
					alternatenames  	: 	fields[3],
					loc					:   [fields[4],fields[5]],
					feature_class   	: 	fields[6],
					feature_code		: 	fields[7],
					country_code  		: 	fields[8],
					alternatenames  	: 	fields[9],
					cc2			   	 	: 	fields[10],
					admin1				: 	fields[11],
					admin2				: 	fields[12],
					admin3				: 	fields[13],
					admin4				: 	fields[14],
					population			: 	fields[15],
					elevation			: 	fields[16],
					dem			   		: 	fields[17],
					timezone			: 	fields[18],
					modification_date	: 	fields[19]
			});
			
			
			
			geoname.save(function (err) {
                if (err) {
                    console.log('Error save geonames');
                }
                console.log("Record #" + index + " : " + fields[0] + " saved.");
			});

            geoname = null;
			index++;
		}
	)
	
	.on('end',
	
		function(){
				console.log('end');			
				process.exit(1);
			}
	);


