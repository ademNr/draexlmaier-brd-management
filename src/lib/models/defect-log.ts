import { InferSchemaType, Model, Schema, Types, model, models } from "mongoose";

const DefectLogSchema = new Schema(
    {
        brdId: { type: Types.ObjectId, ref: "Brd", required: true, index: true },
        kskNumber: { type: String, required: true, trim: true, index: true },
        section: { type: Number, required: true, min: 1, max: 6, index: true },
        defects: [{ type: String, required: true }],
        agentName: { type: String, trim: true },
        role: {
            type: String,
            enum: ["agent", "chef", "manager", "admin"],
            default: "agent",
        },
        line: { type: String, trim: true },
        shift: { type: String, trim: true },
        status: {
            type: String,
            enum: ["ouvert", "traite", "cloture"],
            default: "ouvert",
        },
        comment: { type: String, trim: true },
    },
    { timestamps: true }
);

export type DefectLogDocument = InferSchemaType<typeof DefectLogSchema> & {
    _id: string;
};

const DefectLogModel =
    (models.DefectLog as Model<DefectLogDocument>) || model<DefectLogDocument>("DefectLog", DefectLogSchema);

export default DefectLogModel;

