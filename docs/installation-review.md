# Installation review record

No scanner result in this record is an APPROVE verdict. The user overrode the upstream and whisper-rs results in chat. The user also explicitly approved the incomplete native sys and CMake results in the subsequent approval question.

| Target | Score | Recommendation | Complete | Coverage |
|---|---:|---|---|---:|
| upstream | 100 | DO_NOT_INSTALL | False | 93.0% |
| whisper-rs 0.15.1 | 82 | DO_NOT_INSTALL | True | 100.0% |
| whisper-rs-sys 0.14.1 | 100 | DO_NOT_INSTALL | False | 0.0% |
| CMake 3.31.6 | 55 | DO_NOT_INSTALL | False | 0.3% |

Manual review: whisper-rs wraps an in-process native STT engine. Its build script reads native version metadata. The sys build copies bundled whisper.cpp into Cargo output, calls bindgen/CMake, and links static native libraries. The CMake wheel checksum matches PyPI metadata; its Python wrapper executes the bundled CMake executable. Static scanning cannot establish the safety of the native binaries.

Node dependencies were installed with lifecycle scripts disabled and an isolated cache. Cargo sources were fetched to an isolated cache after the default cache rejected writes. CMake 3.31.6 now runs from the reviewed temporary wheel directory under that approval. Native compilation is in progress.

New licenses: whisper-rs (Unlicense), whisper.cpp (MIT). Copies are in docs/licenses. Model licenses and provenance must be checked for the actual imported model.

shadcn/ui component source at e62c9435fff729a175f38983dee73b2cb4f6a069: scan score 0, SAFE, complete 100%; manual verdict APPROVE. Input and Card use the official source adapted to the existing theme and a local class joiner. Button uses a reduced native control pattern; unused Slot/cva variants are omitted. No shadcn CLI or new Node package was installed.
