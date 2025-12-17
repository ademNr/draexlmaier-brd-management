import { InferSchemaType, Model, Schema, model, models } from "mongoose";

const BrdSchema = new Schema(
    {
        bbNumber: { type: String, required: true, unique: true, trim: true },
        description: { type: String, trim: true },
        status: {
            type: String,
            enum: ["ouverte", "en cours", "cloturee"],
            default: "ouverte",
        },
        createdBy: { type: String, trim: true },
        active: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export type BrdDocument = InferSchemaType<typeof BrdSchema> & {
    _id: string;
};

const BrdModel = (models.Brd as Model<BrdDocument>) || model<BrdDocument>("Brd", BrdSchema);
export default BrdModel;

