/**
 * County shape required by the counties layer. Implementations of ICountyClient
 * must produce and accept objects conforming to this interface.
 */
export default interface ICounty {
  issueGroups: IIssueGroup[];
}

export interface IIssueGroup {
    authorityId: string;
    iconName: string;
    name: string;
    types: string[];
}