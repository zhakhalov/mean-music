#Schemas

##User

Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
name        |`String`         |                   |           |             |               |Displayed name for users registered via sign up.
email       |`String`         |                   |           |             |__true__       |User's email for users registered via sign up.
password    |`String`         |                   |           |             |__true__       |Hashsed password for users registered via sign up. 
avatar      |`String`         |                   |           |             |               |User's avatar url.
roles       |`Array`          |                   |           |`['user']`   |__true__       |Autorization roles
googleId    |`String`         |                   |           |             |               |Facebook Oauth profile.id
facebookId  |`String`         |                   |           |             |               |User's avatar url.
createdAt   |`Date`           |                   |           |`Date.now`   |               |Creation date.   
updatedAt   |`Date`           |                   |           |`Date.now`   |               |Last update date.

##Genre

Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
name        |`String`         |required, unique   |           |             |               |Name of genre. 
createdAt   |`Date`           |                   |           |`Date.now`   |               |Creation date.   
updatedAt   |`Date`           |                   |           |`Date.now`   |               |Last update date.

##Artist

Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
name        |`String`         |required, unique   |           |             |               |Name of artist. 
image       |`String`         |required           |           |             |               |URL of image on artist's page.
albums      |`[ObjectId]`     |                   |_Album_    |             |               |Albums.
songs       |`[ObjectId]`     |                   |_Song_     |             |               |Songs.
rating      |`[VoteSchema]`   |                   |           |             |               |Ratings.
createdAt   |`Date`           |                   |           |`Date.now`   |               |Creation date.   
updatedAt   |`Date`           |                   |           |`Date.now`   |               |Last update date.

##Album

Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
name        |`String`         |required           |           |             |               |Album name.
year        |`String`         |                   |           |             |               |Release year.
image       |`String`         |                   |           |             |               |URL of album thumb image.
artists     |`[ObjectId]`     |                   |_Artist_   |             |               |Artists.
songs       |`[ObjectId]`     |                   |_Song_     |             |               |Songs.
rating      |`[VoteSchema]`   |                   |           |             |               |Ratings.
createdAt   |`Date`           |                   |           |`Date.now`   |               |Creation date.   
updatedAt   |`Date`           |                   |           |`Date.now`   |               |Last update date.

##Song
Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
fileId      |`String`         |required           |           |             |__true__       |File id in storage.  
name        |`String`         |required           |           |             |               |Song name.
duration    |`Number`         |required           |           |             |               |Song name.
artists     |`[ObjectId]`     |                   |_Artist_   |             |               |Artist. 
albums      |`[ObjectId]`     |                   |_Album_    |             |               |Album.
rating      |`[VoteSchema]`   |                   |           |             |               |Ratings.
createdAt   |`Date`           |                   |           |`Date.now`   |               |Creation date.   
updatedAt   |`Date`           |                   |           |`Date.now`   |               |Last update date.

##Vote

Field       |Type             |Rules              |Reference  |Default      |Prevent update |Description
------------|-----------------|-------------------|-----------|-------------|---------------|-----------
id          |`ObjectId`       |                   |           |             |__true__       |ID.  
voter       |`ObjectId`       |required           |_User_     |             |               |Voter ID.  
rate        |`Number`         |required, [0..10]  |           |             |               |Rate value
votedAt     |`Date`           |                   |           |`Date.now`   |               |Vote date.  