const fs = require('fs');
require('colors');
const Product = require('../../models/productModels');
const DBconnection = require("../../config/connectDB");
const dotenv = require("dotenv");
dotenv.config({ path: '../../config.env' });

//connectDB
DBconnection();

const products = JSON.parse(fs.readFileSync('./products.json'));

const insert = async () => {
    try {
        await Product.create(products);
        console.log(`DataBase Insert`.green.inverse);
        process.exit();
        
    } catch (error) {
        console.log(error);
        
    }
};
const destroyData = async () => {
    try {
        await Product.deleteMany();
        console.log(`DataBase Destroyer`.red.inverse);
        process.exit();

    } catch (error) {
        console.log(error);
    }
};

if (process.argv[2] === '-i') {
    insert();
} else if (process.argv[2] === '-d') {
    destroyData()
}