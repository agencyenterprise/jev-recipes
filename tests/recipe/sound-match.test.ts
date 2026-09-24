import { soundMatch } from '../../recipes/sound-match/index.js';
import { testGate } from './helpers/gate.js';

testGate(
  soundMatch,
  {
    request:
      'A warm analog-style pad with a slow attack and some gentle movement, for the intro of a downtempo track.',
    patch:
      'Preset: Dusk Pad. Two sawtooth oscillators detuned 9 cents, one octave down sub sine at -12 dB. 24 dB low-pass filter, cutoff at 35 percent with a slow envelope adding 20 percent over 2 seconds. Amp envelope: attack 1.6 s, decay 0.5 s, sustain 100 percent, release 3.2 s. Slow triangle LFO at 0.15 Hz on filter cutoff, depth 8 percent. Stereo chorus and a long hall reverb at 30 percent mix.',
  },
  ['matches', 'mismatched'],
);
