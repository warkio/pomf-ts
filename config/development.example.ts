export = {
    postgres: {
        dbConfig: {
            host: 'localhost',
            port: '5432',
            user: 'user',
            password: 'password',
            database: 'the database',
            min: 20,
            max: 100
        },
        initOptions: {
            error(err:any, e:any) {
                console.log(`Error with query "${e.query}"`);
            }
        }
    },
    serverConfig: {
        allowAnonymous: true,
        registerEnabled: true,
        uploadFolder: 'uploads/',
        uploadUrl: 'https://my-url/'
    }
};
