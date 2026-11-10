export type AcademicLevel = 'Undergraduate' | 'Masters' | 'PhD';

export interface ResearchPlan {
  id: string;
  topic: string;
  level: AcademicLevel;
  focusDetails?: string;
  reasoningSteps: string;
  finalAnswer: string;
  rawText: string;
  generatedAt: string;
}

export interface PlanGenerationRequest {
  topic: string;
  level: AcademicLevel;
  focusDetails?: string;
}
