# Scan-to-Build

The five-job shell in `public/live/` is the front door. The generic library at `/bench` is an internal test bench, not a substitute for those jobs.

System defines a job. Store evaluates it. System does not price, and it does not invent a canonical hash other than the Store's `calculationHash`, used only to check a receipt or a demand the Store already hashed.

## Boundaries

- Physical release stays false. Physical admission stays blocked. No payment, reservation, or production release.
- Do not convert an unknown or malformed saved-record version into the current schema.
- Do not strip a supplied `endIdentity`. A board whose length datum is already `long-long-outer-edge` does not send a second end-identity string. That is a reconciliation, not a deletion.
- A material and machine quote is not the whole job. A required end fact the Store did not evaluate stays on the job, and the job is not presented as fully supportable. Machine admission stays blocked. A recorded specimen is history: it does not price the job, complete it, or open acceptance.
- Do not clone the Store machine engine. Virtual evidence comes from `POST /v1/machine-evidence` on the pinned Store commit, or it is not evidence.
- Space utilization keeps the extra spot on a part the person picks. That job is not answered until its own Store question is.

## Store pin

`STORE_CANDIDATE.inspectedCommit` in `src/system/store-candidate.ts` is the only Store commit this application asks. Change it only by recording the new commit and rerunning the joint test against a checkout whose `git rev-parse HEAD` is that commit. Do not label whichever process happens to be running.

## Verification

`npm test` is the required verification. It runs the repository checks, the System tests, and the HTTP joint test. The joint test refuses to start unless `STORE_ZERO_ROOT` is a git checkout of the pinned commit. CI checks that Store out at the pin and sets `STORE_ZERO_ROOT`.

Do not restore a brand skill, an untracked env file, or a retired folder to make a test pass. Accounts stay off when no env file is present. A Store process may advertise a commit only after that checkout's HEAD was read and matched. A local process is not a deployed Store.
