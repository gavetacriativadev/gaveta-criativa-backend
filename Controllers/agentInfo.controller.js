import { AgentInfo, Project } from '../Models/index.js'
import nodemailer from "nodemailer";
import process from "process";
import CryptoJS from "crypto-js";
import {v2 as cloudinary} from 'cloudinary';


let agentInfo_routes = {}

agentInfo_routes.get_standard_message = async (req, res) => {
  try {
    return res.status(200).json({ message: 'Welcome!' })
  } catch (error) {
    return res.status(400).json({})
  }
}

agentInfo_routes.create_agentInfo = async (req, res) => {
  try {
    let new_agentInfo = req.body.agentInfo
    new_agentInfo.password = CryptoJS.AES.decrypt(new_agentInfo.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')
    let checkAgent = await AgentInfo.findOne({email: new_agentInfo.email})
    if(checkAgent) {
      return res.status(400).json("Email já cadastrado!")
    } else {
      await AgentInfo.create(new_agentInfo)
      return res.status(200).json({ new_agentInfo: new_agentInfo })
    }

  } catch (error) {
    console.log({error})
    return res.status(400).json({ error })
  }
}

agentInfo_routes.get_agentInfo = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const agentInfo = await AgentInfo.findOne({ _id: req.query.Id })
    if(agentInfo.portfolio) {
      const result = await cloudinary.api.resource(agentInfo.portfolio)
      agentInfo.portfolio = result.secure_url
    }

    return res.status(200).json({ agentInfo: agentInfo })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

agentInfo_routes.get_approved_agents = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const agents = await AgentInfo.find({ approved: true })
    for(const agentInfo of agents) {
      if(agentInfo.portfolio) {
        const result = await cloudinary.api.resource(agentInfo.portfolio)
        agentInfo.portfolio = result.secure_url
      }
    }
    return res.status(200).json({ agents })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

agentInfo_routes.get_agentInfo_by_email = async (req, res) => {
  try {
    const agentInfo = await AgentInfo.find({ email: req.query.email })
    return res.status(200).json({ agentInfo: agentInfo })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

agentInfo_routes.get_agentInfos = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const agentInfos = await AgentInfo.find({ approved: false, reprovedReason: '' })

    for(const agentInfo of agentInfos) {
      if(agentInfo.portfolio) {
        const result = await cloudinary.api.resource(agentInfo.portfolio)
        agentInfo.portfolio = result.secure_url
      }
    }
    return res.status(200).json({ agentInfos })
  } catch (error) {
    return res.status(400).json({ error })
  }
}

agentInfo_routes.put_agentInfo = async (req, res) => {
  try {
    let agentInfoId = req.query.agentInfoId
    let agentInfo = await AgentInfo.findOne({ _id: agentInfoId })
    // console.log({agentInfoId, agentInfo})
    // let { login, password, isAdmin } = req.body.agentInfo
    let bodyAgentInfo = req.body.agentInfo
    if(bodyAgentInfo.password) {
      bodyAgentInfo.password = CryptoJS.AES.decrypt(bodyAgentInfo.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')
    }
    if (agentInfo) {
      let new_agentInfo = await AgentInfo.findByIdAndUpdate(agentInfo._id, bodyAgentInfo, { new: true })
      return res.status(200).json({ agentInfo: new_agentInfo })
    } else {
      return res.status(400).json({ message: 'Agent not found' })
    }

  } catch (error) {
    console.log({error})
    return res.status(400).json({ error })
  }
}

agentInfo_routes.delete_agentInfo = async (req, res) => {
  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    const agentInfo = await AgentInfo.findOne({ _id: req.query.agentInfoId })
    if(agentInfo.portfolio) {
      const result = await cloudinary.api.delete_resources(agentInfo.portfolio)
      console.log({result})
    }
    await AgentInfo.findByIdAndRemove({ _id: req.query.agentInfoId })
    await Project.deleteMany({ agentId: req.query.agentInfoId })
    return res.status(200).json({ message: 'Agent deleted successfully!' })
  } catch (error) {
    return res.status(400).json({})
  }
}

agentInfo_routes.send_pwd= async (req, res) => {
  try {
    // acessar isso com o email do gaveta https://myaccount.google.com/apppasswords
    const agentInfo = await AgentInfo.findOne({email: req.query.email});
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
        `<p>Foram solicidados os dados da conta <strong>${agentInfo.email}</strong></p>.` +
        `<p>Login: ${agentInfo.email}</p>` +
        `<p>Senha: ${agentInfo.password}</p>` +
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

agentInfo_routes.login_user = async (req, res) => {
  try {
    const agentInfo = await AgentInfo.findOne({email: req.body.agentInfo.email, password: CryptoJS.AES.decrypt(req.body.agentInfo.password, process.env.SECRET).toString(CryptoJS.enc.Utf8).replace(/['"]+/g, '')});
    return res.status(200).json({ agentInfo: {isAdmin: agentInfo.isAdmin, _id: agentInfo._id, email: agentInfo.email} });
  } catch (error) {
    return res.status(400).json({error});
  }
};

export { agentInfo_routes }
