# PilotLog-platform

**Status:** exploration / sandbox — **not** the production PilotLog app.

This repo is a hands-on evaluation of [Effectstream](https://github.com/effectstream/effectstream) as a possible stack for PilotLog. I recreated core PilotLog ideas here to learn how identity, app data, and Midnight-oriented flows would feel on Effectstream — not to migrate the live product.

**Live product / demo:** [PilotLog](https://github.com/hbrazier01/Pilotlog) · [pilotlog.digitalaviationpool.com](https://pilotlog.digitalaviationpool.com)

## What this is

- Spike of PilotLog concepts on Effectstream (`effectstream-sandbox/`)
- Written notes and experiments around Midnight-oriented pilot identity
- A place to answer stack-fit questions before committing production work

## What this is not

- Not a second PilotLog product
- Not a production deployment or migration target
- Not a complete Effectstream tutorial

## Concrete finding

For Midnight-oriented identity in this exploration, **chain-verified `signerAddress` (Midnight bech32m) is the identity primitive to trust** — not browser-supplied wallet display fields. That clarified how auth should be framed if PilotLog ever sits on this stack.

## Layout

| Path | Role |
|------|------|
| `effectstream-sandbox/` | Effectstream recreation / evaluation work |
| `README.md` | This note |

## Related public work

- Production-facing PilotLog: https://github.com/hbrazier01/Pilotlog
- Security ship + follow-through: [PR #4](https://github.com/hbrazier01/Pilotlog/pull/4), [Issue #5](https://github.com/hbrazier01/Pilotlog/issues/5)
