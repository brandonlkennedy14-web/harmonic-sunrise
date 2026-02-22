// theory.js

// --- CONSTANTS & ARRAYS ---
export const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Index mappings for the visualizer rings
export const circleOfFifths = [0, 7, 2, 9, 4, 11, 6, 1, 8, 3, 10, 5]; 
export const circleOfFourths = [0, 5, 10, 3, 8, 1, 6, 11, 4, 9, 2, 7]; 

// Dynamic color groupings (Groups of 4 notes)
export const colorPalettes = ['#ff8c00', '#00ffcc', '#ff00ff'];

export const instruments = ['NONE', 'PIANO', 'GUITAR', 'UKULELE', 'VIOLIN'];

// --- CHORD DICTIONARIES ---
export const chordDictionary = {
    'PIANO': {
        0: { lalit: "[C]  [F] [G#]", harris: "[C]  [E]  [G]  [A]" },
        2: { lalit: "[D]  [G] [A#]", harris: "[D]  [F#] [A]  [B]" },
        4: { lalit: "[E]  [A] [C]",  harris: "[E]  [G#] [B]  [C#]" },
        7: { lalit: "[G]  [C] [D#]", harris: "[G]  [B]  [D]  [E]" },
        9: { lalit: "[A]  [D] [F]",  harris: "[A]  [C#] [E]  [F#]" },
        'default': { lalit: "Root + 4th + #5", harris: "Root + 3 + 5 + 6" }
    },
    'GUITAR': { 'default': { lalit: "Play 4th\nVoicing", harris: "Play 5th\nPower/Maj" } },
    'UKULELE': { 'default': { lalit: "Root + 4th", harris: "Play 5th" } },
    'VIOLIN': { 'default': { lalit: "Double Stop\nRoot + 4th", harris: "Double Stop\nRoot + 5th" } }
};

// --- CORE MUSIC MATH ---

/**
 * Converts a raw frequency (Hz) into a standard pitch class integer (0-11)
 * 0 = C, 1 = C#, 2 = D, etc.
 */
export function hzToPitchClass(hz) { 
    if (hz < 20) return -1; 
    // Standard MIDI note formula mapped to a 12-tone octave
    let noteNum = Math.round(12 * Math.log2(hz / 440) + 69); 
    return noteNum % 12; 
}

/**
 * Returns the active UI color based on which group of 4 the root note falls into.
 */
export function getColorGroup(rootIndex) {
    if (rootIndex === -1) return '#ffffff';
    let colorGroupIndex = Math.floor(rootIndex / 4); // Will yield 0, 1, or 2
    return colorPalettes[colorGroupIndex];
}

/**
 * Evaluates an array of frequency peaks against the primary root to find interval ratios.
 */
export function detectIntervals(peaks, rootPeak) {
    let hasFourth = false;
    let hasFifth = false;
    let activePitchClasses = new Set();

    // Add the root note to the active set
    activePitchClasses.add(hzToPitchClass(rootPeak.hz));

    peaks.forEach(p => {
        let pc = hzToPitchClass(p.hz); 
        if (pc !== -1) activePitchClasses.add(pc);
        
        // Only calculate ratios for overtones (frequencies higher than the root)
        if (p.hz > rootPeak.hz) {
            let ratio = p.hz / rootPeak.hz;
            
            // Perfect 4th ratio is ~1.333
            if (Math.abs(ratio - 1.333) < 0.05) hasFourth = true;
            
            // Perfect 5th ratio is ~1.500
            if (Math.abs(ratio - 1.5) < 0.05) hasFifth = true;
        }
    });

    return { hasFourth, hasFifth, activePitchClasses };
}