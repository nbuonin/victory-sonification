import React, { useState, useRef, useEffect } from 'react';
//import { Synth, Transport, Sequence } from 'tone';
import * as Tone from 'tone';

import { SonifierProps } from "./Sonifier.types";

const NO_OF_OCTAVES = 4;
const PITCH_SPACE_SIZE = NO_OF_OCTAVES * 12;
const INITIAL_OCTAVE = 2;

const lookupPitch = (pitchIndex) => {
    switch (pitchIndex) {
        case 0:
            return 'C';
        case 1:
            return 'C#';
        case 2:
            return 'D';
        case 3:
            return 'D#';
        case 4:
            return 'E';
        case 5:
            return 'F';
        case 6:
            return 'F#';
        case 7:
            return 'G';
        case 8:
            return 'G#';
        case 9:
            return 'A';
        case 10:
            return 'A#';
        case 11:
            return 'B';
        default:
            throw new Error('Out of range pitch: ' + pitchIndex + ' passed in.');
    }
}

const getBinnedValues = (values, nBins, binSize, initVal) => {
    /* @values  an array of the values to bin
       @nBins   number of bins
       @binSize the size of each bin
       @initVal the minimum value in the array */

    // Map over the list of values and replace with the bin index
    // it should be placed into
    return values.reduce((acc, val) => {
        let idx = Math.floor((val - initVal) / binSize);
        // We want the range to be inclusive of the max value,
        // i.e.: when the max value is binned we want it to go in the
        // preceding bin, not into a new bin.
        if (idx >= 0 && idx < nBins) {
            acc.push(idx);
        }
        return acc;
    }, []);
};

const createPitchArray = (array) => {
    let values = array.map((el) => el[1]);
    let max = Math.max(...values);
    let min = Math.min(...values);
    let bin_size = (max - min) / PITCH_SPACE_SIZE;

    let binnedValues = getBinnedValues(values, PITCH_SPACE_SIZE, bin_size, min);
    let pitches = binnedValues.map((el) => {
        let octave = String(Math.floor(el / 12) + INITIAL_OCTAVE);
        let pitchIndex = el % 12;
        let pitch = lookupPitch(pitchIndex);
        return pitch + octave;
    });
    return pitches;
}

const withSonification = <T extends object>(Component: React.ComponentType<T>): React.FC<T> => {
    return (props: T & {children?: React.ReactElement}) => {
        const compType = Object.getPrototypeOf(props.children.type);

        const transport = useRef(Tone.Transport);
        const synth = useRef(new Tone.Synth().toDestination());

        const [isPlaying, setIsPlaying] = useState<boolean>(false);

        useEffect(() => {
            transport.current.on('start', () => {
                setIsPlaying(true);
            });
            transport.current.on('stop', () => {
                setIsPlaying(false);
            });

        }, [])

        const handlePlay: React.MouseEventHandler = (e) => {
            // TODO: Resolve console error with scheduling sequence time
            // This handles two states of the transport: 'started' and 'stoppped'
            if (transport.current.state === 'started') {
               transport.current.stop();
            } else {
                let pitchArray = createPitchArray(compType.getData(props.children.props));
                let sequence = new Tone.Sequence(function(time, pitch) {
                    synth.current.triggerAttackRelease(pitch, '8n', time)
                }, pitchArray, "8n");
                sequence.loop = false;
                sequence.start(0);
                const sequenceLength = pitchArray.reduce((acc, val) => {
                    acc += Tone.Time('8n').toSeconds();
                    return acc;
                }, 0)

                // Start the transport and schedule it
                // to end when the sequence ends
                transport.current.start();
                transport.current.stop('+' + String(sequenceLength));
            }
        }

        return (
            <>
                <Component {...props}/>
                <button onClick={handlePlay}>
                    {isPlaying ? 'Stop' : 'Play'}
                </button>
            </>
        )
    }
}

export default withSonification;
