import {User} from '../Models/index.js';
import nodemailer from "nodemailer";
import process from "process";
import CryptoJS from "crypto-js";

let user_routes = {};

user_routes.get_standard_message = async (req, res) => {
    try {
        return res.status(200).json({ message: "Welcome!" });
    } catch (error) {
        return res.status(400).json({});
    }
};

user_routes.create_user= async (req, res) => {
    try {
        let new_user = req.body.user
        new_user.password = CryptoJS.AES.decrypt(new_user.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')
        await User.create(new_user)

        return res.status(200).json({ new_user: new_user });
    } catch (error) {
        console.log({error})
        return res.status(400).json({message: "Login/Email já utilizado."});
    }
};

user_routes.get_user = async (req, res) => {
    try {
        const user = await User.findOne({_id: req.query.Id});
        return res.status(200).json({ user: user });
    } catch (error) {
        return res.status(400).json({error});
    }
};

user_routes.get_user_by_login = async (req, res) => {
    try {
        const user = await User.findOne({login: req.query.login});
        return res.status(200).json({ user: user });
    } catch (error) {
        return res.status(400).json({error});
    }
};

user_routes.get_user_by_email = async (req, res) => {
    try {
        const user = await User.findOne({email: req.query.email});
        return res.status(200).json({ user: user });
    } catch (error) {
        return res.status(400).json({error});
    }
};

user_routes.send_pwd= async (req, res) => {
    try {
        // acessar isso com o email do gaveta https://myaccount.google.com/apppasswords
        const user = await User.findOne({email: req.query.email});
        const transport = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAILPWD
            },
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: req.query.email,
            subject: 'Recuperação de senha - Gaveta Criativa',
            html: "<div>" +
                "<h2>Olá!</h2>" +
                `<p>Foram solicidados os dados da conta <strong>${user.login}</strong></p>.` +
                `<p>Login: ${user.login}</p>` +
                `<p>Senha: ${user.password}</p>` +
                `<p>Obrigado por utilizar o site da Gaveta Criativa!</p>` +
                " </div>"
        };

        const result = await transport.sendMail(mailOptions);
        res.status(200).json({result, message: "Enviado com sucesso!"});
    } catch (error) {
        console.log({error})
        return res.status(400).json({error});
    }
};

user_routes.login_user = async (req, res) => {
    try {
        const user = await User.findOne({login: req.body.user.login, password: CryptoJS.AES.decrypt(req.body.user.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')});
        return res.status(200).json({ user: {login: user.login, isAdmin: user.isAdmin, _id: user._id, email: user.email} });
    } catch (error) {
        return res.status(400).json({error});
    }
};


user_routes.get_users = async (req, res) => {
    try {
        const users = await User.find();
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(400).json({error});
    }
};

user_routes.put_user = async (req, res) => {
    try {
        let userId = req.query.userId
        let user = await User.findOne({_id: userId})
        let bodyUser = req.body.user
        // let { login, password, isAdmin } = req.body.user
        bodyUser.password = CryptoJS.AES.decrypt(bodyUser.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')
        if(user){
            let new_user = await User.findByIdAndUpdate(user._id, bodyUser, { new: true})
            return res.status(200).json({ user: new_user });
        }else{
                return res.status(400).json({message: 'User not found'});
        }

    } catch (error) {
        return res.status(400).json({error});
    }
};

user_routes.delete_user = async (req, res) => {
    try {
        await User.findByIdAndRemove({_id: req.query.userId})
        return res.status(200).json({ message: 'User deleted successfully!' });
    } catch (error) {
        return res.status(400).json({});
    }
};

export { user_routes };
