import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true,
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    users:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    fileTree:{
        type:Object,
        default:{}
    }
})

projectSchema.index({ name: 1}, { unique: true });

const ProjectModel = mongoose.models.Project || mongoose.model("Project", projectSchema);
export default ProjectModel;