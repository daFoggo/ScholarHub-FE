export interface IScholarshipSearchInputProps {
  value: string;
  setValue: (value: string) => void;
  activeFilters: any[];
  removeFilter: (key: SEARCH_KEYS, value: string) => void;
  clearAllFilters: () => void;
  isAuthenticated: boolean;
}

export interface IScholarship {
  id: string;
  title: string;
  provider: string;
  type?: string;
  funding_level?: string;
  degree_level?: string;
  region?: string;
  country?: string;
  major?: string;
  deadline?: string;
  description?: string;
  original_url?: string;
  posted_at?: string;

  education_criteria?: string;
  personal_criteria?: string;
  experience_criteria?: string;
  research_criteria?: string;
  certification_criteria?: string;
  achievement_criteria?: string;

  weights?: Record<string, string>;
}

export type IScholarshipWeightCriteria =
  | "education_criteria"
  | "personal_criteria"
  | "experience_criteria"
  | "research_criteria"
  | "certification_criteria"
  | "achievement_criteria";

export enum ScholarshipWeightCriteria {
  EDUCATION_CRITERIA = "education_criteria",
  PERSONAL_CRITERIA = "personal_criteria",
  EXPERIENCE_CRITERIA = "experience_criteria",
  RESEARCH_CRITERIA = "research_criteria",
  CERTIFICATION_CRITERIA = "certification_criteria",
  ACHIEVEMENT_CRITERIA = "achievement_criteria",
}
