export interface RecipeEvidence {
  kind:
    | 'fixture'
    | 'earlier'
    | 'synthetic'
    | 'public-dataset'
    | 'human-reviewed'
    | 'mixed'
    | 'unspecified';
  label: string;
  experimental: boolean;
  measurement: {
    model: string;
    date: string | null;
    split: string | null;
    cases: number;
    ready: number | null;
    reviewRate: number | null;
    readyAccuracy: number | null;
    failed: number | null;
    provenance: { method: string; source: string; cases: number }[];
    acceptanceMet: boolean | null;
  } | null;
}
