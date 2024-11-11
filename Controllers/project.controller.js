import {Project} from '../Models/index.js';

let project_routes = {};

project_routes.get_standard_message = async (req, res) => {
    try {
        return res.status(200).json({ message: "Welcome!" });
    } catch (error) {
        return res.status(400).json({});
    }
};

project_routes.create_project= async (req, res) => {
    try {
        let new_project = req.body.project
        await Project.create(new_project)

        return res.status(200).json({ new_project: new_project });
    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.get_project = async (req, res) => {
    try {
        const project = await Project.findOne({_id: req.query.Id});
        return res.status(200).json({ project: project });
    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.get_project_by_agent = async (req, res) => {
    try {
        const project = await Project.find({agentId: req.query.agentId});
        return res.status(200).json({ project: project });
    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.get_projects = async (req, res) => {
    try {
        const projects = await Project.find({approved: false, reprovedReason: ""});
        return res.status(200).json({ projects });
    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.get_approved_projects = async (req, res) => {
    try {
        const projects = await Project.find({approved: true});
        return res.status(200).json({ projects });
    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.put_project = async (req, res) => {
    try {
        let projectId = req.query.projectId
        let project = await Project.findOne({_id: projectId})
        // let { login, password, isAdmin } = req.body.project

        if(project){
            let new_project = await Project.findByIdAndUpdate(project._id, req.body.project, { new: true})
            return res.status(200).json({ project: new_project });
        }else{
            return res.status(400).json({message: 'Agent not found'});
        }

    } catch (error) {
        return res.status(400).json({error});
    }
};

project_routes.delete_project = async (req, res) => {
    try {
        await Project.findByIdAndRemove({_id: req.query.projectId})
        return res.status(200).json({ message: 'Agent deleted successfully!' });
    } catch (error) {
        return res.status(400).json({});
    }
};

export { project_routes };
