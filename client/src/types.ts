export type CaseStatus = 'In Progress' | 'Under Review' | 'Completed' | 'Delayed' | 'At Risk' | 'Compensation Pending';
export type Risk = 'Low' | 'Medium' | 'High';

export interface Project { id: string; projectId: string; name: string; department: string; type: string; state: string; district: string; status: string; progress: number; cases: number; targetDate: string; description: string; coordinates: [number, number][]; }
export interface Case { id: string; caseId: string; projectId: string; projectName: string; parcelId: string; state: string; district: string; tehsil: string; village: string; surveyNumber: string; area: number; requiredArea: number; status: CaseStatus; risk: Risk; stage: string; progress: number; officer: string; dueDate: string; externalRefs: { system: string; id: string }[]; coordinates: [number, number][]; }
export interface WorkflowStage { id: string; name: string; status: 'COMPLETED' | 'CURRENT' | 'UPCOMING' | 'BLOCKED'; owner: string; dueDate?: string; }
export interface TimelineEvent { id: string; date: string; time: string; action: string; actor: string; detail: string; tone: 'blue' | 'green' | 'amber' | 'red'; }
export interface DocumentVersion { version: number; fileName: string; uploadedAt: string; uploadedBy: string; size: string; checksum: string; change: string; status: string; }
export interface DocumentRecord { id: string; name: string; type: string; owner: string; updated: string; size: string; latest: number; versions: DocumentVersion[]; }

