###GET api/artists?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}
Provides Array of Artists.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/artists?query={query}&select={select}&sort={sort}&skip={skip}&limit={limit}*
| Method               | *GET*
| Response formats     | *JSON*                 
| Response data        | `[{ArtistModel}]`  
| Require autorization | *false*
| Success codes        | 200
| Error codes          | 404, 500

####Parameters
| Name        | Type       | Required | Default                       | Description
|-------------|------------|----------|-------------------------------|------------  
| query       | `Object`   | false    | *{}*                          | MongoDB query.        
| select      | `String`   | false    | *_id name img rating genres*  | Select frields.      
| sort        | `String`   | false    | *name*                        | Sort by fields.       
| skip        | `Number`   | false    | *0*                           | Skip documents.
| limit       | `Number`   | false    | *10*                          | Limit select count of documents.

***

###POST api/artists
Create new Artist DataBase.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/artists*
| Method                | *POST*
| Request formats       | *JSON*                 
| Request data          | `{ArtistModel}`  
| Response formats      | *JSON*                 
| Response data         | `{ArtistModel}`  
| Require autorization  | **yes**
| Success codes         | 200
| Error codes           | 500

***

###GET api/artists/{artistId}
Provides Artist instance by _id.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/artists/{artistId}*
| Method                | *GET*
| Response formats      | *JSON*                 
| Response data         | `{ArtistModel}`  
| Require autorization  | *false*
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| artistId   | `String`   | true     | Id of Artist.      

***

###PUT api/artists/{artistId}
Update artist instance.

####Resoure Information
|                       |                    |
|-----------------------|-----------------
| URL                   | *api/artists/{artistId}*
| Method                | *PUT*
| Request formats       | *JSON*                 
| Request data          | `{ArtistModel}` 
| Response formats      | *JSON*                 
| Response data         | `{ArtistModel}`  
| Require autorization  | *false*
| Success codes         | 200
| Error codes           | 404, 500

####Parameters
| Name       | Type       | Required | Description
|------------|------------|----------|------------  
| artistId   | `String`   | true     | Id of Artist       

***

###DELETE api/artists/{artistId}
Removes artist. Return **_id** of removed document if succes.

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/artists/{artistId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `String`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| artistId  | `String`   | true     | Id of Artist     

***

###POST api/artists/{artistId}/rate/{rate}
Rate artists. Rate range: 0..10

####Resoure Information
|                      |                    |
|----------------------|-----------------
| URL                  | *api/artists/{artistId}*
| Method               | *DELETE*
| Require autorization | **yes**
| Response data        | `{ rating: {Number} }`  
| Success codes        | 200
| Error codes          | 401, 500

####Parameters
| Name      | Type       | Required | Description
|-----------|------------|----------|-----------  
| artistId  | `String`   | true     | Id of Artist
| rate      | `Number`   | true     | Rate
