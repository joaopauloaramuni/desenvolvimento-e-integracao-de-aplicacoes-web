// Regra de negócio do ContributorStats (equivalente ao pacote core do Python).
// Este módulo não depende de React: pode ser reaproveitado em outra interface.
export {
  ContributorStatsError,
  GitHubAPIError,
  InvalidRepoURLError,
  OperationCancelledError,
  StatsNotReadyError,
} from "./exceptions";
export { CSV_FIELDS, buildCsv, defaultCsvFilename, exportToCsv } from "./exporter";
export {
  AnalysisResult,
  Contributor,
  daysBetween,
  formatDateBR,
  formatDays,
  progressEvent,
  todayISO,
} from "./models";
export {
  SORT_CRITERIA,
  SortCriterion,
  buildContributors,
  buildContributorsFromCommits,
  rankContributors,
} from "./ranking";
export {
  FILE_TYPE_METRICS,
  aggregateFileTypes,
  buildFileTypeCsv,
  buildGroupFileTypeCsv,
  classifyFile,
  defaultFileTypeCsvFilename,
  defaultGroupFileTypeCsvFilename,
  describeShares,
  describeTypeOwners,
  exportFileTypesToCsv,
  exportGroupFileTypesToCsv,
  groupFileTypes,
} from "./fileTypes";
export {
  WEEKDAYS,
  balanceLabel,
  buildProductivityCsv,
  classifyMessage,
  computeProductivity,
  defaultProductivityCsvFilename,
  exportProductivityToCsv,
  gini,
  parseMembers,
} from "./productivity";
export { parseRepoUrl } from "./repoUrl";
export { analyzeFileTypes, analyzeRepository } from "./service";
