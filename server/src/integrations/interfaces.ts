export interface LandRecordsAdapter {
  getParcel(externalId: string): Promise<{
    externalId: string;
    surveyNumber: string;
    areaHa: number;
    source: string;
  }>;
  getDocuments(externalId: string): Promise<string[]>;
}


export interface AcquisitionSystemAdapter {
  getCase(
    externalId: string,
  ): Promise<{ externalId: string; status: string; lastSyncedAt: string }>;
  getCaseStatus(externalId: string): Promise<string>;
}


export interface PaymentSystemAdapter {
  getPaymentStatus(
    externalId: string,
  ): Promise<{ status: string; paidAmount: number; reference?: string }>;
}


export class MockLandRecordsAdapter implements LandRecordsAdapter {
  async getParcel(externalId: string) {
    return {
      externalId,
      surveyNumber: "118/2A",
      areaHa: 5,
      source: "DEMO / MOCK · State Land Records",
    };
  }
  async getDocuments(_externalId: string) {
    return ["Land_Record_Kaddon.pdf", "Village_Map_118A.pdf"];
  }
}


export class MockAcquisitionAdapter implements AcquisitionSystemAdapter {
  async getCase(externalId: string) {
    return {
      externalId,
      status: "IN_PROGRESS",
      lastSyncedAt: new Date().toISOString(),
    };
  }
  async getCaseStatus(_externalId: string) {
    return "IN_PROGRESS";
  }
}


export class MockPfmsAdapter implements PaymentSystemAdapter {
  async getPaymentStatus(_externalId: string) {
    return {
      status: "UNDER_PROCESS",
      paidAmount: 0,
      reference: "DEMO-PFMS-55021",
    };
  }
}
