#!/bin/sh

#echo Download all files
#node download-geonames.js

echo Importing level one governance data.
node import-admin1Codes.js

echo Importing level two governance data.
node import-admin2Codes.js

echo Importing country data
node import-countries.js

echo Importing feature data
node import-featureCodes.js

echo Importing places
node import-sample.js

#echo Download all files
#node import-geonames.js
