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

const insertProfileIR: any = {"usedParamSet":{"signer_address":true,"display_name":true,"pilot_phase":true,"notes":true,"block_height":true},"params":[{"name":"signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":112}]},{"name":"display_name","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":128}]},{"name":"pilot_phase","required":true,"transform":{"type":"scalar"},"locs":[{"a":131,"b":143}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":146,"b":152}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":155,"b":168}]}],"statement":"INSERT INTO pilot_profile (signer_address, display_name, pilot_phase, notes, block_height)\nVALUES (:signer_address!, :display_name!, :pilot_phase!, :notes!, :block_height!)"};

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

const getProfileBySignerIR: any = {"usedParamSet":{"signer_address":true},"params":[{"name":"signer_address","required":true,"transform":{"type":"scalar"},"locs":[{"a":57,"b":72}]}],"statement":"SELECT * FROM pilot_profile\nWHERE signer_address = :signer_address!\nORDER BY id DESC\nLIMIT 1"};

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
