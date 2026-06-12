/** Types generated for queries found in "sql/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

export type NumberOrString = number | string;

/** 'InsertFlight' parameters type */
export interface IInsertFlightParams {
  aircraft_ident: string;
  airport_from: string;
  airport_to: string;
  total_time: NumberOrString;
  wallet_address: string;
}

/** 'InsertFlight' return type */
export type IInsertFlightResult = void;

/** 'InsertFlight' query type */
export interface IInsertFlightQuery {
  params: IInsertFlightParams;
  result: IInsertFlightResult;
}

const insertFlightIR: any = {"usedParamSet":{"wallet_address":true,"aircraft_ident":true,"airport_from":true,"airport_to":true,"total_time":true},"params":[{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":114}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":132}]},{"name":"airport_from","required":true,"transform":{"type":"scalar"},"locs":[{"a":135,"b":148}]},{"name":"airport_to","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":162}]},{"name":"total_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":165,"b":176}]}],"statement":"INSERT INTO flights (wallet_address, aircraft_ident, airport_from, airport_to, total_time)\nVALUES (:wallet_address!, :aircraft_ident!, :airport_from!, :airport_to!, :total_time!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO flights (wallet_address, aircraft_ident, airport_from, airport_to, total_time)
 * VALUES (:wallet_address!, :aircraft_ident!, :airport_from!, :airport_to!, :total_time!)
 * ```
 */
export const insertFlight = new PreparedQuery<IInsertFlightParams,IInsertFlightResult>(insertFlightIR);


/** 'GetAllFlights' parameters type */
export type IGetAllFlightsParams = void;

/** 'GetAllFlights' return type */
export interface IGetAllFlightsResult {
  aircraft_ident: string;
  airport_from: string;
  airport_to: string;
  created_at: Date;
  flight_id: number;
  total_time: string;
  wallet_address: string;
}

/** 'GetAllFlights' query type */
export interface IGetAllFlightsQuery {
  params: IGetAllFlightsParams;
  result: IGetAllFlightsResult;
}

const getAllFlightsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM flights\nORDER BY flight_id DESC\nLIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM flights
 * ORDER BY flight_id DESC
 * LIMIT 100
 * ```
 */
export const getAllFlights = new PreparedQuery<IGetAllFlightsParams,IGetAllFlightsResult>(getAllFlightsIR);


/** 'InsertStudentRequest' parameters type */
export interface IInsertStudentRequestParams {
  aircraft_ident: string;
  notes: string;
  wallet_address: string;
}

/** 'InsertStudentRequest' return type */
export type IInsertStudentRequestResult = void;

/** 'InsertStudentRequest' query type */
export interface IInsertStudentRequestQuery {
  params: IInsertStudentRequestParams;
  result: IInsertStudentRequestResult;
}

const insertStudentRequestIR: any = {"usedParamSet":{"wallet_address":true,"aircraft_ident":true,"notes":true},"params":[{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":76,"b":91}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":94,"b":109}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":118}]}],"statement":"INSERT INTO student_request (wallet_address, aircraft_ident, notes)\nVALUES (:wallet_address!, :aircraft_ident!, :notes!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO student_request (wallet_address, aircraft_ident, notes)
 * VALUES (:wallet_address!, :aircraft_ident!, :notes!)
 * ```
 */
export const insertStudentRequest = new PreparedQuery<IInsertStudentRequestParams,IInsertStudentRequestResult>(insertStudentRequestIR);


/** 'GetStudentRequest' parameters type */
export interface IGetStudentRequestParams {
  request_id: number;
}

/** 'GetStudentRequest' return type */
export interface IGetStudentRequestResult {
  aircraft_ident: string;
  created_at: Date;
  notes: string;
  request_id: number;
  wallet_address: string;
}

/** 'GetStudentRequest' query type */
export interface IGetStudentRequestQuery {
  params: IGetStudentRequestParams;
  result: IGetStudentRequestResult;
}

const getStudentRequestIR: any = {"usedParamSet":{"request_id":true},"params":[{"name":"request_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":49,"b":60}]}],"statement":"SELECT * FROM student_request\nWHERE request_id = :request_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM student_request
 * WHERE request_id = :request_id!
 * ```
 */
export const getStudentRequest = new PreparedQuery<IGetStudentRequestParams,IGetStudentRequestResult>(getStudentRequestIR);


/** 'InsertStudentRequestHistory' parameters type */
export interface IInsertStudentRequestHistoryParams {
  aircraft_ident: string;
  cfi_wallet?: string | null | void;
  event: string;
  notes: string;
  request_id: number;
  wallet_address: string;
}

/** 'InsertStudentRequestHistory' return type */
export type IInsertStudentRequestHistoryResult = void;

/** 'InsertStudentRequestHistory' query type */
export interface IInsertStudentRequestHistoryQuery {
  params: IInsertStudentRequestHistoryParams;
  result: IInsertStudentRequestHistoryResult;
}

const insertStudentRequestHistoryIR: any = {"usedParamSet":{"request_id":true,"wallet_address":true,"cfi_wallet":true,"aircraft_ident":true,"notes":true,"event":true},"params":[{"name":"request_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":126}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":129,"b":144}]},{"name":"cfi_wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":147,"b":157}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":160,"b":175}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":178,"b":184}]},{"name":"event","required":true,"transform":{"type":"scalar"},"locs":[{"a":187,"b":193}]}],"statement":"INSERT INTO student_request_history (request_id, wallet_address, cfi_wallet, aircraft_ident, notes, event)\nVALUES (:request_id!, :wallet_address!, :cfi_wallet, :aircraft_ident!, :notes!, :event!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO student_request_history (request_id, wallet_address, cfi_wallet, aircraft_ident, notes, event)
 * VALUES (:request_id!, :wallet_address!, :cfi_wallet, :aircraft_ident!, :notes!, :event!)
 * ```
 */
export const insertStudentRequestHistory = new PreparedQuery<IInsertStudentRequestHistoryParams,IInsertStudentRequestHistoryResult>(insertStudentRequestHistoryIR);


/** 'DeleteStudentRequest' parameters type */
export interface IDeleteStudentRequestParams {
  request_id: number;
}

/** 'DeleteStudentRequest' return type */
export type IDeleteStudentRequestResult = void;

/** 'DeleteStudentRequest' query type */
export interface IDeleteStudentRequestQuery {
  params: IDeleteStudentRequestParams;
  result: IDeleteStudentRequestResult;
}

const deleteStudentRequestIR: any = {"usedParamSet":{"request_id":true},"params":[{"name":"request_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":47,"b":58}]}],"statement":"DELETE FROM student_request\nWHERE request_id = :request_id!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM student_request
 * WHERE request_id = :request_id!
 * ```
 */
export const deleteStudentRequest = new PreparedQuery<IDeleteStudentRequestParams,IDeleteStudentRequestResult>(deleteStudentRequestIR);


/** 'InsertCfiAvailability' parameters type */
export interface IInsertCfiAvailabilityParams {
  aircraft_ident: string;
  hourly_rate: NumberOrString;
  notes: string;
  wallet_address: string;
}

/** 'InsertCfiAvailability' return type */
export type IInsertCfiAvailabilityResult = void;

/** 'InsertCfiAvailability' query type */
export interface IInsertCfiAvailabilityQuery {
  params: IInsertCfiAvailabilityParams;
  result: IInsertCfiAvailabilityResult;
}

const insertCfiAvailabilityIR: any = {"usedParamSet":{"wallet_address":true,"aircraft_ident":true,"hourly_rate":true,"notes":true},"params":[{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":90,"b":105}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":108,"b":123}]},{"name":"hourly_rate","required":true,"transform":{"type":"scalar"},"locs":[{"a":126,"b":138}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":141,"b":147}]}],"statement":"INSERT INTO cfi_availability (wallet_address, aircraft_ident, hourly_rate, notes)\nVALUES (:wallet_address!, :aircraft_ident!, :hourly_rate!, :notes!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO cfi_availability (wallet_address, aircraft_ident, hourly_rate, notes)
 * VALUES (:wallet_address!, :aircraft_ident!, :hourly_rate!, :notes!)
 * ```
 */
export const insertCfiAvailability = new PreparedQuery<IInsertCfiAvailabilityParams,IInsertCfiAvailabilityResult>(insertCfiAvailabilityIR);


/** 'GetCfiAvailability' parameters type */
export interface IGetCfiAvailabilityParams {
  availability_id: number;
}

/** 'GetCfiAvailability' return type */
export interface IGetCfiAvailabilityResult {
  aircraft_ident: string;
  availability_id: number;
  created_at: Date;
  hourly_rate: string;
  notes: string;
  wallet_address: string;
}

/** 'GetCfiAvailability' query type */
export interface IGetCfiAvailabilityQuery {
  params: IGetCfiAvailabilityParams;
  result: IGetCfiAvailabilityResult;
}

const getCfiAvailabilityIR: any = {"usedParamSet":{"availability_id":true},"params":[{"name":"availability_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":55,"b":71}]}],"statement":"SELECT * FROM cfi_availability\nWHERE availability_id = :availability_id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM cfi_availability
 * WHERE availability_id = :availability_id!
 * ```
 */
export const getCfiAvailability = new PreparedQuery<IGetCfiAvailabilityParams,IGetCfiAvailabilityResult>(getCfiAvailabilityIR);


/** 'InsertCfiAvailabilityHistory' parameters type */
export interface IInsertCfiAvailabilityHistoryParams {
  aircraft_ident: string;
  availability_id: number;
  event: string;
  hourly_rate: NumberOrString;
  notes: string;
  student_wallet?: string | null | void;
  wallet_address: string;
}

/** 'InsertCfiAvailabilityHistory' return type */
export type IInsertCfiAvailabilityHistoryResult = void;

/** 'InsertCfiAvailabilityHistory' query type */
export interface IInsertCfiAvailabilityHistoryQuery {
  params: IInsertCfiAvailabilityHistoryParams;
  result: IInsertCfiAvailabilityHistoryResult;
}

const insertCfiAvailabilityHistoryIR: any = {"usedParamSet":{"availability_id":true,"wallet_address":true,"student_wallet":true,"aircraft_ident":true,"hourly_rate":true,"notes":true,"event":true},"params":[{"name":"availability_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":154}]},{"name":"wallet_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":157,"b":172}]},{"name":"student_wallet","required":false,"transform":{"type":"scalar"},"locs":[{"a":175,"b":189}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":192,"b":207}]},{"name":"hourly_rate","required":true,"transform":{"type":"scalar"},"locs":[{"a":210,"b":222}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":225,"b":231}]},{"name":"event","required":true,"transform":{"type":"scalar"},"locs":[{"a":234,"b":240}]}],"statement":"INSERT INTO cfi_availability_history (availability_id, wallet_address, student_wallet, aircraft_ident, hourly_rate, notes, event)\nVALUES (:availability_id!, :wallet_address!, :student_wallet, :aircraft_ident!, :hourly_rate!, :notes!, :event!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO cfi_availability_history (availability_id, wallet_address, student_wallet, aircraft_ident, hourly_rate, notes, event)
 * VALUES (:availability_id!, :wallet_address!, :student_wallet, :aircraft_ident!, :hourly_rate!, :notes!, :event!)
 * ```
 */
export const insertCfiAvailabilityHistory = new PreparedQuery<IInsertCfiAvailabilityHistoryParams,IInsertCfiAvailabilityHistoryResult>(insertCfiAvailabilityHistoryIR);


/** 'DeleteCfiAvailability' parameters type */
export interface IDeleteCfiAvailabilityParams {
  availability_id: number;
}

/** 'DeleteCfiAvailability' return type */
export type IDeleteCfiAvailabilityResult = void;

/** 'DeleteCfiAvailability' query type */
export interface IDeleteCfiAvailabilityQuery {
  params: IDeleteCfiAvailabilityParams;
  result: IDeleteCfiAvailabilityResult;
}

const deleteCfiAvailabilityIR: any = {"usedParamSet":{"availability_id":true},"params":[{"name":"availability_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":69}]}],"statement":"DELETE FROM cfi_availability\nWHERE availability_id = :availability_id!"};

/**
 * Query generated from SQL:
 * ```
 * DELETE FROM cfi_availability
 * WHERE availability_id = :availability_id!
 * ```
 */
export const deleteCfiAvailability = new PreparedQuery<IDeleteCfiAvailabilityParams,IDeleteCfiAvailabilityResult>(deleteCfiAvailabilityIR);




/** 'GetAllStudentRequests' parameters type */
export type IGetAllStudentRequestsParams = void;

/** 'GetAllStudentRequests' return type */
export interface IGetAllStudentRequestsResult {
  aircraft_ident: string;
  created_at: Date;
  notes: string;
  request_id: number;
  wallet_address: string;
}

/** 'GetAllStudentRequests' query type */
export interface IGetAllStudentRequestsQuery {
  params: IGetAllStudentRequestsParams;
  result: IGetAllStudentRequestsResult;
}

const getAllStudentRequestsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM student_request\nORDER BY request_id DESC\nLIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM student_request
 * ORDER BY request_id DESC
 * LIMIT 100
 * ```
 */
export const getAllStudentRequests = new PreparedQuery<IGetAllStudentRequestsParams,IGetAllStudentRequestsResult>(getAllStudentRequestsIR);


/** 'GetAllCfiAvailability' parameters type */
export type IGetAllCfiAvailabilityParams = void;

/** 'GetAllCfiAvailability' return type */
export interface IGetAllCfiAvailabilityResult {
  aircraft_ident: string;
  availability_id: number;
  created_at: Date;
  hourly_rate: string;
  notes: string;
  wallet_address: string;
}

/** 'GetAllCfiAvailability' query type */
export interface IGetAllCfiAvailabilityQuery {
  params: IGetAllCfiAvailabilityParams;
  result: IGetAllCfiAvailabilityResult;
}

const getAllCfiAvailabilityIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM cfi_availability\nORDER BY availability_id DESC\nLIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM cfi_availability
 * ORDER BY availability_id DESC
 * LIMIT 100
 * ```
 */
export const getAllCfiAvailability = new PreparedQuery<IGetAllCfiAvailabilityParams,IGetAllCfiAvailabilityResult>(getAllCfiAvailabilityIR);
