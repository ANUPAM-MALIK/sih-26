import type { Case, DocumentRecord, Project, TimelineEvent, WorkflowStage } from '../types';

export const projects: Project[] = [
  { id: 'p1', projectId: 'NLP-PB-RLY-014', name: 'Ludhiana–Delhi Freight Corridor', department: 'Ministry of Railways', type: 'Railway', state: 'Punjab', district: 'Ludhiana', status: 'In Progress', progress: 68, cases: 8, targetDate: '30 Nov 2026', description: 'Strategic freight corridor alignment with multi-state parcel acquisition monitoring.', coordinates: [[30.901, 75.857], [31.18, 76.02], [31.52, 76.28]] },
  { id: 'p2', projectId: 'NHAI-MH-EXP-027', name: 'Mumbai–Nagpur Expressway Extension', department: 'Ministry of Road Transport', type: 'Highway', state: 'Maharashtra', district: 'Nashik', status: 'At Risk', progress: 44, cases: 5, targetDate: '15 Oct 2026', description: 'Land coordination layer for the eastern connector package.', coordinates: [[19.997, 73.79], [20.3, 74.1], [20.65, 74.35]] },
  { id: 'p3', projectId: 'CWC-OD-IRR-006', name: 'Mahanadi Basin Irrigation', department: 'Water Resources', type: 'Irrigation', state: 'Odisha', district: 'Cuttack', status: 'In Progress', progress: 72, cases: 4, targetDate: '08 Dec 2026', description: 'Integrated monitoring for canal modernization and affected parcels.', coordinates: [[20.46, 85.88], [20.62, 86.01], [20.82, 86.22]] },
  { id: 'p4', projectId: 'PGCIL-KA-TRN-011', name: 'Bengaluru Transmission Grid', department: 'Power Grid Corporation', type: 'Power', state: 'Karnataka', district: 'Bengaluru Rural', status: 'Under Review', progress: 56, cases: 2, targetDate: '22 Jan 2027', description: 'Right-of-way and parcel status tracking for the southern grid upgrade.', coordinates: [[12.97, 77.59], [13.18, 77.72], [13.4, 77.85]] },
  { id: 'p5', projectId: 'NHAI-RJ-HWY-033', name: 'Jaipur–Kishangarh Safety Works', department: 'Ministry of Road Transport', type: 'Highway', state: 'Rajasthan', district: 'Jaipur', status: 'Completed', progress: 100, cases: 1, targetDate: '30 Jun 2026', description: 'Completed safety and junction improvement package.', coordinates: [[26.91, 75.79], [27.0, 75.94], [27.14, 76.1]] },
];

export const cases: Case[] = [
  { id: 'c1', caseId: 'NLA-PB-RLY-2026-000123', projectId: 'p1', projectName: projects[0].name, parcelId: 'PL-PB-LDH-00421', state: 'Punjab', district: 'Ludhiana', tehsil: 'Samrala', village: 'Kaddon', surveyNumber: '118/2A', area: 5.0, requiredArea: 1.7, status: 'In Progress', risk: 'Medium', stage: 'Document Verification', progress: 62, officer: 'A. Sharma', dueDate: '12 Sep 2026', externalRefs: [{ system: 'Bhoomi Rashi', id: 'BR-123456' }, { system: 'State Land Records', id: 'LR-987654' }], coordinates: [[30.92, 75.78], [30.925, 75.79], [30.918, 75.797], [30.913, 75.788]] },
  { id: 'c2', caseId: 'NLA-MH-NHA-2026-000084', projectId: 'p2', projectName: projects[1].name, parcelId: 'PL-MH-NSK-00987', state: 'Maharashtra', district: 'Nashik', tehsil: 'Sinnar', village: 'Shivde', surveyNumber: '44/3', area: 3.2, requiredArea: 2.1, status: 'Delayed', risk: 'High', stage: 'Compensation', progress: 38, officer: 'R. Patil', dueDate: '05 Sep 2026', externalRefs: [{ system: 'PFMS', id: 'PF-55021' }], coordinates: [[20.05, 73.85], [20.06, 73.86], [20.054, 73.872], [20.045, 73.865]] },
  { id: 'c3', caseId: 'NLA-OD-CWC-2026-000031', projectId: 'p3', projectName: projects[2].name, parcelId: 'PL-OD-CTK-00118', state: 'Odisha', district: 'Cuttack', tehsil: 'Banki', village: 'Nuagaon', surveyNumber: '209/1', area: 8.7, requiredArea: 3.0, status: 'Under Review', risk: 'Low', stage: 'Review', progress: 53, officer: 'P. Nayak', dueDate: '18 Sep 2026', externalRefs: [{ system: 'Odisha Land Records', id: 'OLR-8831' }], coordinates: [[20.45, 85.82], [20.46, 85.83], [20.454, 85.84], [20.443, 85.835]] },
  { id: 'c4', caseId: 'NLA-KA-PGC-2026-000009', projectId: 'p4', projectName: projects[3].name, parcelId: 'PL-KA-BLR-00209', state: 'Karnataka', district: 'Bengaluru Rural', tehsil: 'Devanahalli', village: 'Budigere', surveyNumber: '77/5', area: 2.6, requiredArea: 0.9, status: 'At Risk', risk: 'High', stage: 'Field Verification', progress: 29, officer: 'S. Rao', dueDate: '02 Sep 2026', externalRefs: [{ system: 'Bhoomi', id: 'BHM-77102' }], coordinates: [[13.18, 77.72], [13.188, 77.73], [13.182, 77.741], [13.172, 77.734]] },
  { id: 'c5', caseId: 'NLA-RJ-NHA-2026-000002', projectId: 'p5', projectName: projects[4].name, parcelId: 'PL-RJ-JPR-00041', state: 'Rajasthan', district: 'Jaipur', tehsil: 'Amer', village: 'Kukas', surveyNumber: '12/7', area: 1.4, requiredArea: 1.4, status: 'Completed', risk: 'Low', stage: 'Closure', progress: 100, officer: 'M. Singh', dueDate: '30 Jun 2026', externalRefs: [{ system: 'Bhoomi Rashi', id: 'BR-40441' }], coordinates: [[27.02, 75.88], [27.03, 75.89], [27.024, 75.9], [27.015, 75.895]] },
];

export const workflow: WorkflowStage[] = [
  { id: 'w1', name: 'Project Proposal', status: 'COMPLETED', owner: 'Department Admin' },
  { id: 'w2', name: 'Land Identification', status: 'COMPLETED', owner: 'Project Officer' },
  { id: 'w3', name: 'Field Verification', status: 'COMPLETED', owner: 'Field Officer' },
  { id: 'w4', name: 'Document Verification', status: 'CURRENT', owner: 'District Officer', dueDate: '12 Sep 2026' },
  { id: 'w5', name: 'Review & Approval', status: 'UPCOMING', owner: 'Reviewer' },
  { id: 'w6', name: 'Compensation', status: 'UPCOMING', owner: 'Department Admin' },
  { id: 'w7', name: 'Possession', status: 'UPCOMING', owner: 'Project Officer' },
  { id: 'w8', name: 'R&R and Closure', status: 'UPCOMING', owner: 'District Officer' },
];

export const timeline: TimelineEvent[] = [
  { id: 'e1', date: '10 Sep 2026', time: '09:42', action: 'Case created', actor: 'System', detail: 'NLA-PB-RLY-2026-000123 created from project intake.', tone: 'blue' },
  { id: 'e2', date: '11 Sep 2026', time: '14:20', action: 'Field verification completed', actor: 'V. Kumar · Field Officer', detail: 'GPS boundary and affected area confirmed.', tone: 'green' },
  { id: 'e3', date: '12 Sep 2026', time: '11:05', action: 'Documents uploaded', actor: 'A. Sharma · Project Officer', detail: 'Survey report and ownership reference added.', tone: 'blue' },
  { id: 'e4', date: '14 Sep 2026', time: '16:15', action: 'Submitted for review', actor: 'A. Sharma · Project Officer', detail: 'Case moved to Document Verification.', tone: 'amber' },
  { id: 'e5', date: '16 Sep 2026', time: '10:12', action: 'Correction requested', actor: 'N. Verma · Reviewer', detail: 'Upload certified village map before approval.', tone: 'red' },
];

export const documents: DocumentRecord[] = [
  { id: 'd1', name: 'Land_Record_Kaddon.pdf', type: 'Land record', owner: 'A. Sharma', updated: '15 Sep 2026', size: '2.4 MB', latest: 3, versions: [{ version: 1, fileName: 'Land_Record_Kaddon.pdf', uploadedAt: '10 Sep 2026', uploadedBy: 'A. Sharma', size: '2.1 MB', checksum: 'sha256:84b1…e2c9', change: 'Initial upload', status: 'Superseded' }, { version: 2, fileName: 'Land_Record_Kaddon.pdf', uploadedAt: '12 Sep 2026', uploadedBy: 'A. Sharma', size: '2.3 MB', checksum: 'sha256:7af3…901d', change: 'Added mutation reference', status: 'Superseded' }, { version: 3, fileName: 'Land_Record_Kaddon.pdf', uploadedAt: '15 Sep 2026', uploadedBy: 'A. Sharma', size: '2.4 MB', checksum: 'sha256:11ae…c042', change: 'Certified copy', status: 'Current' }] },
  { id: 'd2', name: 'Field_Inspection_Report.pdf', type: 'Field inspection report', owner: 'V. Kumar', updated: '11 Sep 2026', size: '4.8 MB', latest: 1, versions: [{ version: 1, fileName: 'Field_Inspection_Report.pdf', uploadedAt: '11 Sep 2026', uploadedBy: 'V. Kumar', size: '4.8 MB', checksum: 'sha256:2bf8…a110', change: 'GPS-enabled inspection report', status: 'Current' }] },
  { id: 'd3', name: 'Village_Map_118A.pdf', type: 'Survey document', owner: 'A. Sharma', updated: '14 Sep 2026', size: '1.1 MB', latest: 1, versions: [{ version: 1, fileName: 'Village_Map_118A.pdf', uploadedAt: '14 Sep 2026', uploadedBy: 'A. Sharma', size: '1.1 MB', checksum: 'sha256:8c21…ab43', change: 'Village map for review', status: 'Current' }] },
];
