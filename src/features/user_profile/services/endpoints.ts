export const USER_PROFILE_ENDPOINTS = {
  DEFAULT: `/user`,
  PERSONAL: `/user/personal`,
  EDUCATION: `/user/education`,
  EXPERIENCE: `/user/experience`,
  ACHIEVEMENT: `/user/achievement`,
  CERTIFICATION: `/user/certification`,
  PUBLICATION: `/user/publication`,
  REFERENCE: `/user/reference`,
  DOCUMENT: `/user/document`,

  PROFILE_STATS: (userId: string) => `/user/profile/${userId}/stats`, 
  PROFILE_MEDIA: (mediaType: "avatar" | "banner") => `/user/profile-media/${mediaType}`,
};
