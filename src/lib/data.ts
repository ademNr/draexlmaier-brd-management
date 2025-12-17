import { Types } from "mongoose";
import { DEFECT_TYPES } from "./constants";
import DefectLogModel, { DefectLogDocument } from "./models/defect-log";
import BrdModel, { BrdDocument } from "./models/brd";
import { connectToDatabase } from "./mongoose";

export type SectionSummary = { id: number; count: number };
export type BrdCard = {
  id: string;
  bbNumber: string;
  status: string;
  description?: string;
  createdAt: string;
  totalDefects: number;
  sections: SectionSummary[];
  ksks: string[];
  lastUpdate?: string;
};

export type BrdDetail = {
  brd: BrdDocument & { _id: string };
  defects: DefectLogDocument[];
  analytics: AnalyticsSummary;
};

export type AnalyticsSummary = {
  defectsByType: { label: string; value: number }[];
  defectsPerSection: { label: string; value: number }[];
  defectsPerShift: { label: string; value: number }[];
  timeSeries: { label: string; value: number }[];
  perSectionType: { section: number; type: string; value: number }[];
  timeSeriesByType: { type: string; points: { label: string; value: number }[] }[];
};

export async function getBrdCards(): Promise<BrdCard[]> {
  await connectToDatabase();

  const brds = await BrdModel.find().sort({ createdAt: -1 }).lean();

  const sectionAgg = await DefectLogModel.aggregate([
    {
      $group: {
        _id: { brdId: "$brdId", section: "$section" },
        count: { $sum: 1 },
        lastUpdate: { $max: "$createdAt" },
      },
    },
  ]);

  const kskAgg = await DefectLogModel.aggregate([
    {
      $group: {
        _id: "$brdId",
        ksks: { $addToSet: "$kskNumber" },
        total: { $sum: 1 },
        lastUpdate: { $max: "$createdAt" },
      },
    },
  ]);

  return brds.map((brd) => {
    const brdId = String(brd._id);
    const sections = sectionAgg
      .filter((item) => String(item._id.brdId) === brdId)
      .map((item) => ({ id: item._id.section as number, count: item.count as number }));

    const kskRow = kskAgg.find((item) => String(item._id) === brdId);

    return {
      id: brdId,
      bbNumber: brd.bbNumber,
      status: brd.status,
      description: brd.description ?? undefined,
      createdAt: brd.createdAt?.toISOString?.() ?? new Date().toISOString(),
      totalDefects: kskRow?.total ?? 0,
      ksks: kskRow?.ksks ?? [],
      sections,
      lastUpdate: kskRow?.lastUpdate?.toISOString?.(),
    };
  });
}

export async function getBrdDetail(brdId: string): Promise<BrdDetail | null> {
  await connectToDatabase();
  const brd = await BrdModel.findById(brdId).lean();
  if (!brd) return null;

  const defects = await DefectLogModel.find({ brdId: new Types.ObjectId(brdId) })
    .sort({ createdAt: -1 })
    .lean();

  const analytics = await getAnalyticsSummary(brdId);

  return {
    brd: { ...brd, _id: String(brd._id) },
    defects: defects.map((d) => ({ ...d, _id: String(d._id), brdId: String(d.brdId) })) as unknown as DefectLogDocument[],
    analytics,
  };
}

type Interval = "hour" | "day" | "week" | "month";

export async function getAnalyticsSummary(brdId?: string, interval: Interval = "hour", days = 30): Promise<AnalyticsSummary> {
  await connectToDatabase();
  const matchStage = brdId ? { brdId: new Types.ObjectId(brdId) } : {};
  const now = new Date();
  const windowStart = new Date(now);
  windowStart.setDate(now.getDate() - days);

  const defectsByType = await DefectLogModel.aggregate([
    { $match: matchStage },
    { $unwind: "$defects" },
    {
      $group: {
        _id: "$defects",
        value: { $sum: 1 },
      },
    },
  ]);

  const defectsPerSection = await DefectLogModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$section",
        value: { $sum: 1 },
      },
    },
  ]);

  const defectsPerShift = await DefectLogModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$shift",
        value: { $sum: 1 },
      },
    },
  ]);

  const formatMap: Record<Interval, string> = {
    hour: "%d/%m %Hh",
    day: "%d/%m",
    week: "%G-S%V",
    month: "%m/%Y",
  };

  const defectsTime = await DefectLogModel.aggregate([
    { $match: { ...matchStage, createdAt: { $gte: windowStart } } },
    {
      $group: {
        _id: {
          $dateToString: { format: formatMap[interval], date: "$createdAt", timezone: "Europe/Paris" },
        },
        value: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const defectsTimeByType = await DefectLogModel.aggregate([
    { $match: { ...matchStage, createdAt: { $gte: windowStart } } },
    { $unwind: "$defects" },
    {
      $group: {
        _id: {
          label: { $dateToString: { format: formatMap[interval], date: "$createdAt", timezone: "Europe/Paris" } },
          type: "$defects",
        },
        value: { $sum: 1 },
      },
    },
    { $sort: { "_id.label": 1 } },
  ]);

  const perSectionType = await DefectLogModel.aggregate([
    { $match: matchStage },
    { $unwind: "$defects" },
    {
      $group: {
        _id: { section: "$section", type: "$defects" },
        value: { $sum: 1 },
      },
    },
    { $sort: { "_id.section": 1 } },
  ]);

  const timeSeriesByType = DEFECT_TYPES.map((type) => ({
    type,
    points: defectsTimeByType
      .filter((d) => d._id.type === type)
      .map((d) => ({ label: d._id.label, value: d.value })),
  }));

  return {
    defectsByType: DEFECT_TYPES.map((type) => ({
      label: type,
      value: defectsByType.find((d) => d._id === type)?.value ?? 0,
    })),
    defectsPerSection: Array.from({ length: 6 }, (_, idx) => {
      const section = idx + 1;
      return {
        label: `Section ${section}`,
        value: defectsPerSection.find((d) => d._id === section)?.value ?? 0,
      };
    }),
    defectsPerShift: defectsPerShift.map((d) => ({
      label: d._id || "Non renseigné",
      value: d.value,
    })),
    timeSeries: defectsTime.map((d) => ({
      label: d._id,
      value: d.value,
    })),
    perSectionType: perSectionType.map((d) => ({
      section: d._id.section,
      type: d._id.type,
      value: d.value,
    })),
    timeSeriesByType,
  };
}

