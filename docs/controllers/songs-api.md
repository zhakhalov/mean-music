###GET api/songs?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}
Provides Array of Artists.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/songs?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `[{SongModel}]`  
| Require autorization | *no*
| Success codes        | 200
| Error codes          | 404, 500

####Parameters
| Name        | Type       | Required | Default                                         | Description
|-------------|------------|----------|-------------------------------------------------|------------  
| query       | `Object`   | false    | *{}*                                            | MongoDB query.        
| select      | `String`   | false    | *_id name img rating albums artists duration*    | Select frields.      
| sort        | `String`   | false    | *-rating*                                      | Sort by fields.       
| skip        | `Number`   | false    | *0*                                             | Skip documents.
| limit       | `Number`   | false    | *10*                                            | Limit select count of documents.

***

###POST api/songs
Create new Song document.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/songs*
| Method                | *POST*
| Request formats       | *JSON*                 
| Request data          | `{SongModel}`  
| Response formats      | *JSON*                 
| Response data         | `{SongModel}`  
| Require autorization  | **yes**
| Success codes         | 200
| Error codes           | 500

***

###GET api/songs/{songId}
Get Song document by _id.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/songs/{songId}*
| Method                | *GET*
| Response formats      | *JSON*                 
| Response data         | `{SongModel}`  
| Require autorization  | *no*
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| songId     | `String`   | true     | Id of Album.      

***

###PUT api/songs/{songId}
Update Song document.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/songs/{songId}*
| Method                | *PUT*
| Request formats       | *JSON*                 
| Request data          | `{SongModel}` 
| Response formats      | *JSON*                 
| Response data         | `{SongModel}`  
| Require autorization  | **yes**
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| songId     | `String`   | true     | Id of Album.       

***

###DELETE api/songs/{songId}
Removes Song. Return **_id** of removed document if succes.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/songs/{songId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `{String}`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| songId    | `String`   | true     | Id of Album.     

***

###GET api/songs/{songId}/media
Get stream url. Increment field *listened*.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/songs/{songId}/media*
| Method               | *DELETE*
| Require autorization | *no*
| Response data        | `{ url: {String}, listened: {Number} }`  
| Success codes        | 200
| Error codes          | 404

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| songId    | `String`   | true     | Id of Album

***

###POST api/songs/{songId}/rate/{rate}
Rate Album. Rate range: 0..10

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/songs/{songId}/rate/{rate}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `{ rating: {Number} }`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| songId    | `String`   | true     | Id of Album
| rate      | `Number`   | true     | Rate
