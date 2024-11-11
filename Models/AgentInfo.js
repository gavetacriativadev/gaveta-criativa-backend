import pkg from 'mongoose';
const { model, Schema } = pkg;

const agentInfo = new Schema(
  {
    pfp: { type: String, required: false },
    name: { type: String, required: false },
    description: { type: String, required: false },
    city: { type: String, required: false },
    state: { type: String, required: false },
    address: { type: String, required: false },
    complement: { type: String, required: false },
    zipCode: { type: String, required: false },
    gallery: { type: String, required: false },
    email: { type: String, required: true, unique : true, dropDups: true },
    phone: { type: String, required: false },
    portfolio: { type: String, required: false },
    instagram: { type: String, required: false },
    approved: { type: Boolean, required: true, default: false },
    reprovedReason: { type: String, required: false, default: '' },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    category: { type: String, required: false },
    cpf: { type: String, required: false },
    inGroup: { type: Boolean, required: false },
    hidePhone: { type: Boolean, required: false },
    groupName: { type: String, required: false },
    dateOfBirth: { type: String, required: false },
    education: { type: String, required: false },
  },
)

const AgentInfo = model('AgentInfo', agentInfo, 'AgentInfo')

export { AgentInfo }
