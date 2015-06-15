###GET api/auth/token
Refresh Access token.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/auth/token*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `{ token: {String} }`  
| Require autorization | **yes**
| Success codes        | 200
| Error codes          | 401

***

###POST api/auth/signin
Sign In User.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/auth/signin*
| Method               | *POST*
| Response formats     | *JSON*                 
| Response data        | `{ token: {String}, user: {UserModel} }`  
| Require autorization | *no*
| Success codes        | 200
| Error codes          | 401, 500

***

###POST api/auth/signup
Register new user.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/auth/signup*
| Method               | *POST*
| Response formats     | *JSON*                 
| Response data        | `{ name: {String}, password: {String}, email: {String} }` 
| Response formats     | *JSON*                 
| Response data        | `{ token: {String}, user: {UserModel} }`  
| Require autorization | *no*
| Success codes        | 200
| Error codes          | 401, 409, 500

***