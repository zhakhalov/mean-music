#Schemas

##User

| Field       | Type            | Rules     | Default     | Prevent update  | Description
|-------------|-----------------|-----------|-------------|-----------------|-----------
| _id         | `ObjectId`      |           |             | **yes**         | Mongo _id. 
| name        | `String`        |           |             |                 | Displayed name for users registered via sign up.
| email       | `String`        |           |             | **yes**         | User's email for users registered via sign up.
| password    | `String`        |           |             | **yes**         | Hashsed password for users registered via sign up. 
| avatar      | `String`        |           |             |                 | User's avatar url.
| about       | `String`        |           |             |                 | Short information about user.
| roles       | `Array`         |           | `['user']`  | **yes**         | Autorization roles
| googleId    | `String`        |           |             |                 | Facebook Oauth profile.id
| facebookId  | `String`        |           |             |                 | User's avatar url.
| createdAt   | `Date`          |           | `Date.now`  |                 | Creation date.   
| updatedAt   | `Date`          |           | `Date.now`  |                 | Last update date.

***

##Genre

| Field             | Type            | Rules             | Reference | Default     | Prevent update  | Description
|-------------------|-----------------|-------------------|-----------|-------------|-----------------|-----------
| _id               | `ObjectId`      |                   |           |             | **yes**         | Mongo _id.  
| name              | `String`        | required, unique  |           |             |                 | Name of genre. 
| desc              | `String`        |                   |           |             |                 | Description of genre. 
| img               | `String`        |                   |           |             |                 | Url to image.
| raters            | `[VoteSchema]`  |                   |           |             |                 | Raters.
| rating            | `Number`        | min=0, max=10     |           | 0           | **yes**         | Rating.  
| createdBy         | `Object`        | required          |           |             | **yes**         | User which created Genre.
| createdBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| createdBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| updatedBy         | `Object`        | required          |           |             | **yes**         | User which modefied Genre last.
| updatedBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| updatedBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| createdAt         | `Date`          |                   |           | `Date.now`  |                 | Creation date.   
| updatedAt         | `Date`          |                   |           | `Date.now`  |                 | Last update date.

***

##Artist

| Field             | Type            | Rules             | Reference | Default     | Prevent update  | Description
|-------------------|-----------------|-------------------|-----------|-------------|-----------------|-----------
| _id               | `ObjectId`      |                   |           |             | **yes**         | Mongo _id.
| name              | `String`        | required, unique  |           |             |                 | URL of an image on artist's page.
| desc              | `String`        |                   |           |             |                 | About artist.
| genres            | `[String]`      |                   |           |             |                 | Genres.
| tags              | `[String]`      |                   |           |             |                 | Tags.
| img               | `String`        |                   |           |             |                 | Raters. 
| raters            | `[VoteSchema]`  |                   |           |             |                 | Rating. 
| rating            | `Number`        | min=0, max=10     |           | 0           | **yes**         | Creation date.   
| createdBy         | `Object`        | required          |           |             | **yes**         | User which created Artist.
| createdBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| createdBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| updatedBy         | `Object`        | required          |           |             | **yes**         | User which modefied Artist last.
| updatedBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| updatedBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| createdAt         | `Date`          |                   |           | `Date.now`  |                 | Creation date.   
| updatedAt         | `Date`          |                   |           | `Date.now`  |                 | Last update date.

***

##Album

| Field             | Type            | Rules             | Reference | Default     | Prevent update  | Description
|-------------------|-----------------|-------------------|-----------|-------------|-----------------|-----------
| _id               | `ObjectId`      |                   |           |             | **yes**         | Mongo _id.
| name              | `String`        |                   |           |             |                 | URL of an image on Album's page.
| desc              | `String`        |                   |           |             |                 | About Album.
| artists           | `[ObjectId]`    |                   | *Artist*  |             |                 | Artist.
| genres            | `[String]`      |                   |           |             |                 | Genres.
| tags              | `[String]`      |                   |           |             |                 | Tags.
| img               | `String`        |                   |           |             |                 | Raters. 
| raters            | `[VoteSchema]`  |                   |           |             |                 | Rating. 
| rating            | `Number`        | min=0, max=10     |           | 0           | **yes**         | Creation date.   
| createdBy         | `Object`        | required          |           |             | **yes**         | User which created Album.
| createdBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| createdBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| updatedBy         | `Object`        | required          |           |             | **yes**         | User which modefied Album last.
| updatedBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| updatedBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| createdAt         | `Date`          |                   |           | `Date.now`  |                 | Creation date.   
| updatedAt         | `Date`          |                   |           | `Date.now`  |                 | Last update date.

***

##Song

| Field             | Type            | Rules             | Reference | Default     | Prevent update  | Description
|-------------------|-----------------|-------------------|-----------|-------------|-----------------|-----------
| _id               | `ObjectId`      |                   |           |             | **yes**         | Mongo _id.
| path              | `String`        | required, unique  |           |             |                 | Path to audio file at Dropbox.
| name              | `String`        |                   |           |             |                 | URL of an image on Album's page.
| duration          | `Number`        | min=0             |           | 0           |                 | Song duration.
| img               | `String`        |                   |           |             |                 | Raters. 
| desc              | `String`        |                   |           |             |                 | About Song.
| artists           | `[ObjectId]`    |                   | *Artist*  |             |                 | Artists.
| albums            | `[ObjectId]`    |                   | *Album*   |             |                 | Albums.
| genres            | `[String]`      |                   |           |             |                 | Genres.
| tags              | `[String]`      |                   |           |             |                 | Tags.
| raters            | `[VoteSchema]`  |                   |           |             |                 | Rating. 
| rating            | `Number`        | min=0, max=10     |           | 0           | **yes**         | Creation date.   
| listened          | `Number`        | min=0             |           | 0           | **yes**         | How many times song was listened.
| createdBy         | `Object`        | required          |           |             | **yes**         | User which created Song.
| createdBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| createdBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| updatedBy         | `Object`        | required          |           |             | **yes**         | User which modefied Album last.
| updatedBy.name    | `String`        | required          |           |             | **yes**         | Name of user.
| updatedBy.userId  | `ObjectId`      | required          | *User*    |             | **yes**         | UserId.
| createdAt         | `Date`          |                   |           | `Date.now`  |                 | Creation date.   
| updatedAt         | `Date`          |                   |           | `Date.now`  |                 | Last update date.

***

##Vote

| Field     | Type          | Rules                   | Reference | Default     | Prevent update  |Description
|-----------|---------------|-------------------------|-----------|-------------|-----------------|-----------
| id        |`ObjectId`     |                         |           |             | **yes**         | Mongo _id..  
| userId    |`ObjectId`     |required                 | *User*    |             |                 | Voter ID.  
| rate      |`Number`       |required, min=0, max=10  |           |             |                 | Rate value
| votedAt   |`Date`         |                         |           |`Date.now`   |                 | Vote date.  