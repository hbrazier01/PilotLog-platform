import { assert } from "../helpers.ts";
import { TEST_PROFILE } from "./submit-input.test.ts";

const API_PORT = 9999;

export async function apiTest() {
  await assert("GET /api/profiles returns the previously submitted profile", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/profiles`);
    const data = await res.json();
    return (
      Array.isArray(data.profiles) &&
      data.profiles.some((r: any) => r.signer === TEST_PROFILE.signerAddress)
    );
  });
}
