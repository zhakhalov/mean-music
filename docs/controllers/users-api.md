###GET api/users/exists?login={login}
Checks existence of login.

####Resoure Information
|                      |
|----------------------|-----------------
| URL                  | *api/users/exists?login={login}*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `Boolean`  
| Require autorization | *false*
| Success codes        | 200
| Error codes          | 500

####Parameters
| Name     | Type       | Required | Description
|----------|------------|----------|-----------  
| login    | `String`   | true     | User's login.       

***

###GET api/users/{userId}
Provides public user information by id.

####Resoure Information
|                      |
|----------------------|-----------------
| URL                  | *api/users/{userId}*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `{UserModel}`  
| Require autorization | *false*
| Success codes        | 200
| Error codes          | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| userId     | `String`   | true     | User's id.       

***

###GET api/users/me
Gets information about current user based on **Authorization** header

####Resoure Information
|                      |
|----------------------|-----------------
| URL                  | *api/users/me*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `{UserModel}`  
| Require autorization | **yes**
| Require roles        | *user*
| Success codes        | 200
| Error codes          | 401, 403, 404, 500

***

###PUT api/users/me
Update current user user.

####Resoure Information
|                      |
|----------------------|-----------------
| URL                  | *api/users/me*
| Method               | *PUT*
| Request formats      | *JSON*                 
| Request data         | `{UserModel}`  
| Response formats     | *JSON*                 
| Response data        | `{UserModel}`  
| Require autorization | **yes**
| Require roles        | *user*
| Success codes        | 200
| Error codes          | 401, 403, 500

***

###DELETE api/users/{userId}
Removes user.

####Resoure Information
|                      |
|----------------------|-----------------
| URL                  | *api/users/{userId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Require roles        | *admin, owner*
| Success codes        | 200
| Error codes          | 401, 403, 500

####Parameters
| Name     | Type       | Required | Description
|----------|------------|----------|-----------  
| userId   | `String`   | true     | User's id.    
