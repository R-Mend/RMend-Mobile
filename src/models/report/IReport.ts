/**
 * Report shape required by the report layer. Implementations of IReportClient
 * must produce and accept objects conforming to this interface.
 */
export default interface IReport {
  id: string;
  authorityId: string;
  senderId: string;
  timeCreated: string;
  images: IReportImage[];
  details: IReportDetails;
  location: IReportLocation;
//   geoData: IReportGeoData;
}

// currently removed due to dependancy geofirex no longer being maintained
// export interface IReportGeoData {
//     geoHash: string,
//     geopoint: string // confirm this is correct for geofirex
// }

export interface IReportLocation {
    latitude: number,
    longitude: number
}

export interface IReportImage {
  id: string,
  uri: string,
  url: string
}

export interface IReportDetails {
  description: string,
  iconName: string,
  type: string,
}