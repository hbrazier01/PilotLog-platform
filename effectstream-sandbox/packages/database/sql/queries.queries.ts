/** Types generated for queries found in "sql/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertProfile' parameters type */
export interface IInsertProfileParams {
  block_height: number;
  display_name: string;
  notes: string;
  pilot_phase: string;
  signer_address: string;
}

/** 'InsertProfile' return type */
export type IInsertProfileResult = void;

/** 'InsertProfile' query type */
export interface IInsertProfileQuery {
  params: IInsertProfileParams;
  result: IInsertProfileResult;
}

const insertProfileIR: any = {"usedParamSet":{"signer_address":true,"display_name":true,"pilot_phase":true,"notes":true,"block_height":true},"params":[{"name":"signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":114}]},{"name":"display_name","required":true,"transform":{"type":"scalar"},"locs":[{"a":117,"b":130}]},{"name":"pilot_phase","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":145}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":148,"b":154}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":157,"b":170}]}],"statement":"INSERT INTO pilot_profile (signer_address, display_name, pilot_phase, notes, block_height)\nVALUES (:signer_address!, :display_name!, :pilot_phase!, :notes!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO pilot_profile (signer_address, display_name, pilot_phase, notes, block_height)
 * VALUES (:signer_address!, :display_name!, :pilot_phase!, :notes!, :block_height!)
 * ```
 */
export const insertProfile = new PreparedQuery<IInsertProfileParams,IInsertProfileResult>(insertProfileIR);


/** 'GetAllProfiles' parameters type */
export type IGetAllProfilesParams = void;

/** 'GetAllProfiles' return type */
export interface IGetAllProfilesResult {
  block_height: number;
  created_at: Date;
  display_name: string;
  id: number;
  notes: string;
  pilot_phase: string;
  signer_address: string;
  updated_at: Date;
}

/** 'GetAllProfiles' query type */
export interface IGetAllProfilesQuery {
  params: IGetAllProfilesParams;
  result: IGetAllProfilesResult;
}

const getAllProfilesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM pilot_profile\nORDER BY id DESC\nLIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM pilot_profile
 * ORDER BY id DESC
 * LIMIT 100
 * ```
 */
export const getAllProfiles = new PreparedQuery<IGetAllProfilesParams,IGetAllProfilesResult>(getAllProfilesIR);


/** 'GetProfileBySigner' parameters type */
export interface IGetProfileBySignerParams {
  signer_address: string;
}

/** 'GetProfileBySigner' return type */
export interface IGetProfileBySignerResult {
  block_height: number;
  created_at: Date;
  display_name: string;
  id: number;
  notes: string;
  pilot_phase: string;
  signer_address: string;
  updated_at: Date;
}

/** 'GetProfileBySigner' query type */
export interface IGetProfileBySignerQuery {
  params: IGetProfileBySignerParams;
  result: IGetProfileBySignerResult;
}

const getProfileBySignerIR: any = {"usedParamSet":{"signer_address":true},"params":[{"name":"signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":51,"b":66}]}],"statement":"SELECT * FROM pilot_profile\nWHERE signer_address = :signer_address!\nORDER BY id DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM pilot_profile
 * WHERE signer_address = :signer_address!
 * ORDER BY id DESC
 * LIMIT 1
 * ```
 */
export const getProfileBySigner = new PreparedQuery<IGetProfileBySignerParams,IGetProfileBySignerResult>(getProfileBySignerIR);


// ── Student Requests ───────────────────────────────────────────────────────────

/** 'InsertStudentRequest' parameters type */
export interface IInsertStudentRequestParams {
  owner_signer_address: string;
  aircraft_ident: string;
  notes: string;
  block_height: number;
}

/** 'InsertStudentRequest' return type */
export type IInsertStudentRequestResult = void;

/** 'InsertStudentRequest' query type */
export interface IInsertStudentRequestQuery {
  params: IInsertStudentRequestParams;
  result: IInsertStudentRequestResult;
}

const insertStudentRequestIR: any = {"usedParamSet":{"owner_signer_address":true,"aircraft_ident":true,"notes":true,"block_height":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":96,"b":117}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":120,"b":135}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":138,"b":144}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":147,"b":160}]}],"statement":"INSERT INTO student_request (owner_signer_address, aircraft_ident, notes, block_height)\nVALUES (:owner_signer_address!, :aircraft_ident!, :notes!, :block_height!)"};

export const insertStudentRequest = new PreparedQuery<IInsertStudentRequestParams,IInsertStudentRequestResult>(insertStudentRequestIR);


/** 'AcceptStudentRequest' parameters type */
export interface IAcceptStudentRequestParams {
  accepted_signer_address: string;
  id: number;
}

/** 'AcceptStudentRequest' return type */
export type IAcceptStudentRequestResult = void;

/** 'AcceptStudentRequest' query type */
export interface IAcceptStudentRequestQuery {
  params: IAcceptStudentRequestParams;
  result: IAcceptStudentRequestResult;
}

const acceptStudentRequestIR: any = {"usedParamSet":{"accepted_signer_address":true,"id":true},"params":[{"name":"accepted_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":74,"b":98}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":134}]}],"statement":"UPDATE student_request SET status = 'accepted', accepted_signer_address = :accepted_signer_address!, updated_at = NOW() WHERE id = :id! AND status = 'open'"};

export const acceptStudentRequest = new PreparedQuery<IAcceptStudentRequestParams,IAcceptStudentRequestResult>(acceptStudentRequestIR);


/** 'WithdrawStudentRequest' parameters type */
export interface IWithdrawStudentRequestParams {
  id: number;
  owner_signer_address: string;
}

/** 'WithdrawStudentRequest' return type */
export type IWithdrawStudentRequestResult = void;

/** 'WithdrawStudentRequest' query type */
export interface IWithdrawStudentRequestQuery {
  params: IWithdrawStudentRequestParams;
  result: IWithdrawStudentRequestResult;
}

const withdrawStudentRequestIR: any = {"usedParamSet":{"id":true,"owner_signer_address":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":79,"b":82}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":111,"b":132}]}],"statement":"UPDATE student_request SET status = 'withdrawn', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'open'"};

export const withdrawStudentRequest = new PreparedQuery<IWithdrawStudentRequestParams,IWithdrawStudentRequestResult>(withdrawStudentRequestIR);


/** 'GetAllStudentRequests' parameters type */
export type IGetAllStudentRequestsParams = void;

/** 'GetAllStudentRequests' return type */
export interface IGetAllStudentRequestsResult {
  id: number;
  owner_signer_address: string;
  aircraft_ident: string;
  notes: string;
  status: string;
  accepted_signer_address: string | null;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllStudentRequests' query type */
export interface IGetAllStudentRequestsQuery {
  params: IGetAllStudentRequestsParams;
  result: IGetAllStudentRequestsResult;
}

const getAllStudentRequestsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM student_request ORDER BY id DESC LIMIT 100"};

export const getAllStudentRequests = new PreparedQuery<IGetAllStudentRequestsParams,IGetAllStudentRequestsResult>(getAllStudentRequestsIR);


// ── CFI Availability ───────────────────────────────────────────────────────────

/** 'InsertCfiAvailability' parameters type */
export interface IInsertCfiAvailabilityParams {
  owner_signer_address: string;
  aircraft_ident: string;
  hourly_rate: number;
  notes: string;
  block_height: number;
}

/** 'InsertCfiAvailability' return type */
export type IInsertCfiAvailabilityResult = void;

/** 'InsertCfiAvailability' query type */
export interface IInsertCfiAvailabilityQuery {
  params: IInsertCfiAvailabilityParams;
  result: IInsertCfiAvailabilityResult;
}

const insertCfiAvailabilityIR: any = {"usedParamSet":{"owner_signer_address":true,"aircraft_ident":true,"hourly_rate":true,"notes":true,"block_height":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":110,"b":131}]},{"name":"aircraft_ident","required":true,"transform":{"type":"scalar"},"locs":[{"a":134,"b":149}]},{"name":"hourly_rate","required":true,"transform":{"type":"scalar"},"locs":[{"a":152,"b":164}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":167,"b":173}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":176,"b":189}]}],"statement":"INSERT INTO cfi_availability (owner_signer_address, aircraft_ident, hourly_rate, notes, block_height)\nVALUES (:owner_signer_address!, :aircraft_ident!, :hourly_rate!, :notes!, :block_height!)"};

export const insertCfiAvailability = new PreparedQuery<IInsertCfiAvailabilityParams,IInsertCfiAvailabilityResult>(insertCfiAvailabilityIR);


/** 'AcceptCfiAvailability' parameters type */
export interface IAcceptCfiAvailabilityParams {
  accepted_signer_address: string;
  id: number;
}

/** 'AcceptCfiAvailability' return type */
export type IAcceptCfiAvailabilityResult = void;

/** 'AcceptCfiAvailability' query type */
export interface IAcceptCfiAvailabilityQuery {
  params: IAcceptCfiAvailabilityParams;
  result: IAcceptCfiAvailabilityResult;
}

const acceptCfiAvailabilityIR: any = {"usedParamSet":{"accepted_signer_address":true,"id":true},"params":[{"name":"accepted_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":75,"b":99}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":132,"b":135}]}],"statement":"UPDATE cfi_availability SET status = 'accepted', accepted_signer_address = :accepted_signer_address!, updated_at = NOW() WHERE id = :id! AND status = 'open'"};

export const acceptCfiAvailability = new PreparedQuery<IAcceptCfiAvailabilityParams,IAcceptCfiAvailabilityResult>(acceptCfiAvailabilityIR);


/** 'WithdrawCfiAvailability' parameters type */
export interface IWithdrawCfiAvailabilityParams {
  id: number;
  owner_signer_address: string;
}

/** 'WithdrawCfiAvailability' return type */
export type IWithdrawCfiAvailabilityResult = void;

/** 'WithdrawCfiAvailability' query type */
export interface IWithdrawCfiAvailabilityQuery {
  params: IWithdrawCfiAvailabilityParams;
  result: IWithdrawCfiAvailabilityResult;
}

const withdrawCfiAvailabilityIR: any = {"usedParamSet":{"id":true,"owner_signer_address":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":80,"b":83}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":133}]}],"statement":"UPDATE cfi_availability SET status = 'withdrawn', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'open'"};

export const withdrawCfiAvailability = new PreparedQuery<IWithdrawCfiAvailabilityParams,IWithdrawCfiAvailabilityResult>(withdrawCfiAvailabilityIR);


/** 'GetAllCfiAvailability' parameters type */
export type IGetAllCfiAvailabilityParams = void;

/** 'GetAllCfiAvailability' return type */
export interface IGetAllCfiAvailabilityResult {
  id: number;
  owner_signer_address: string;
  aircraft_ident: string;
  hourly_rate: string;
  notes: string;
  status: string;
  accepted_signer_address: string | null;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllCfiAvailability' query type */
export interface IGetAllCfiAvailabilityQuery {
  params: IGetAllCfiAvailabilityParams;
  result: IGetAllCfiAvailabilityResult;
}

const getAllCfiAvailabilityIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM cfi_availability ORDER BY id DESC LIMIT 100"};

export const getAllCfiAvailability = new PreparedQuery<IGetAllCfiAvailabilityParams,IGetAllCfiAvailabilityResult>(getAllCfiAvailabilityIR);


// ── Aircraft ───────────────────────────────────────────────────────────────────

/** 'InsertAircraft' parameters type */
export interface IInsertAircraftParams {
  owner_signer_address: string;
  tail_number: string;
  manufacturer: string;
  model: string;
  year: number;
  aircraft_category: string;
  block_height: number;
}

/** 'InsertAircraft' return type */
export type IInsertAircraftResult = void;

/** 'InsertAircraft' query type */
export interface IInsertAircraftQuery {
  params: IInsertAircraftParams;
  result: IInsertAircraftResult;
}

const insertAircraftIR: any = {"usedParamSet":{"owner_signer_address":true,"tail_number":true,"manufacturer":true,"model":true,"year":true,"aircraft_category":true,"block_height":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":125,"b":146}]},{"name":"tail_number","required":true,"transform":{"type":"scalar"},"locs":[{"a":149,"b":161}]},{"name":"manufacturer","required":true,"transform":{"type":"scalar"},"locs":[{"a":164,"b":177}]},{"name":"model","required":true,"transform":{"type":"scalar"},"locs":[{"a":180,"b":186}]},{"name":"year","required":true,"transform":{"type":"scalar"},"locs":[{"a":189,"b":194}]},{"name":"aircraft_category","required":true,"transform":{"type":"scalar"},"locs":[{"a":197,"b":215}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":218,"b":231}]}],"statement":"INSERT INTO aircraft (owner_signer_address, tail_number, manufacturer, model, year, aircraft_category, block_height)\nVALUES (:owner_signer_address!, :tail_number!, :manufacturer!, :model!, :year!, :aircraft_category!, :block_height!)"};

export const insertAircraft = new PreparedQuery<IInsertAircraftParams,IInsertAircraftResult>(insertAircraftIR);


/** 'UpdateAircraft' parameters type */
export interface IUpdateAircraftParams {
  manufacturer: string;
  model: string;
  year: number;
  aircraft_category: string;
  id: number;
  owner_signer_address: string;
}

/** 'UpdateAircraft' return type */
export type IUpdateAircraftResult = void;

/** 'UpdateAircraft' query type */
export interface IUpdateAircraftQuery {
  params: IUpdateAircraftParams;
  result: IUpdateAircraftResult;
}

const updateAircraftIR: any = {"usedParamSet":{"manufacturer":true,"model":true,"year":true,"aircraft_category":true,"id":true,"owner_signer_address":true},"params":[{"name":"manufacturer","required":true,"transform":{"type":"scalar"},"locs":[{"a":35,"b":48}]},{"name":"model","required":true,"transform":{"type":"scalar"},"locs":[{"a":59,"b":65}]},{"name":"year","required":true,"transform":{"type":"scalar"},"locs":[{"a":75,"b":80}]},{"name":"aircraft_category","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":121}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":154,"b":157}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":186,"b":207}]}],"statement":"UPDATE aircraft SET manufacturer = :manufacturer!, model = :model!, year = :year!, aircraft_category = :aircraft_category!, updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'"};

export const updateAircraft = new PreparedQuery<IUpdateAircraftParams,IUpdateAircraftResult>(updateAircraftIR);


/** 'DeactivateAircraft' parameters type */
export interface IDeactivateAircraftParams {
  id: number;
  owner_signer_address: string;
}

/** 'DeactivateAircraft' return type */
export type IDeactivateAircraftResult = void;

/** 'DeactivateAircraft' query type */
export interface IDeactivateAircraftQuery {
  params: IDeactivateAircraftParams;
  result: IDeactivateAircraftResult;
}

const deactivateAircraftIR: any = {"usedParamSet":{"id":true,"owner_signer_address":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":74}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":124}]}],"statement":"UPDATE aircraft SET status = 'inactive', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'"};

export const deactivateAircraft = new PreparedQuery<IDeactivateAircraftParams,IDeactivateAircraftResult>(deactivateAircraftIR);


/** 'GetAllAircraft' parameters type */
export type IGetAllAircraftParams = void;

/** 'GetAllAircraft' return type */
export interface IGetAllAircraftResult {
  id: number;
  owner_signer_address: string;
  tail_number: string;
  manufacturer: string;
  model: string;
  year: number;
  aircraft_category: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllAircraft' query type */
export interface IGetAllAircraftQuery {
  params: IGetAllAircraftParams;
  result: IGetAllAircraftResult;
}

const getAllAircraftIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM aircraft WHERE status = 'active' ORDER BY id DESC LIMIT 100"};

export const getAllAircraft = new PreparedQuery<IGetAllAircraftParams,IGetAllAircraftResult>(getAllAircraftIR);


/** 'GetAircraftById' parameters type */
export interface IGetAircraftByIdParams {
  id: number;
}

/** 'GetAircraftById' return type */
export interface IGetAircraftByIdResult {
  id: number;
  owner_signer_address: string;
  tail_number: string;
  manufacturer: string;
  model: string;
  year: number;
  aircraft_category: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAircraftById' query type */
export interface IGetAircraftByIdQuery {
  params: IGetAircraftByIdParams;
  result: IGetAircraftByIdResult;
}

const getAircraftByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":34,"b":37}]}],"statement":"SELECT * FROM aircraft WHERE id = :id!"};

export const getAircraftById = new PreparedQuery<IGetAircraftByIdParams,IGetAircraftByIdResult>(getAircraftByIdIR);


/** 'GetAircraftBySigner' parameters type */
export interface IGetAircraftBySignerParams {
  owner_signer_address: string;
}

/** 'GetAircraftBySigner' return type */
export interface IGetAircraftBySignerResult {
  id: number;
  owner_signer_address: string;
  tail_number: string;
  manufacturer: string;
  model: string;
  year: number;
  aircraft_category: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAircraftBySigner' query type */
export interface IGetAircraftBySignerQuery {
  params: IGetAircraftBySignerParams;
  result: IGetAircraftBySignerResult;
}

const getAircraftBySignerIR: any = {"usedParamSet":{"owner_signer_address":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":52,"b":73}]}],"statement":"SELECT * FROM aircraft WHERE owner_signer_address = :owner_signer_address! AND status = 'active' ORDER BY id DESC LIMIT 100"};

export const getAircraftBySigner = new PreparedQuery<IGetAircraftBySignerParams,IGetAircraftBySignerResult>(getAircraftBySignerIR);


// ── Flight Log (AIR-353) ───────────────────────────────────────────────────────

/** 'InsertFlightLog' parameters type */
export interface IInsertFlightLogParams {
  owner_signer_address: string;
  aircraft_id: number;
  flight_date: string;
  departure_airport: string;
  arrival_airport: string;
  total_time: number;
  pic_time: number;
  dual_received_time: number;
  night_time: number;
  instrument_time: number;
  notes: string;
  block_height: number;
}

/** 'InsertFlightLog' return type */
export type IInsertFlightLogResult = void;

/** 'InsertFlightLog' query type */
export interface IInsertFlightLogQuery {
  params: IInsertFlightLogParams;
  result: IInsertFlightLogResult;
}

const insertFlightLogIR: any = {"usedParamSet":{"owner_signer_address":true,"aircraft_id":true,"flight_date":true,"departure_airport":true,"arrival_airport":true,"total_time":true,"pic_time":true,"dual_received_time":true,"night_time":true,"instrument_time":true,"notes":true,"block_height":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":208,"b":229}]},{"name":"aircraft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":232,"b":244}]},{"name":"flight_date","required":true,"transform":{"type":"scalar"},"locs":[{"a":247,"b":259}]},{"name":"departure_airport","required":true,"transform":{"type":"scalar"},"locs":[{"a":262,"b":280}]},{"name":"arrival_airport","required":true,"transform":{"type":"scalar"},"locs":[{"a":283,"b":299}]},{"name":"total_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":302,"b":313}]},{"name":"pic_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":316,"b":325}]},{"name":"dual_received_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":328,"b":347}]},{"name":"night_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":350,"b":361}]},{"name":"instrument_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":364,"b":380}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":383,"b":389}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":392,"b":405}]}],"statement":"INSERT INTO flight_log (owner_signer_address, aircraft_id, flight_date, departure_airport, arrival_airport, total_time, pic_time, dual_received_time, night_time, instrument_time, notes, block_height)\nVALUES (:owner_signer_address!, :aircraft_id!, :flight_date!, :departure_airport!, :arrival_airport!, :total_time!, :pic_time!, :dual_received_time!, :night_time!, :instrument_time!, :notes!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO flight_log (owner_signer_address, aircraft_id, flight_date, departure_airport, arrival_airport, total_time, pic_time, dual_received_time, night_time, instrument_time, notes, block_height)
 * VALUES (:owner_signer_address!, :aircraft_id!, :flight_date!, :departure_airport!, :arrival_airport!, :total_time!, :pic_time!, :dual_received_time!, :night_time!, :instrument_time!, :notes!, :block_height!)
 * ```
 */
export const insertFlightLog = new PreparedQuery<IInsertFlightLogParams,IInsertFlightLogResult>(insertFlightLogIR);


/** 'UpdateFlightLog' parameters type */
export interface IUpdateFlightLogParams {
  aircraft_id: number;
  flight_date: string;
  departure_airport: string;
  arrival_airport: string;
  total_time: number;
  pic_time: number;
  dual_received_time: number;
  night_time: number;
  instrument_time: number;
  notes: string;
  id: number;
  owner_signer_address: string;
}

/** 'UpdateFlightLog' return type */
export type IUpdateFlightLogResult = void;

/** 'UpdateFlightLog' query type */
export interface IUpdateFlightLogQuery {
  params: IUpdateFlightLogParams;
  result: IUpdateFlightLogResult;
}

const updateFlightLogIR: any = {"usedParamSet":{"aircraft_id":true,"flight_date":true,"departure_airport":true,"arrival_airport":true,"total_time":true,"pic_time":true,"dual_received_time":true,"night_time":true,"instrument_time":true,"notes":true,"id":true,"owner_signer_address":true},"params":[{"name":"aircraft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":36,"b":48}]},{"name":"flight_date","required":true,"transform":{"type":"scalar"},"locs":[{"a":65,"b":77}]},{"name":"departure_airport","required":true,"transform":{"type":"scalar"},"locs":[{"a":100,"b":118}]},{"name":"arrival_airport","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":155}]},{"name":"total_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":171,"b":182}]},{"name":"pic_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":196,"b":205}]},{"name":"dual_received_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":229,"b":248}]},{"name":"night_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":264,"b":275}]},{"name":"instrument_time","required":true,"transform":{"type":"scalar"},"locs":[{"a":296,"b":312}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":323,"b":329}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":362,"b":365}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":394,"b":415}]}],"statement":"UPDATE flight_log SET aircraft_id = :aircraft_id!, flight_date = :flight_date!, departure_airport = :departure_airport!, arrival_airport = :arrival_airport!, total_time = :total_time!, pic_time = :pic_time!, dual_received_time = :dual_received_time!, night_time = :night_time!, instrument_time = :instrument_time!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE flight_log SET aircraft_id = :aircraft_id!, flight_date = :flight_date!, departure_airport = :departure_airport!, arrival_airport = :arrival_airport!, total_time = :total_time!, pic_time = :pic_time!, dual_received_time = :dual_received_time!, night_time = :night_time!, instrument_time = :instrument_time!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'
 * ```
 */
export const updateFlightLog = new PreparedQuery<IUpdateFlightLogParams,IUpdateFlightLogResult>(updateFlightLogIR);


/** 'VoidFlightLog' parameters type */
export interface IVoidFlightLogParams {
  id: number;
  owner_signer_address: string;
}

/** 'VoidFlightLog' return type */
export type IVoidFlightLogResult = void;

/** 'VoidFlightLog' query type */
export interface IVoidFlightLogQuery {
  params: IVoidFlightLogParams;
  result: IVoidFlightLogResult;
}

const voidFlightLogIR: any = {"usedParamSet":{"id":true,"owner_signer_address":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":74}]},{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":103,"b":124}]}],"statement":"UPDATE flight_log SET status = 'voided', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE flight_log SET status = 'voided', updated_at = NOW() WHERE id = :id! AND owner_signer_address = :owner_signer_address! AND status = 'active'
 * ```
 */
export const voidFlightLog = new PreparedQuery<IVoidFlightLogParams,IVoidFlightLogResult>(voidFlightLogIR);


/** 'GetAllFlights' parameters type */
export type IGetAllFlightsParams = void;

/** 'GetAllFlights' return type */
export interface IGetAllFlightsResult {
  id: number;
  owner_signer_address: string;
  aircraft_id: number;
  flight_date: Date;
  departure_airport: string;
  arrival_airport: string;
  total_time: string;
  pic_time: string;
  dual_received_time: string;
  night_time: string;
  instrument_time: string;
  notes: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllFlights' query type */
export interface IGetAllFlightsQuery {
  params: IGetAllFlightsParams;
  result: IGetAllFlightsResult;
}

const getAllFlightsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM flight_log WHERE status = 'active' ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM flight_log WHERE status = 'active' ORDER BY id DESC LIMIT 100
 * ```
 */
export const getAllFlights = new PreparedQuery<IGetAllFlightsParams,IGetAllFlightsResult>(getAllFlightsIR);


/** 'GetFlightById' parameters type */
export interface IGetFlightByIdParams {
  id: number;
}

/** 'GetFlightById' return type */
export interface IGetFlightByIdResult {
  id: number;
  owner_signer_address: string;
  aircraft_id: number;
  flight_date: Date;
  departure_airport: string;
  arrival_airport: string;
  total_time: string;
  pic_time: string;
  dual_received_time: string;
  night_time: string;
  instrument_time: string;
  notes: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetFlightById' query type */
export interface IGetFlightByIdQuery {
  params: IGetFlightByIdParams;
  result: IGetFlightByIdResult;
}

const getFlightByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":36,"b":39}]}],"statement":"SELECT * FROM flight_log WHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM flight_log WHERE id = :id!
 * ```
 */
export const getFlightById = new PreparedQuery<IGetFlightByIdParams,IGetFlightByIdResult>(getFlightByIdIR);


/** 'GetFlightsBySigner' parameters type */
export interface IGetFlightsBySignerParams {
  owner_signer_address: string;
}

/** 'GetFlightsBySigner' return type */
export interface IGetFlightsBySignerResult {
  id: number;
  owner_signer_address: string;
  aircraft_id: number;
  flight_date: Date;
  departure_airport: string;
  arrival_airport: string;
  total_time: string;
  pic_time: string;
  dual_received_time: string;
  night_time: string;
  instrument_time: string;
  notes: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetFlightsBySigner' query type */
export interface IGetFlightsBySignerQuery {
  params: IGetFlightsBySignerParams;
  result: IGetFlightsBySignerResult;
}

const getFlightsBySignerIR: any = {"usedParamSet":{"owner_signer_address":true},"params":[{"name":"owner_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":54,"b":75}]}],"statement":"SELECT * FROM flight_log WHERE owner_signer_address = :owner_signer_address! ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM flight_log WHERE owner_signer_address = :owner_signer_address! ORDER BY id DESC LIMIT 100
 * ```
 */
export const getFlightsBySigner = new PreparedQuery<IGetFlightsBySignerParams,IGetFlightsBySignerResult>(getFlightsBySignerIR);


/** 'GetFlightsByAircraft' parameters type */
export interface IGetFlightsByAircraftParams {
  aircraft_id: number;
}

/** 'GetFlightsByAircraft' return type */
export interface IGetFlightsByAircraftResult {
  id: number;
  owner_signer_address: string;
  aircraft_id: number;
  flight_date: Date;
  departure_airport: string;
  arrival_airport: string;
  total_time: string;
  pic_time: string;
  dual_received_time: string;
  night_time: string;
  instrument_time: string;
  notes: string;
  status: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetFlightsByAircraft' query type */
export interface IGetFlightsByAircraftQuery {
  params: IGetFlightsByAircraftParams;
  result: IGetFlightsByAircraftResult;
}

const getFlightsByAircraftIR: any = {"usedParamSet":{"aircraft_id":true},"params":[{"name":"aircraft_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":45,"b":57}]}],"statement":"SELECT * FROM flight_log WHERE aircraft_id = :aircraft_id! AND status = 'active' ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM flight_log WHERE aircraft_id = :aircraft_id! AND status = 'active' ORDER BY id DESC LIMIT 100
 * ```
 */
export const getFlightsByAircraft = new PreparedQuery<IGetFlightsByAircraftParams,IGetFlightsByAircraftResult>(getFlightsByAircraftIR);


/** 'InsertTrainingRecord' parameters type */
export interface IInsertTrainingRecordParams {
  student_signer_address: string;
  instructor_signer_address: string;
  flight_log_id: number;
  training_type: string;
  notes: string;
  block_height: number;
}

/** 'InsertTrainingRecord' return type */
export interface IInsertTrainingRecordResult {
  /** This query does not return data. It performs an insert operation. */
  void: void;
}

/** 'InsertTrainingRecord' query type */
export interface IInsertTrainingRecordQuery {
  params: IInsertTrainingRecordParams;
  result: IInsertTrainingRecordResult;
}

const insertTrainingRecordIR: any = {"usedParamSet":{"student_signer_address":true,"instructor_signer_address":true,"flight_log_id":true,"training_type":true,"notes":true,"block_height":true},"params":[{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":151,"b":174}]},{"name":"instructor_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":177,"b":203}]},{"name":"flight_log_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":206,"b":220},{"a":313,"b":327}]},{"name":"training_type","required":true,"transform":{"type":"scalar"},"locs":[{"a":239,"b":253}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":256,"b":262}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":265,"b":278}]}],"statement":"INSERT INTO training_record (student_signer_address, instructor_signer_address, flight_log_id, aircraft_id, training_type, notes, block_height)\nSELECT :student_signer_address!, :instructor_signer_address!, :flight_log_id!, fl.aircraft_id, :training_type!, :notes!, :block_height!\nFROM flight_log fl WHERE fl.id = :flight_log_id! AND fl.status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO training_record (student_signer_address, instructor_signer_address, flight_log_id, aircraft_id, training_type, notes, block_height)
 * VALUES (:student_signer_address!, :instructor_signer_address!, :flight_log_id!, :aircraft_id!, :training_type!, :notes!, :block_height!)
 * ```
 */
export const insertTrainingRecord = new PreparedQuery<IInsertTrainingRecordParams,IInsertTrainingRecordResult>(insertTrainingRecordIR);


/** 'UpdateTrainingRecord' parameters type */
export interface IUpdateTrainingRecordParams {
  id: number;
  student_signer_address: string;
  training_type: string;
  notes: string;
}

/** 'UpdateTrainingRecord' return type */
export interface IUpdateTrainingRecordResult {
  void: void;
}

/** 'UpdateTrainingRecord' query type */
export interface IUpdateTrainingRecordQuery {
  params: IUpdateTrainingRecordParams;
  result: IUpdateTrainingRecordResult;
}

const updateTrainingRecordIR: any = {"usedParamSet":{"training_type":true,"notes":true,"id":true,"student_signer_address":true},"params":[{"name":"training_type","required":true,"transform":{"type":"scalar"},"locs":[{"a":43,"b":57}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":68,"b":74}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":107,"b":110}]},{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":141,"b":164}]}],"statement":"UPDATE training_record SET training_type = :training_type!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE training_record SET training_type = :training_type!, notes = :notes!, updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active'
 * ```
 */
export const updateTrainingRecord = new PreparedQuery<IUpdateTrainingRecordParams,IUpdateTrainingRecordResult>(updateTrainingRecordIR);


/** 'CompleteTrainingRecord' parameters type */
export interface ICompleteTrainingRecordParams {
  id: number;
  student_signer_address: string;
}

/** 'CompleteTrainingRecord' return type */
export interface ICompleteTrainingRecordResult {
  void: void;
}

/** 'CompleteTrainingRecord' query type */
export interface ICompleteTrainingRecordQuery {
  params: ICompleteTrainingRecordParams;
  result: ICompleteTrainingRecordResult;
}

const completeTrainingRecordIR: any = {"usedParamSet":{"id":true,"student_signer_address":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":79,"b":82}]},{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":113,"b":136}]}],"statement":"UPDATE training_record SET status = 'completed', updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE training_record SET status = 'completed', updated_at = NOW() WHERE id = :id! AND student_signer_address = :student_signer_address! AND status = 'active'
 * ```
 */
export const completeTrainingRecord = new PreparedQuery<ICompleteTrainingRecordParams,ICompleteTrainingRecordResult>(completeTrainingRecordIR);


/** 'GetAllTrainingRecords' parameters type */
export interface IGetAllTrainingRecordsParams {
  /** This query does not have any parameters. */
}

/** 'GetAllTrainingRecords' return type */
export interface IGetAllTrainingRecordsResult {
  id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  flight_log_id: number;
  aircraft_id: number;
  training_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllTrainingRecords' query type */
export interface IGetAllTrainingRecordsQuery {
  params: IGetAllTrainingRecordsParams;
  result: IGetAllTrainingRecordsResult;
}

const getAllTrainingRecordsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM training_record WHERE status = 'active' ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM training_record WHERE status = 'active' ORDER BY id DESC LIMIT 100
 * ```
 */
export const getAllTrainingRecords = new PreparedQuery<IGetAllTrainingRecordsParams,IGetAllTrainingRecordsResult>(getAllTrainingRecordsIR);


/** 'GetTrainingRecordById' parameters type */
export interface IGetTrainingRecordByIdParams {
  id: number;
}

/** 'GetTrainingRecordById' return type */
export interface IGetTrainingRecordByIdResult {
  id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  flight_log_id: number;
  aircraft_id: number;
  training_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetTrainingRecordById' query type */
export interface IGetTrainingRecordByIdQuery {
  params: IGetTrainingRecordByIdParams;
  result: IGetTrainingRecordByIdResult;
}

const getTrainingRecordByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":41,"b":44}]}],"statement":"SELECT * FROM training_record WHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM training_record WHERE id = :id!
 * ```
 */
export const getTrainingRecordById = new PreparedQuery<IGetTrainingRecordByIdParams,IGetTrainingRecordByIdResult>(getTrainingRecordByIdIR);


/** 'GetTrainingRecordsBySigner' parameters type */
export interface IGetTrainingRecordsBySignerParams {
  student_signer_address: string;
}

/** 'GetTrainingRecordsBySigner' return type */
export interface IGetTrainingRecordsBySignerResult {
  id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  flight_log_id: number;
  aircraft_id: number;
  training_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetTrainingRecordsBySigner' query type */
export interface IGetTrainingRecordsBySignerQuery {
  params: IGetTrainingRecordsBySignerParams;
  result: IGetTrainingRecordsBySignerResult;
}

const getTrainingRecordsBySignerIR: any = {"usedParamSet":{"student_signer_address":true},"params":[{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":61,"b":84}]}],"statement":"SELECT * FROM training_record WHERE student_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM training_record WHERE student_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100
 * ```
 */
export const getTrainingRecordsBySigner = new PreparedQuery<IGetTrainingRecordsBySignerParams,IGetTrainingRecordsBySignerResult>(getTrainingRecordsBySignerIR);


/** 'GetTrainingRecordsByFlight' parameters type */
export interface IGetTrainingRecordsByFlightParams {
  flight_log_id: number;
}

/** 'GetTrainingRecordsByFlight' return type */
export interface IGetTrainingRecordsByFlightResult {
  id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  flight_log_id: number;
  aircraft_id: number;
  training_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetTrainingRecordsByFlight' query type */
export interface IGetTrainingRecordsByFlightQuery {
  params: IGetTrainingRecordsByFlightParams;
  result: IGetTrainingRecordsByFlightResult;
}

const getTrainingRecordsByFlightIR: any = {"usedParamSet":{"flight_log_id":true},"params":[{"name":"flight_log_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":52,"b":66}]}],"statement":"SELECT * FROM training_record WHERE flight_log_id = :flight_log_id! ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM training_record WHERE flight_log_id = :flight_log_id! ORDER BY id DESC LIMIT 100
 * ```
 */
export const getTrainingRecordsByFlight = new PreparedQuery<IGetTrainingRecordsByFlightParams,IGetTrainingRecordsByFlightResult>(getTrainingRecordsByFlightIR);

/** 'InsertEndorsement' parameters type */
export interface IInsertEndorsementParams {
  training_record_id: number;
  student_signer_address: string;
  endorsement_type: string;
  notes: string;
  block_height: number;
}

/** 'InsertEndorsement' return type */
export interface IInsertEndorsementResult {
  id: number;
}

/** 'InsertEndorsement' query type */
export interface IInsertEndorsementQuery {
  params: IInsertEndorsementParams;
  result: IInsertEndorsementResult;
}

const insertEndorsementIR: any = {"usedParamSet":{"training_record_id":true,"student_signer_address":true,"endorsement_type":true,"notes":true,"block_height":true},"params":[{"name":"training_record_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":142,"b":161},{"a":302,"b":321}]},{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":164,"b":187}]},{"name":"endorsement_type","required":true,"transform":{"type":"scalar"},"locs":[{"a":220,"b":237}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":240,"b":246}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":249,"b":262}]}],"statement":"INSERT INTO endorsement (training_record_id, student_signer_address, instructor_signer_address, endorsement_type, notes, block_height)\nSELECT :training_record_id!, :student_signer_address!, tr.instructor_signer_address, :endorsement_type!, :notes!, :block_height!\nFROM training_record tr WHERE tr.id = :training_record_id! AND tr.status = 'active'"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO endorsement (training_record_id, student_signer_address, instructor_signer_address, endorsement_type, notes, block_height)
 * SELECT :training_record_id!, :student_signer_address!, tr.instructor_signer_address, :endorsement_type!, :notes!, :block_height!
 * FROM training_record tr WHERE tr.id = :training_record_id! AND tr.status = 'active'
 * ```
 */
export const insertEndorsement = new PreparedQuery<IInsertEndorsementParams,IInsertEndorsementResult>(insertEndorsementIR);

/** 'ApproveEndorsement' parameters type */
export interface IApproveEndorsementParams {
  id: number;
  approved_by_signer_address: string;
}

/** 'ApproveEndorsement' return type */
export interface IApproveEndorsementResult {
  id: number;
}

/** 'ApproveEndorsement' query type */
export interface IApproveEndorsementQuery {
  params: IApproveEndorsementParams;
  result: IApproveEndorsementResult;
}

const approveEndorsementIR: any = {"usedParamSet":{"approved_by_signer_address":true,"id":true},"params":[{"name":"approved_by_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":100},{"a":170,"b":197}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":136}]}],"statement":"UPDATE endorsement SET status = 'approved', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW() WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE endorsement SET status = 'approved', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW()
 * WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending'
 * ```
 */
export const approveEndorsement = new PreparedQuery<IApproveEndorsementParams,IApproveEndorsementResult>(approveEndorsementIR);

/** 'RejectEndorsement' parameters type */
export interface IRejectEndorsementParams {
  id: number;
  approved_by_signer_address: string;
}

/** 'RejectEndorsement' return type */
export interface IRejectEndorsementResult {
  id: number;
}

/** 'RejectEndorsement' query type */
export interface IRejectEndorsementQuery {
  params: IRejectEndorsementParams;
  result: IRejectEndorsementResult;
}

const rejectEndorsementIR: any = {"usedParamSet":{"approved_by_signer_address":true,"id":true},"params":[{"name":"approved_by_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":73,"b":100},{"a":170,"b":197}]},{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":133,"b":136}]}],"statement":"UPDATE endorsement SET status = 'rejected', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW() WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending'"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE endorsement SET status = 'rejected', approved_by_signer_address = :approved_by_signer_address!, updated_at = NOW()
 * WHERE id = :id! AND instructor_signer_address = :approved_by_signer_address! AND status = 'pending'
 * ```
 */
export const rejectEndorsement = new PreparedQuery<IRejectEndorsementParams,IRejectEndorsementResult>(rejectEndorsementIR);

/** 'GetAllEndorsements' parameters type */
export interface IGetAllEndorsementsParams {
  /** Filter returned query to conditions */
  __truthyValue?: any;
}

/** 'GetAllEndorsements' return type */
export interface IGetAllEndorsementsResult {
  id: number;
  training_record_id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  approved_by_signer_address: string | null;
  endorsement_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetAllEndorsements' query type */
export interface IGetAllEndorsementsQuery {
  params: IGetAllEndorsementsParams;
  result: IGetAllEndorsementsResult;
}

const getAllEndorsementsIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM endorsement ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM endorsement ORDER BY id DESC LIMIT 100
 * ```
 */
export const getAllEndorsements = new PreparedQuery<IGetAllEndorsementsParams,IGetAllEndorsementsResult>(getAllEndorsementsIR);

/** 'GetEndorsementById' parameters type */
export interface IGetEndorsementByIdParams {
  id: number;
}

/** 'GetEndorsementById' return type */
export interface IGetEndorsementByIdResult {
  id: number;
  training_record_id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  approved_by_signer_address: string | null;
  endorsement_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetEndorsementById' query type */
export interface IGetEndorsementByIdQuery {
  params: IGetEndorsementByIdParams;
  result: IGetEndorsementByIdResult;
}

const getEndorsementByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":true,"transform":{"type":"scalar"},"locs":[{"a":37,"b":40}]}],"statement":"SELECT * FROM endorsement WHERE id = :id!"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM endorsement WHERE id = :id!
 * ```
 */
export const getEndorsementById = new PreparedQuery<IGetEndorsementByIdParams,IGetEndorsementByIdResult>(getEndorsementByIdIR);

/** 'GetEndorsementsBySigner' parameters type */
export interface IGetEndorsementsBySignerParams {
  student_signer_address: string;
}

/** 'GetEndorsementsBySigner' return type */
export interface IGetEndorsementsBySignerResult {
  id: number;
  training_record_id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  approved_by_signer_address: string | null;
  endorsement_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetEndorsementsBySigner' query type */
export interface IGetEndorsementsBySignerQuery {
  params: IGetEndorsementsBySignerParams;
  result: IGetEndorsementsBySignerResult;
}

const getEndorsementsBySignerIR: any = {"usedParamSet":{"student_signer_address":true},"params":[{"name":"student_signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":80},{"a":113,"b":136}]}],"statement":"SELECT * FROM endorsement WHERE student_signer_address = :student_signer_address! OR instructor_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM endorsement WHERE student_signer_address = :student_signer_address! OR instructor_signer_address = :student_signer_address! ORDER BY id DESC LIMIT 100
 * ```
 */
export const getEndorsementsBySigner = new PreparedQuery<IGetEndorsementsBySignerParams,IGetEndorsementsBySignerResult>(getEndorsementsBySignerIR);

/** 'GetEndorsementsByTrainingRecord' parameters type */
export interface IGetEndorsementsByTrainingRecordParams {
  training_record_id: number;
}

/** 'GetEndorsementsByTrainingRecord' return type */
export interface IGetEndorsementsByTrainingRecordResult {
  id: number;
  training_record_id: number;
  student_signer_address: string;
  instructor_signer_address: string;
  approved_by_signer_address: string | null;
  endorsement_type: string;
  status: string;
  notes: string;
  created_at: Date;
  updated_at: Date;
  block_height: number;
}

/** 'GetEndorsementsByTrainingRecord' query type */
export interface IGetEndorsementsByTrainingRecordQuery {
  params: IGetEndorsementsByTrainingRecordParams;
  result: IGetEndorsementsByTrainingRecordResult;
}

const getEndorsementsByTrainingRecordIR: any = {"usedParamSet":{"training_record_id":true},"params":[{"name":"training_record_id","required":true,"transform":{"type":"scalar"},"locs":[{"a":53,"b":72}]}],"statement":"SELECT * FROM endorsement WHERE training_record_id = :training_record_id! ORDER BY id DESC LIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM endorsement WHERE training_record_id = :training_record_id! ORDER BY id DESC LIMIT 100
 * ```
 */
export const getEndorsementsByTrainingRecord = new PreparedQuery<IGetEndorsementsByTrainingRecordParams,IGetEndorsementsByTrainingRecordResult>(getEndorsementsByTrainingRecordIR);
