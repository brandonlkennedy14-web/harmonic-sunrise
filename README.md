# 🌅 Harmonic Arcade (formerly Harmonic Sunrise)

A suite of six browser-based, interactive music theory and ear-training arcade games. Powered entirely by the Web Audio API, Harmonic Arcade listens to your real-life instrument (guitar, piano, voice) through your device's microphone to control the gameplay. 

No MIDI controllers or plugins required. Just grab your instrument and play.

## 📱 Install as an App (PWA)
Harmonic Arcade is a fully standalone Progressive Web App (PWA). You can install it directly to your home screen for a fullscreen, native app experience.
* **iOS:** Open the site in Safari, tap the `Share` icon, and select `Add to Home Screen`.
* **Android:** Open the site in Chrome. A prompt will appear at the bottom of the screen to `Install App`. (Alternatively, tap the 3-dot menu and select `Install App`).

---

## 🕹️ The Games

### 1. Harmonic Sunrise (Orbital Mechanics)
A beautiful, reactive visualizer and gravity-balancing game. 
* **Mechanic:** Play perfect 4ths to raise the sun. Play perfect 5ths to maintain orbit. Play the wrong interval, and the sun crashes into the earth or launches into deep space.

### 2. Flappy Fifths (Survival / Intervals)
A musical twist on the classic arcade survival game.
* **Easy Mode (Hover):** The screen is divided into 12 vertical lanes. Play specific pitch classes to snap your bird to the correct altitude and dodge pipes.
* **Hard Mode (Gravity):** Gravity pulls you down. To flap upward, you must play a Perfect 5th relative to the *last note you played*.

### 3. The Winding Room (Intonation / Geometry)
A physics-based intonation trainer disguised as a geometry simulation.
* **Mechanic:** Play a double-stop (two notes). The engine calculates the exact floating-point frequency ratio and fires a ball into a square arena. If your intonation is mathematically flawless, the ball will hit the corner pocket perfectly.

### 4. Harmonic Invaders (Fretboard Reaction)
Train your fretboard memorization and reaction speed.
* **Mechanic:** Asteroids fall toward your city, each labeled with a specific note. Play that exact note on your instrument to lock your laser cannon and destroy the asteroid before impact.

### 5. Constellation Weaver (Interval Math)
Master relative pitch and fretboard interval jumping.
* **Mechanic:** You start on a glowing star (e.g., "C"). The game demands an interval jump (e.g., "+ Major 3rd"). You must calculate the target note and play it to link the stars. Features a "Blind" mode to hide the target note for advanced players.

### 6. The Simon Sequence (Ear Training)
The ultimate test of pitch recognition.
* **Mechanic:** A mysterious monolith plays a sequence of notes. Listen closely, figure out the pitches, and play them back on your instrument in the exact same order. The sequence grows longer with each success.

---

## 🛠️ Technology Stack
* **HTML5 Canvas:** For all rendering, physics, and particle effects.
* **Web Audio API:** Real-time Fast Fourier Transform (FFT) for high-precision pitch and interval detection.
* **Vanilla ES6 JavaScript:** Modular, lightweight, with zero external dependencies.