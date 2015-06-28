#node-epc v0.1.0

A library for Node.js to parse EPC encoded values from Gen2 RFID tags.

This library can be used to parse 96-bit values read from the EPC memory of a Gen2 RFID tag.  Parsers are included for the standard encodings as defined in ["2 GS1 EPC Tag Data Standard 1.6"](http://www.gs1.org/sites/default/files/docs/epc/tds_1_6-RatifiedStd-20110922.pdf "2 GS1 EPC Tag Data Standard 1.6").

##Installation
**npm install node-epc --save**

##Basic Usage
Most of the functions will return a promise, except for getName which returns a string synchronously.
```
'use strict';

var epc = require('../');
//var epc = require('node-epc');

// Parse by discovering the encoding
epc.parse('30344B5A1C78902000000001')
	.then(function(parsed) {
		console.log('Encoding = ' + parsed.getName());
		console.log('Company Prefix = ' + parsed.parts.CompanyPrefix);
		console.log('Item Reference = ' + parsed.parts.ItemReference);
		console.log('Serial Number = ' + parsed.parts.SerialNumber);
	})
	.fail(function(err) {
		console.error(err);
	});

// Parse using a specific encoding
epc.getParser('SGTIN')
	.then(function(sgtin) {
		sgtin.parse('30344B5A1C78902000000001')
			.then(function(parsed) {
				console.log('Encoding = ' + parsed.getName());
				console.log('Company Prefix = ' + parsed.parts.CompanyPrefix);
				console.log('Item Reference = ' + parsed.parts.ItemReference);
				console.log('Serial Number = ' + parsed.parts.SerialNumber);
			})
			.fail(function(err) {
				console.error(err);
			});
	});
```

##API
###Default Class###
The default class only contains two functions:

**getParser(string encoding)**<br>
Get the parser for the encoding specified by "encoding".  Supported encodings are "DOD", "GDTI", "GIAI", "GID", "GRAI", "GSRN", "RAW", "SGLN", "SGTIN", and "SSCC".

**parse(string val)**<br>
Discover the type of parser that can work with the given value, create an instance of it, and call the specific parser's parse() function.  The resulting parser instance will be passed to the promise resolver.

###Parser Class###
The parser objects implement the following functions:

**canParse(string val)**<br>
Resolve to a boolean value indicating whether or not this parser can handle the given encoded value.  The RAW parser will always return true and should be used as the parser of last resort.

**getName()**<br>
Synchronously returns the name of the encoding that this parser can handle.  For example, "SGTIN" or "RAW".

**getUri()**<br>
Return the parsed RFID value using the URI appropriate for the parser's encoding.

**parse(string val)**<br>
Parse the given RFID value and store the results in the *parts* collection.  Different encodings will have different parts according to the EPC standard.  See the standards document or the project's tests for more details.

The parser objects also expose a collection called "parts" that contains the information parsed from the value passed to the parse() function.  Not all tag encodings will provide all parts.  The default parts collection is defined as follows:
```
parts: {
		Header: undefined,
		Filter: undefined,
		Partition: undefined,
		CompanyPrefix: undefined,
		ItemReference: undefined,
		SerialNumber: undefined,
		SerialReference: undefined,
		LocationReference: undefined,
		Extension: undefined,
		AssetType: undefined,
		IndividualAssetReference: undefined,
		ServiceReference: undefined,
		DocumentType: undefined,
		ManagerNumber: undefined,
		ObjectClass: undefined,
		CAGEOrDODAAC: undefined
	}
```

##License
Copyright 2015 Sean Arme

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at:

[http://www.apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0 "http://www.apache.org/licenses/LICENSE-2.0")

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.