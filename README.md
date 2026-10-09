# New System candidate

Not connected to the live application. Not a finished product.

This bench defines a job, saves the revision, and asks Store Zero. It does not pick the stock, it does not price the job, and it does not cut it.

The Store it was checked against is GeorgePlattDemo/store-zero at `d0c15fcd70b4357c8fa61d5505b95ec68cea8e65`. That commit is an inspected baseline, not an approved production release. A later Store release has to be written down and the HTTP checks run again.

Open a library job. Save it. Ask the Store. Accept a simulated offer once. A second accept does not create a second event. Come back to the saved file and the old price is history, not a current quote.

Machine lowering, virtual motion, physical commands, payment, and reservation are blocked on purpose. See [docs/HANDOFF.md](docs/HANDOFF.md) and [docs/REQUIREMENT-MATRIX.md](docs/REQUIREMENT-MATRIX.md).

The live System, the old Store, and Program are not imported and were not edited.
