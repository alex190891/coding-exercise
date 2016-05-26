# coding-exercise
This project takes in a search query from the user and converts into a JSON Object. The Search rules are consistent with the project specifications.

The JSON object is built from left to right irrespective of the order of the connectors:
--Sample Query : >400 and <500 or >600
--Output : {"$or":
                  {"$and":
                          {"$gt":"400","$lt":"500"}
                  }
            ,"$gt":"600"}
            
It is assumed that the connectors and the values are atleast delimited by a single space (Multiple spaces are handled). The Query is checked for inconsistencies such as the number of paranthesis, two adjacent connectors.

'And', 'Or' cannot be used as values since they are connectors.

The API (Port : 8000) can be accessed as follow:
http://localhost:8000/?input=>400and <500 or >600

The Output is prompted back onto the browser.
