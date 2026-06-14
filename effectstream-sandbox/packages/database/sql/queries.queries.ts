/** Types generated for queries found in "sql/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertProfile' parameters type */
export interface IInsertProfileParams {
  block_height: number;
  display_name: string;
  notes: string;
  pilot_phase: string;
  signer: string;
}

/** 'InsertProfile' return type */
export type IInsertProfileResult = void;

/** 'InsertProfile' query type */
export interface IInsertProfileQuery {
  params: IInsertProfileParams;
  result: IInsertProfileResult;
}

const insertProfileIR: any = {"usedParamSet":{"signer":true,"display_name":true,"pilot_phase":true,"notes":true,"block_height":true},"params":[{"name":"signer","required":true,"transform":{"type":"scalar"},"locs":[{"a":89,"b":96}]},{"name":"display_name","required":true,"transform":{"type":"scalar"},"locs":[{"a":99,"b":112}]},{"name":"pilot_phase","required":true,"transform":{"type":"scalar"},"locs":[{"a":115,"b":127}]},{"name":"notes","required":true,"transform":{"type":"scalar"},"locs":[{"a":130,"b":136}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":139,"b":152}]}],"statement":"INSERT INTO profile_log (signer, display_name, pilot_phase, notes, block_height)\nVALUES (:signer!, :display_name!, :pilot_phase!, :notes!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO profile_log (signer, display_name, pilot_phase, notes, block_height)
 * VALUES (:signer!, :display_name!, :pilot_phase!, :notes!, :block_height!)
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
  signer: string;
}

/** 'GetAllProfiles' query type */
export interface IGetAllProfilesQuery {
  params: IGetAllProfilesParams;
  result: IGetAllProfilesResult;
}

const getAllProfilesIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT * FROM profile_log\nORDER BY id DESC\nLIMIT 100"};

/**
 * Query generated from SQL:
 * ```
 * SELECT * FROM profile_log
 * ORDER BY id DESC
 * LIMIT 100
 * ```
 */
export const getAllProfiles = new PreparedQuery<IGetAllProfilesParams,IGetAllProfilesResult>(getAllProfilesIR);


