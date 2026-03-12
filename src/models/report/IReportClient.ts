import IReport from "./IReport";

/**
 * Interface for the report client. Implement this to swap providers (e.g. Firebase, Supabase).
 * All methods use IReport; implementations adapt their provider's user type to IReport.
 */
export default interface IReportClient {
    /* Creates a new report based on IReport*/
    createReport: (report: IReport) => Promise<void>;
}