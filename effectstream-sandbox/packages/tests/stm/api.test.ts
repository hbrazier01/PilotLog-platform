import { assert } from "../helpers.ts";
import { TEST_PROFILE } from "./submit-input.test.ts";

const API_PORT = 9999;

export async function apiTest() {
  await assert("GET /api/profiles returns the previously submitted profile", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/profiles`);
    const data = await res.json();
    return (
      Array.isArray(data.profiles) &&
      data.profiles.some((r: any) => r.signer_address === TEST_PROFILE.signerAddress)
    );
  });

  await assert("GET /api/profile/:signer returns profile for signer_address", async () => {
    const res = await fetch(`http://localhost:${API_PORT}/api/profile/${TEST_PROFILE.signerAddress}`);
    if (!res.ok) return false;
    const data = await res.json();
    return (
      data.profile &&
      data.profile.signer_address === TEST_PROFILE.signerAddress &&
      data.profile.display_name === TEST_PROFILE.displayName
    );
  });
}
