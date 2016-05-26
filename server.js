var express = require('express');
var app = express();
var jsonbuild = require('json-build');
var parser = require('json-parser');

app.get('/', function(req, res) {
	
	var s = req.query.input;
	res.json(main(s));
	
});

app.listen('8000', function() {
	console.log('App running on port 8000');
});

/**
Main function
*/
var main = function(string) {
	var isValidQuery = paranthesisCounter(string);

	if(isValidQuery == false) {
		return 'Invalid Query: Check the ordering of the paranthesis';
	}

	var tokens = stringSplitter(string);

	if(tokens == false) {
		return 'The number of strings should not be zero';
	}
	
	var index = 1;
	var resultObject = new jsonbuild();
	var length = quotedFix(tokens);

	while(index < length) {
		if(checkQuery(tokens, index) == false) {
			return 'Invalid Query';
		}

		if(tokens[index].toUpperCase() == 'AND') {
			resultObject = jsonObject(tokens[index - 1], tokens[index + 1], resultObject, '$and', index == 1 ? true : false);
			index = index + 2;
		} else if(tokens[index].toUpperCase() == 'OR') {
			resultObject = jsonObject(tokens[index - 1], tokens[index + 1], resultObject, '$or', index == 1 ? true : false);
			index = index + 2;
		} else {
			resultObject = jsonObject(tokens[index - 1], tokens[index], resultObject, '$and', index == 1 ? true : false);
			index++;
		}
	}
	
	return parser.parse(JSON.stringify(resultObject));
}

/*
Gluing the quoted strings together.
*/
var quotedFix = function(tokens) {
	var fastIndex = 0;
	var slowIndex = 0;

	while(fastIndex < tokens.length) {
		tokens[slowIndex] = tokens[fastIndex];

		if(tokens[fastIndex].charAt(0) == '"') {
			var counter = fastIndex + 1;
			fastIndex = slowIndex;

			while(counter < tokens.length) {
				tokens[fastIndex] = tokens[fastIndex] + " " + tokens[counter];

				if(tokens[counter].charAt(tokens[counter].length - 1) == '"') {
					fastIndex = counter;
					break;
				}

				counter++;
			}
		}

		fastIndex++;
		slowIndex++;
	}

	return slowIndex;
}

/*
Creates a new json object for each new connector.
Passes this json object as a value to the result
*/
var jsonObject = function(previousToken, nextToken, json, connector, isInitial) {
	var tempObject = new jsonbuild();

	var conditionNextToken = condition(nextToken);
	var conditionPreviousToken = condition(previousToken);

	if(!conditionNextToken) {
		var array = new Array(isInitial ? previousToken : json, nextToken);
		tempObject.addValue(connector, array)
	} else if(isInitial) {
		tempObject.addValue(conditionPreviousToken, previousToken.substring(0, 4) == 'len(' ? previousToken.substring(4).replace(')', '') : previousToken.substring(1))
		tempObject.addValue(conditionNextToken, nextToken.substring(0, 4) == 'len(' ? nextToken.substring(4).replace(')', '') : nextToken.substring(1))
		json.addValue(connector, tempObject.build());

		return json.build();
	} else {
		tempObject.addValue(connector, json)
		tempObject.addValue(conditionNextToken, nextToken.substring(0, 4) == 'len(' ? nextToken.substring(4).replace(')', '') : nextToken.substring(1))
	}

	return tempObject.build();
}

/*
Check the keys
*/
var condition = function(token) {
	if(token.charAt(0) == '>') {
		return '$gt';
	} else if(token.charAt(0) == '<') {
		return '$lt';
	} else if(token.charAt(0) == '>=') {
		return '$gteq';
	} else if(token.charAt(0) == '=<') {
		return '$lteq';
	} else if(token.charAt(0) == '=') {
		return '$eq';
	} else if(token.charAt(0) == '!') {
		return '$not';
	} else if(token.substring(0,4) == 'len(') {
		return '$len';
	} else if(token.charAt(0) == '"') {
		return '$quoted';
	} else {
		return false;
	}
}

/*
Check if there are any consequitive AND's and/or OR's
*/
var checkQuery = function(tokens, index) {
	if((tokens[index].toUpperCase() == 'AND' && tokens[index - 1].toUpperCase() == 'AND') ||
	   (tokens[index].toUpperCase() == 'OR' && tokens[index - 1].toUpperCase() == 'OR') ||
	   (tokens[index].toUpperCase() == 'AND' && tokens[index - 1].toUpperCase() == 'OR') ||
	   (tokens[index].toUpperCase() == 'OR' && tokens[index - 1].toUpperCase() == 'AND'))
			return false;
}

/*
Splits the string using spaces
*/
var stringSplitter =  function(query) {
	var tokens = query.split(/\s+/);

	if(tokens.length < 2) {
		return false;
	}

	return tokens;
}

/*
Check if the number of paranthesis is balanced
*/
var paranthesisCounter = function(query) {
	var count = 0;

	for(var i = 0; i < query.length; i++) {
		if(query.charAt(i) == '(') {
			count++;
		}

		if(query.charAt(i) == ')') {
			count--;
		}

		if(count < 0) {
			return false;
		}
	}

	if(count > 0) {
		return false;
	}

	return true;
}