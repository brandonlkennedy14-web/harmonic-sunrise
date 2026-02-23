evaluateTiming(hitTime, lastBeatTime, beatDuration, timingMode) {
        let timeSinceLastBeat = Math.abs(hitTime - lastBeatTime);
        let errorWindow = 0;

        if (timingMode === 'STANDARD') {
            // Straight 4/4: Check distance to the closest absolute downbeat
            let timeUntilNextBeat = Math.abs((lastBeatTime + beatDuration) - hitTime);
            errorWindow = Math.min(timeSinceLastBeat, timeUntilNextBeat);
        } else if (timingMode === 'ADVANCED') {
            // Swung 4/4: Check distance to downbeat, swung upbeat (66%), or next downbeat
            let distToDownbeat = timeSinceLastBeat;
            
            // The "Swing" pocket is exactly 2/3rds of the way through the beat duration
            let swingPocket = beatDuration * 0.666; 
            let distToSwungUpbeat = Math.abs(timeSinceLastBeat - swingPocket);
            
            let distToNextDownbeat = Math.abs((lastBeatTime + beatDuration) - hitTime);
            
            // Grade based on the closest valid rhythm node
            errorWindow = Math.min(distToDownbeat, distToSwungUpbeat, distToNextDownbeat);
        }

        let msOff = Math.floor(errorWindow * 1000);
        let isPerfect = errorWindow <= this.timingTolerance;

        // Apply scoring/multiplier logic based on accuracy
        if (isPerfect) {
            this.multiplier = Math.min(this.multiplier + 0.2, 5.0); 
        } else {
            this.multiplier = 1.0; 
        }

        return { msOff, isPerfect };
    }