const  mongoose = require('mongoose');

const dbconnection = () => {
    mongoose
        .connect(process.env.DB_URL)
        .then((conn) => {
            console.log(`DataBase Connected : ${conn.connection.host}`);
        })
        // .catch((err) => {
        //     console.error(`DataBase Error ${err}`)
        //     process.exit(1);
        // })
};
module.exports = dbconnection;
