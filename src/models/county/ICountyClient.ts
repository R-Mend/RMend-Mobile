import IAuthority from "./IAuthority";
import { IIssueGroup } from "./ICounty";

/**
 * Interface for the report client. Implement this to swap providers (e.g. Firebase, Supabase).
 * All methods use IReport; implementations adapt their provider's user type to IReport.
 */
export default interface ICountyClient {
    /* Creates a new report based on IReport*/
    getIssueGroups: (county: string) => Promise<IIssueGroup[]>;

    /* Get's the details about a given Authority */
    getAuthority: (id: string) => Promise<IAuthority>;
}