export type Pagination = {
  currentPage: number;
  firstPage: number;
  lastPage: number;
};

export type JobListing = {
  job_title: string;
  description: string;
  company: string;
  id: number;
};

export type JobListingResponse = {
  pagination?: Pagination;
  data: JobListing[];
};

export type SearchQuery = {
  jobTitle: string;
};

export type JobSearchPayload = {
  searchQuery: SearchQuery;
  jobIds: number[];
};

export type JobPosting = {
  job_title: string;
  description: string;
  company: string;
  id: number;
};
