import { assert } from "../helpers.ts";
import { TEST_FLIGHT } from "./submit-input.test.ts";

const API_PORT = 9999;

export async function apiTest() {
  await assert("GET /flights returns the previously submitted flight", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/flights`);
    const data = await res.json();
    return (
      Array.isArray(data.flights) &&
      data.flights.some((r: any) => r.aircraft_ident === TEST_FLIGHT.aircraftIdent)
    );
  });
}
