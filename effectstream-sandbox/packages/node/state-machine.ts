import { Stm } from "@effectstream/sm";
import type { BaseStfInput } from "@effectstream/sm";
import type { StartConfigGameStateTransitions } from "@effectstream/runtime";
import { type SyncStateUpdateStream, World } from "@effectstream/coroutine";
import {
  insertFlight,
  insertStudentRequest,
  getStudentRequest,
  insertStudentRequestHistory,
  deleteStudentRequest,
  insertCfiAvailability,
  getCfiAvailability,
  insertCfiAvailabilityHistory,
  deleteCfiAvailability,
  upsertProfile,
  createIdentity,
  getIdentityByWallet,
  getIdentityByWalletAny,
  linkWallet,
  unlinkWallet,
  upsertProfileByIdentityId,
} from "@pilotlog-sandbox/database";

/** Derive the chain string from a signer address format. */
function chainFromAddress(address: string): string {
  if (address.startsWith("0x") || address.startsWith("0X")) return "evm";
  if (address.startsWith("mn") || address.startsWith("mn_")) return "midnight";
  return "evm"; // default: Effectstream routes through EVM
}
import { grammar } from "./grammar.ts";

const stm = new Stm<typeof grammar, {}>(grammar);

stm.addStateTransition("log_flight", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const identityId = identityRows[0].identity_id;

  yield* World.resolve(insertFlight, {
    identity_id: identityId,
    aircraft_ident: parsedInput.aircraftIdent,
    airport_from: parsedInput.airportFrom,
    airport_to: parsedInput.airportTo,
    total_time: parsedInput.totalTime,
  });
});

stm.addStateTransition("create_student_request", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const identityId = identityRows[0].identity_id;

  yield* World.resolve(insertStudentRequest, {
    identity_id: identityId,
    aircraft_ident: parsedInput.aircraftIdent,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("accept_student_request", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const cfiIdentityId = identityRows[0].identity_id;

  const rows = yield* World.resolve(getStudentRequest, {
    request_id: parsedInput.requestId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`Student request ${parsedInput.requestId} not found`);
  }

  const req = rows[0];

  yield* World.resolve(insertStudentRequestHistory, {
    request_id: req.request_id,
    identity_id: req.identity_id,
    cfi_identity_id: cfiIdentityId,
    aircraft_ident: req.aircraft_ident,
    notes: req.notes,
    event: "accepted",
  });

  yield* World.resolve(deleteStudentRequest, {
    request_id: req.request_id,
  });
});

stm.addStateTransition("withdraw_student_request", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const signerIdentityId = identityRows[0].identity_id;

  const rows = yield* World.resolve(getStudentRequest, {
    request_id: parsedInput.requestId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`Student request ${parsedInput.requestId} not found`);
  }

  const req = rows[0];

  if (req.identity_id !== signerIdentityId) {
    throw new Error("Unauthorized: only the requesting student can withdraw");
  }

  yield* World.resolve(insertStudentRequestHistory, {
    request_id: req.request_id,
    identity_id: req.identity_id,
    cfi_identity_id: null,
    aircraft_ident: req.aircraft_ident,
    notes: req.notes,
    event: "withdrawn",
  });

  yield* World.resolve(deleteStudentRequest, {
    request_id: req.request_id,
  });
});

stm.addStateTransition("create_cfi_availability", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const identityId = identityRows[0].identity_id;

  yield* World.resolve(insertCfiAvailability, {
    identity_id: identityId,
    aircraft_ident: parsedInput.aircraftIdent,
    hourly_rate: parsedInput.hourlyRate,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("accept_cfi_availability", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const studentIdentityId = identityRows[0].identity_id;

  const rows = yield* World.resolve(getCfiAvailability, {
    availability_id: parsedInput.availabilityId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`CFI availability ${parsedInput.availabilityId} not found`);
  }

  const avail = rows[0];

  yield* World.resolve(insertCfiAvailabilityHistory, {
    availability_id: avail.availability_id,
    identity_id: avail.identity_id,
    student_identity_id: studentIdentityId,
    aircraft_ident: avail.aircraft_ident,
    hourly_rate: parseFloat(avail.hourly_rate),
    notes: avail.notes,
    event: "accepted",
  });

  yield* World.resolve(deleteCfiAvailability, {
    availability_id: avail.availability_id,
  });
});

stm.addStateTransition("withdraw_cfi_availability", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  const identityRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });
  if (!identityRows || identityRows.length === 0) {
    throw new Error(`No identity for signer ${signerWallet} — call create_identity first`);
  }
  const signerIdentityId = identityRows[0].identity_id;

  const rows = yield* World.resolve(getCfiAvailability, {
    availability_id: parsedInput.availabilityId,
  });

  if (!rows || rows.length === 0) {
    throw new Error(`CFI availability ${parsedInput.availabilityId} not found`);
  }

  const avail = rows[0];

  if (avail.identity_id !== signerIdentityId) {
    throw new Error("Unauthorized: only the listing CFI can withdraw");
  }

  yield* World.resolve(insertCfiAvailabilityHistory, {
    availability_id: avail.availability_id,
    identity_id: avail.identity_id,
    student_identity_id: null,
    aircraft_ident: avail.aircraft_ident,
    hourly_rate: parseFloat(avail.hourly_rate),
    notes: avail.notes,
    event: "withdrawn",
  });

  yield* World.resolve(deleteCfiAvailability, {
    availability_id: avail.availability_id,
  });
});

stm.addStateTransition("create_profile", function* (data) {
  const { parsedInput, signerAddress } = data;
  // signerAddress is set by the Effectstream runtime from the verified chain
  // transaction signer — it cannot be overridden by the caller's payload.
  // Any walletAddress field the browser might have submitted is ignored here.
  const signerWallet = signerAddress!;
  const chain = chainFromAddress(signerWallet);

  const existing = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });

  let identityId: string;
  if (existing && existing.length > 0) {
    identityId = existing[0].identity_id;
  } else {
    const created = yield* World.resolve(createIdentity, {
      primary_wallet: signerWallet,
    });
    identityId = created[0].identity_id;
    yield* World.resolve(linkWallet, {
      identity_id: identityId,
      chain,
      wallet_address: signerWallet,
      verification_status: "verified",
    });
  }

  yield* World.resolve(upsertProfileByIdentityId, {
    identity_id: identityId,
    wallet_address: signerWallet,
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("update_profile", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;
  const chain = chainFromAddress(signerWallet);

  const existing = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });

  let identityId: string;
  if (existing && existing.length > 0) {
    identityId = existing[0].identity_id;
  } else {
    const created = yield* World.resolve(createIdentity, {
      primary_wallet: signerWallet,
    });
    identityId = created[0].identity_id;
    yield* World.resolve(linkWallet, {
      identity_id: identityId,
      chain,
      wallet_address: signerWallet,
      verification_status: "verified",
    });
  }

  yield* World.resolve(upsertProfileByIdentityId, {
    identity_id: identityId,
    wallet_address: signerWallet,
    display_name: parsedInput.displayName,
    pilot_phase: parsedInput.pilotPhase,
    notes: parsedInput.notes,
  });
});

stm.addStateTransition("create_identity", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;
  // Use caller-supplied chain; if not provided, derive from address format.
  const chain = parsedInput.chain || chainFromAddress(signerWallet);

  const existing = yield* World.resolve(getIdentityByWallet, {
    wallet_address: signerWallet,
    chain,
  });

  if (existing && existing.length > 0) {
    // Identity already exists for this wallet — idempotent.
    return;
  }

  const created = yield* World.resolve(createIdentity, {
    primary_wallet: signerWallet,
  });

  yield* World.resolve(linkWallet, {
    identity_id: created[0].identity_id,
    chain,
    wallet_address: signerWallet,
    verification_status: "verified",
  });
});

stm.addStateTransition("link_wallet", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  // Verify the signer owns the identity being modified.
  const ownerRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });

  if (!ownerRows || ownerRows.length === 0) {
    throw new Error(
      `link_wallet: signer ${signerWallet} has no identity — create_identity first`,
    );
  }

  if (ownerRows[0].identity_id !== parsedInput.identityId) {
    throw new Error(
      `link_wallet: signer ${signerWallet} is not the owner of identity ${parsedInput.identityId}`,
    );
  }

  yield* World.resolve(linkWallet, {
    identity_id: parsedInput.identityId,
    chain: parsedInput.chain,
    wallet_address: parsedInput.walletAddress,
    verification_status: parsedInput.verificationStatus,
  });
});

stm.addStateTransition("unlink_wallet", function* (data) {
  const { parsedInput, signerAddress } = data;
  const signerWallet = signerAddress!;

  // Verify the signer owns the identity being modified.
  const ownerRows = yield* World.resolve(getIdentityByWalletAny, {
    wallet_address: signerWallet,
  });

  if (!ownerRows || ownerRows.length === 0) {
    throw new Error(
      `unlink_wallet: signer ${signerWallet} has no identity`,
    );
  }

  if (ownerRows[0].identity_id !== parsedInput.identityId) {
    throw new Error(
      `unlink_wallet: signer ${signerWallet} is not the owner of identity ${parsedInput.identityId}`,
    );
  }

  yield* World.resolve(unlinkWallet, {
    identity_id: parsedInput.identityId,
    chain: parsedInput.chain,
    wallet_address: parsedInput.walletAddress,
  });
});

export const gameStateTransitions: StartConfigGameStateTransitions = function* (
  _blockHeight: number,
  input: BaseStfInput,
): SyncStateUpdateStream<void> {
  yield* stm.processInput(input);
};
