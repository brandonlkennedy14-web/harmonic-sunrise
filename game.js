// game.js

export class GameEngine {
    constructor() {
        this.score = 0;
        this.multiplier = 1.0;
        this.phase = 'SUNRISE'; // Phases: SUNRISE, ORBIT
        
        // Physics & Coordinates
        this.sunHeight = 0;
        this.targetSunHeight = 0;
        this.orbitMin = 0; // Set externally based on canvas height
        this.orbitMax = 0; 
        
        // Timing & Penalties
        this.lastPenaltyTime = 0;
        this.timingTolerance = 0.08; // 80ms window for a "Perfect" strike
        this.swingRatio = 0.666; // Standard triplet swing (2/3 of the beat)
    }

    setOrbitBounds(canvasHeight) {
        this.orbitMin = canvasHeight * 0.4;
        this.orbitMax = canvasHeight * 0.75;
    }

    evaluateTiming(hitTime, lastBeatTime, beatDuration, timingMode) {
        let timeSinceLastBeat = Math.abs(hitTime - lastBeatTime);
        let errorWindow = 0;

        if (timingMode === 'STANDARD') {
            // Check distance to the closest absolute downbeat
            let timeUntilNextBeat = Math.abs((lastBeatTime + beatDuration) - hitTime);
            errorWindow = Math.min(timeSinceLastBeat, timeUntilNextBeat);
        } else if (timingMode === 'ADVANCED') {
            // Check distance to downbeat, swung upbeat, or next downbeat
            let distToDownbeat = timeSinceLastBeat;
            let distToSwungUpbeat = Math.abs(timeSinceLastBeat - (beatDuration * this.swingRatio));
            let distToNextDownbeat = Math.abs((lastBeatTime + beatDuration) - hitTime);
            
            errorWindow = Math.min(distToDownbeat, distToSwungUpbeat, distToNextDownbeat);
        }

        let msOff = Math.floor(errorWindow * 1000);
        let isPerfect = errorWindow <= this.timingTolerance;

        if (isPerfect) {
            this.multiplier = Math.min(this.multiplier + 0.2, 5.0); // Cap multiplier at 5x
        } else {
            this.multiplier = 1.0; // Break the combo
        }

        return { msOff, isPerfect };
    }

    updatePhase(hasFourth, hasFifth, currentTime, timingData = null) {
        // Apply timing bonus if an interval was played
        let currentMultiplier = this.multiplier;
        let alertTrigger = null;

        // Extremely slow gravity pulling the sun down
        this.targetSunHeight -= 0.15; 

        if (this.phase === 'SUNRISE') {
            if (hasFourth) {
                this.targetSunHeight += 4;
                this.score += (1 * currentMultiplier);
            }
            
            // Penalty: Playing a 5th during Sunrise drops the sun
            if (hasFifth && !hasFourth && (currentTime - this.lastPenaltyTime > 1.0)) {
                this.score = Math.max(0, this.score - 5);
                this.targetSunHeight -= 15;
                this.lastPenaltyTime = currentTime;
                this.multiplier = 1.0;
                alertTrigger = { msg: "WRONG INTERVAL! (-5)", color: "#ff0000" };
            }

            // Phase Shift: Achieve Orbit
            if (this.sunHeight > this.orbitMin) {
                this.phase = 'ORBIT';
                alertTrigger = { msg: "ORBIT ACHIEVED!", color: "#00ff00" };
            }

        } else if (this.phase === 'ORBIT') {
            if (hasFifth) {
                this.targetSunHeight += 2;
                this.score += (2 * currentMultiplier);
            }
            
            // Penalty: Playing a 4th during Orbit crashes the sun
            if (hasFourth && !hasFifth && (currentTime - this.lastPenaltyTime > 1.0)) {
                this.score = Math.max(0, this.score - 5);
                this.targetSunHeight -= 20;
                this.lastPenaltyTime = currentTime;
                this.multiplier = 1.0;
                alertTrigger = { msg: "ORBIT DECAY! (-5)", color: "#ff0000" };
            }

            // Phase Shift: Altitude Lost
            if (this.sunHeight < this.orbitMin - 30) {
                this.phase = 'SUNRISE';
                alertTrigger = { msg: "ALTITUDE LOST!", color: "#ff8c00" };
            }

            // Phase Shift: Escape Velocity
            if (this.sunHeight > this.orbitMax) {
                this.phase = 'SUNRISE';
                this.targetSunHeight = 0;
                this.score = Math.max(0, this.score - 10);
                this.multiplier = 1.0;
                alertTrigger = { msg: "ESCAPE VELOCITY! LOST IN SPACE! (-10)", color: "#ff00ff" };
            }
        }

        // Floaty physics lerp
        if (this.targetSunHeight < 0) this.targetSunHeight = 0;
        this.sunHeight += (this.targetSunHeight - this.sunHeight) * 0.015;

        return alertTrigger;
    }
}