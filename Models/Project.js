import pkg from 'mongoose';
const { model, Schema } = pkg;

const project = new Schema(
  {
    agentId: { type: String, required: true },
    projectPfp: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    date: { type: String, required: false },
    category: { type: String, required: false },
    accessibility: { type: String, required: false },
    description: { type: String, required: false },
    value: { type: String, required: false },
    links: { type: String, required: false },
    approved: { type: Boolean, required: true, default: false },
    reprovedReason: { type: String, required: false, default: '' },
  },
)

const Project = model('Project', project, 'Project')

export { Project }
