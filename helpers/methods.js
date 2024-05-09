const bcrypt = require('bcrypt');

const findOne = async (db, collection, query) => {

    const result = await db.collection(collection).findOne(query)
    return result;

}

const insertOne = async (db, collection, query) => {

    const result = await db.collection(collection).insertOne(query);
    return result;

}

const bcryptHash = async (password) => {

    const hash = await bcrypt.hash(password, 10);
    return hash;

}

const bcryptCompare = async (password, hash) => {

    const result = await bcrypt.compare(password, hash);
    return result;

}

module.exports = {
    findOne,
    insertOne,
    bcryptHash,
    bcryptCompare
};
