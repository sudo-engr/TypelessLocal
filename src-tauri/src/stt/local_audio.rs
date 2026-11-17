//! Bounded PCM input for the in-process Whisper provider.
use crate::error::AppError;

const MAX_BYTES: usize = 16_000 * 2 * 120;

#[derive(Default)]
pub struct LocalAudio {
    pcm: Vec<u8>,
}

impl LocalAudio {
    pub fn push(&mut self, chunk: &[u8]) -> Result<(), AppError> {
        if self.pcm.len().saturating_add(chunk.len()) > MAX_BYTES {
            return Err(AppError::Config(
                "Local recording exceeds 120 seconds".into(),
            ));
        }
        self.pcm.extend_from_slice(chunk);
        Ok(())
    }

    pub fn finish(&mut self) -> Result<Vec<f32>, AppError> {
        let bytes = std::mem::take(&mut self.pcm);
        if bytes.len() % 2 != 0 {
            return Err(AppError::Config("Incomplete PCM16 sample".into()));
        }
        Ok(bytes
            .chunks_exact(2)
            .map(|b| i16::from_le_bytes([b[0], b[1]]) as f32 / 32768.0)
            .collect())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn preserves_split_samples_and_normalizes_pcm() {
        let mut audio = LocalAudio::default();
        audio.push(&[0]).unwrap();
        audio.push(&[128, 255, 127, 0, 0]).unwrap();
        assert_eq!(audio.finish().unwrap(), vec![-1.0, 32767.0 / 32768.0, 0.0]);
        assert!(audio.finish().unwrap().is_empty());
    }
    #[test]
    fn rejects_partial_sample_and_clears_it() {
        let mut audio = LocalAudio::default();
        audio.push(&[1]).unwrap();
        assert!(audio.finish().is_err());
        assert!(audio.finish().unwrap().is_empty());
    }
    #[test]
    fn rejects_overflow_without_adding_the_chunk() {
        let mut audio = LocalAudio::default();
        audio.push(&vec![0; MAX_BYTES]).unwrap();
        assert!(audio.push(&[0, 0]).is_err());
        assert_eq!(audio.finish().unwrap().len(), MAX_BYTES / 2);
    }
}
