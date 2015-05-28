###api/auth/token
Refresh access token.

|                       |                                 
|-----------------------|-----------------------          
|Method                 |__GET__                         
|Response data type     |_JSON_                 
|Response body          |`{ token: {String} }`  
|Success code           |200
|Error code             |401, 500

###api/auth/signin
Sign-In user.

|                       |                       
|-----------------------|-----------------------
|Method                 |__POST__               
|Request data type      |_JSON_                 
|Request body           |`{ login: {String}, password: {String} }`  
|Response data type     |_JSON_                 
|Response body          |`{ user: {UserModel}, token: {String} }` 
|Success code           |200
|Error code             |401, 500

###api/auth/signup
Sign-Up new user.

|                       |                       
|-----------------------|-----------------------
|Method                 |__POST__               
|Request data type      |_JSON_                 
|Request body           |`{UserModel}`  
|Response data type     |_JSON_                 
|Response body          |`{ user: {UserModel}, token: {String} }`
|Success code           |200
|Error code             |401, 500