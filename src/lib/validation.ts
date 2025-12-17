import { z } from "zod";
import { DEFECT_TYPES } from "./constants";

export const brdSchema = z.object({
    bbNumber: z.string().min(1, "BB obligatoire").toUpperCase(),
    description: z.string().optional(),
    createdBy: z.string().optional(),
});

export const defectLogSchema = z.object({
    brdId: z.string().min(1, "BRD requis"),
    kskNumber: z.string().min(1, "KSK requis"),
    section: z.number().int().min(1).max(6),
    defects: z
        .array(z.string().refine((value) => DEFECT_TYPES.includes(value), "Type de défaut non reconnu"))
        .nonempty("Au moins un défaut"),
    agentName: z.string().min(1, "Agent requis"),
    role: z.enum(["agent", "chef", "manager", "admin"]).default("agent"),
    line: z.string().optional(),
    shift: z.string().optional(),
    comment: z.string().optional(),
});

export type BrdPayload = z.infer<typeof brdSchema>;
export type DefectPayload = z.infer<typeof defectLogSchema>;

