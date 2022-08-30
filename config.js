module.exports = {
    PORT: process.env.PORT || 4000,
    db: {
        DB: "relational-db",
        USER: "root",
        PASSWORD: "",
        options: {
            host: "localhost",
            dialect: "mysql",
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000,
            },
        },
    },
};
