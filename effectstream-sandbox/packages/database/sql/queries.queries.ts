/** Types generated for queries found in "sql/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertProfile' parameters type */
export interface IInsertProfileParams {
  signer: string;
  display_name: string;
  pilot_phase: string;
  block_height: number;
}

/** 'InsertProfile' return type */
export type IInsertProfileResult = void;

/** 'InsertProfile' query type */
export interface IInsertProfileQuery {
  params: IInsertProfileParams;
  result: IInsertProfileResult;
}

const insertProfileIR: any = {"usedParamSet":{"signer":true,"display_name":true,"pilot_phase":true,"block_height":true},"params":[{"name":"signer","required":true,"transform":{"type":"scalar"},"locs":[{"a":71,"b":78}]},{"name":"display_name","required":true,"transform":{"type":"scalar"},"locs":[{"a":81,"b":94}]},{"name":"pilot_phase","required":true,"transform":{"type":"scalar"},"locs":[{"a":97,"b":109}]},{"name":"block_height","required":true,"transform":{"type":"scalar"},"locs":[{"a":112,"b":125}]}],"statement":"INSERT INTO profile_log (signer, display_name, pilot_phase, block_height)\nVALUES (:signer!, :display_name!, :pilot_phase!, :block_height!)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO profile_log (signer, display_name, pilot_phase, block_height)
 * VALUES (:signer!, :display_name!, :pilot_phase!, :block_height!)
 * ```
 */
export const insertProfile = new PreparedQuery<IInsertProfileParams,IInsertProfileResult>(insertProfileIR);


/** 'GetAllProfiles' parameters type */
export type IGetAllProfilesParams = void;

/** 'GetAllProfiles' return type */
export interface IGetAllProfilesResult {
  id: number;
  signer: string;
  display_name: string;
  pilot_phase: string;
  block_height: number;
  created_at: Date;
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
