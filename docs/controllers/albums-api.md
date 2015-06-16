###GET api/albums?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}
Provides Array of Artists.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/albums?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}*
| Method               | *GET*
| Response formats     | *application/json*                 
| Response data        | `[{AlbumModel}]`  
| Require autorization | *no*
| Success codes        | 200
| Error codes          | 404, 500

####Parameters
| Name        | Type       | Required | Default                                         | Description
|-------------|------------|----------|-------------------------------------------------|------------  
| query       | `Object`   | false    | *{}*                                            | MongoDB query.        
| select      | `String`   | false    | *_id name img rating artists genres release*    | Select frields.      
| sort        | `String`   | false    | *-release*                                      | Sort by fields.       
| skip        | `Number`   | false    | *0*                                             | Skip documents.
| limit       | `Number`   | false    | *10*                                            | Limit select count of documents.

***

###POST api/albums
Create new Artist DataBase.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/albums*
| Method                | *POST*
| Request formats       | *application/json, multipart/form-data*                 
| Request data          | `{AlbumModel}`  
| Response formats      | *application/json*                 
| Response data         | `{AlbumModel}`  
| Require autorization  | **yes**
| Success codes         | 200
| Error codes           | 500

***

###GET api/albums/{albumId}
Provides Album instance by _id.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/albums/{albumId}*
| Method                | *GET*
| Response formats      | *application/json*                 
| Response data         | `{AlbumModel}`  
| Require autorization  | *no*
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name        | Type       | Required | Description
|-------------|------------|----------|------------  
| albumId     | `String`   | true     | Id of Album.      

***

###PUT api/albums/{albumId}
Update Album instance.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/albums/{albumId}*
| Method                | *PUT*
| Request formats       | *application/json, multipart/form-data*                 
| Request data          | `{AlbumModel}` 
| Response formats      | *application/json*                 
| Response data         | `{AlbumModel}`  
| Require autorization  | *no*
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| albumId    | `String`   | true     | Id of Album.       

***

###DELETE api/albums/{albumId}
Removes Album. Return **_id** of removed document if succes.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/albums/{albumId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `String`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| albumId   | `String`   | true     | Id of Album.     

***

###POST api/albums/{albumId}/rate/{rate}
Rate Album. Rate range: 0..10

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/albums/{albumId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `{ rating: {Number} }`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| albumId   | `String`   | true     | Id of Album
| rate      | `Number`   | true     | Rate
