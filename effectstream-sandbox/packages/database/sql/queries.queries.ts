/** Types generated for queries found in "sql/queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertFlight' parameters type */
export interface IInsertFlightParams {
  wallet_address: string;
  aircraft_ident: string;
  airport_from: string;
  airport_to: string;
  total_time: number;
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
  flight_id: number;
  wallet_address: string;
  aircraft_ident: string;
  airport_from: string;
  airport_to: string;
  total_time: string;
  created_at: Date;
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
