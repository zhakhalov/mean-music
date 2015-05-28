###GET api/users/exists?login=:login
Checks existence of email.

####Resoure Information
|                     |
|---------------------|-----------------
|URL                  |_api/users/exists?login=:login_
|Method               |_GET_
|Response formats     |_JSON_                 
|Response data        |`{Boolean}`  
|Require autorization |_false_
|Success codes        |200
|Error codes          |500

####Parameters
|Name     |Type       |Required |Description
|---------|-----------|---------|-----------  
|login    |`String`   |true     |User's email.                  


###GET api/users/:id/public
Gets public user information by id.

####Resoure Information
|                     |
|---------------------|-----------------
|URL                  |_api/users/:id/public_
|Method               |_GET_
|Response formats     |_JSON_                 
|Response data        |`{UserModel}`  
|Require autorization |_false_
|Success codes        |200
|Error codes          |404, 500

####Parameters
|Name     |Type       |Required |Description
|---------|-----------|---------|-----------  
|id       |`String`   |true     |User's id.       

###GET api/users/:id
Gets private user information by id.

####Resoure Information
|                     |
|---------------------|-----------------
|URL                  |_api/users/:id/public_
|Method               |_GET_
|Response formats     |_JSON_                 
|Response data        |`{UserModel}`  
|Require autorization |_yes(token, id)_
|Success codes        |200
|Error codes          |401, 403, 404, 500

####Parameters
|Name     |Type       |Required |Description
|---------|-----------|---------|-----------  
|id       |`String`   |true     |User's id.    

###PUT api/users/:id
Update user information.

####Resoure Information
|                     |
|---------------------|-----------------
|URL                  |_api/users/:id/public_
|Method               |_PUT_
|Request formats      |_JSON_                 
|Request data         |`{UserModel}`  
|Response formats     |_JSON_                 
|Response data        |`{UserModel}`  
|Require autorization |_yes(token, id)_
|Success codes        |200
|Error codes          |401, 403, 500

####Parameters
|Name     |Type       |Required |Description
|---------|-----------|---------|-----------  
|id       |`String`   |true     |User's id.    

###DELETE api/users/:id
Removes user.

####Resoure Information
|                     |
|---------------------|-----------------
|URL                  |_api/users/:id/public_
|Method               |_DELETE_
|Request formats      |_JSON_                 
|Require autorization |_yes(token, admin)_
|Success codes        |200
|Error codes          |401, 403, 500

####Parameters
|Name     |Type       |Required |Description
|---------|-----------|---------|-----------  
|id       |`String`   |true     |User's id.    
