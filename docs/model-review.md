# Whisper model preparation

Model: large-v3-turbo Q5_0, 574,041,195 bytes.
Source: https://huggingface.co/ggerganov/whisper.cpp/tree/5359861c739e955e79d9a303bcbc70fb988958b1
File: models/ggml-large-v3-turbo-q5_0.bin
SHA256: 394221709cd5ad1f40c46e6031ca61bce88931e6e088c188294c6d5a55ffa7e2

The downloaded size and SHA256 match the publisher's LFS metadata. The GGML header has 128 mel bins, 32 encoder layers, and 4 decoder layers, consistent with large-v3-turbo.

SkillSpector scan: 8/100, LOW, CAUTION. Analysis is partial, coverage 0%, because the binary and total size exceed the analyzer limits. YARA detected the vocabulary word `fierce` as a network reconnaissance tool name. The surrounding bytes are multilingual model vocabulary. This is not proof of executable behavior, but the scan does not establish model safety.

Manual verdict: CAUTION due to unsupported binary analysis. Model path and verified SHA256 are entered in the running application. The user explicitly approved activation after the scan result. The application displays the registered large-v3-turbo model, enables Next, and persisted local-model.json with the matching path and SHA256. No microphone recording was started.
