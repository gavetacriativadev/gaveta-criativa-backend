import pkg from 'mongoose';
const { model, Schema } = pkg;

const user = new Schema(
    {
        login: {type: String, required: true, unique : true, dropDups: true },
        email: {type: String, required: true, unique : true, dropDups: true },
        password: {type: String, required: true},
        isAdmin: {type: Boolean, required: true, default: false}
    }
);

const User = model('User', user, 'User');

export { User };
