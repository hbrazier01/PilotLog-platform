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
