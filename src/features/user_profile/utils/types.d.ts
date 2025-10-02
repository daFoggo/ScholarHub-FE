import type { IUser } from "@/types/User";
import {
  CERTIFICATION_TYPE,
  DOCUMENT_TYPE,
  EDUCATION_TYPE,
  EXPERIENCE_TYPE,
  GENDER_TYPE,
  PUBLICATION_TYPE,
  REFERENCE_TYPE,
} from "./constants";

export interface IUserProfile {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: GENDER_TYPE;
  job_title?: string;
  contact_email?: string;
  date_of_birth?: string;
  nationality?: string;
  country_of_residence?: string;
  self_introduction?: string;
  educations?: IEducation[];
  experiences?: IExperience[];
  achievements?: IAchievement[];
  certifications?: ICertification[];
  publications?: IPublication[];
  documents?: IDocument[];
  references?: IReference[];
}

export interface IPersonalInfo
  extends Omit<
    IUserProfile,
    | "educations"
    | "experiences"
    | "achievements"
    | "certifications"
    | "publications"
    | "documents"
    | "references"
  > {}

export interface IEducation {
  id: string;
  type: EDUCATION_TYPE;
  current_study_year?: number;
  graduation_year?: number;
  institution?: string;
  major?: string;
  degree_type?: string;
  gpa?: number;
}

export interface IExperience {
  id: string;
  type: EXPERIENCE_TYPE;
  title?: string;
  organization?: string;
  location?: string;
  start_date?: string;
  end_date?: string;
  is_ongoing?: boolean;
  description?: string;
}

export interface IAchievement {
  id: string;
  title?: string;
  issuer?: string;
  image_path?: string;
  url?: string;
  award_date?: string;
  description?: string;
}

export interface ICertification {
  id: string;
  name?: string;
  type: CERTIFICATION_TYPE;
  provider?: string;
  certification_date?: string;
  expiry_date?: string;
  image_path?: string;
  url?: string;
}

export interface IPublication {
  id: string;
  title?: string;
  type: PUBLICATION_TYPE;
  venue_name?: string;
  publish_date?: string;
  url?: string;
}

export interface IDocument {
  id: string;
  type: DOCUMENT_TYPE;
  file_name?: string;
  file_path?: string;
  uploaded_at?: string;
}

export interface IReference {
  id: string;
  name: string;
  type: REFERENCE_TYPE;
  job_title?: string;
  organization?: string;
  relationship?: string;
  email?: string;
}

export interface IProfileHeaderProps {
  userData?: IUser;
  isCurrentUser?: boolean;
  userId: string;
  followers?: number;
  following?: number;
  createdAt?: string;
}

export interface IDocumentsSectionProps {
  documents?: IDocument[];
  isCurrentUser?: boolean;
}

export interface IPersonalInfoSectionProps {
  personalInfo?: IPersonalInfo;
  isCurrentUser?: boolean;
}

export interface IEducationSectionProps {
  educationInfo?: IEducation[];
  isCurrentUser?: boolean;
}

export interface IExperiencesSectionProps {
  experiences?: IExperience[];
  isCurrentUser?: boolean;
}

export interface IAchievementsSectionProps {
  achievements?: IAchievement[];
  isCurrentUser?: boolean;
}

export interface ICertificationsSectionProps {
  certifications?: ICertification[];
  isCurrentUser?: boolean;
}

export interface IPublicationsSectionProps {
  publications?: IPublication[];
  isCurrentUser?: boolean;
}

export interface IReferencesSectionProps {
  references?: IReference[];
  isCurrentUser?: boolean;
}
