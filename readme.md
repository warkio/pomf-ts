# Warkio POMF-TS
Typescript POMF clone

## Install & run
- Clone and config
```sh
git clone https://wark.io/pomf-ts && cd pomf-ts
cp config/development.example.ts config/development.ts
cp config/development.example.ts config/production.ts
tsc
```
Change the desired configuration. Here you can specify if you want to allow anonymous uploads and/or allow user resgistration.

- Migrations
```sh
cd migrations
node run_migrations.js
```

- Run the server
```sh
node dist/index.js
```

## General information
The upload route is `/upload`. Response structure is the following:
- For success response
```js
{
    "success": true,
    "files": [
        {
            "name": "filename.jpg",
            "originalName": "the_original_filename.jpg",
            "url": "https://nyanpassu.ayaya/filename.jpg",
            "hash": "hash-here",
            "size": 55555
        }
    ]
}
```
- For error
```js
{
    "success": false,
    "errorcode": 500, //or other error code
    "description": "Error description here"
}
```