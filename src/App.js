import React, { useRef } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';

import { VictoryBar, VictoryChart } from  'victory';

import { Synth, Transport, Sequence } from 'tone';

const NO_OF_OCTAVES = 4;
const PITCH_SPACE_SIZE = NO_OF_OCTAVES * 12;
const INITIAL_OCTAVE = 2;

const DATA = [
    [0, 4.84],
    [1, 5.21],
    [2, 5.43],
    [3, 5.88],
    [4, 6.04],
    [5, 6.34],
    [6, 6.87],
    [7, 7.35],
    [8, 8.14],
    [9, 9.55],
    [10, 10.75],
    [11, 9.12],
    [12, 8.45],
    [13, 7.23],
    [14, 6.01],
    [15, 5.45],
    [16, 4.78],
    [17, 3.21],
    [18, 2.44],
    [19, 1.11],
    [20, 0.45]
]

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



function GraphContainer() {
    const synth = useRef(new Synth().toMaster());
    const handlePlay = (evt) =>{
        synth.current.sync();
        let pitchArray = createPitchArray(DATA);
        let sequence = new Sequence(function(time, pitch) {
            synth.current.triggerAttackRelease(pitch)
        }, pitchArray, "8n");
        sequence.loop = false;
        sequence.start(0);
        Transport.start();
    }
    return (
        <>
            <VictoryChart>
                <VictoryBar data={DATA} x={0} y={1}>
                </VictoryBar>
            </VictoryChart>
            <Button onClick={handlePlay}>
                Play
            </Button>
        </>
    );
}


function App() {
    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Navbar.Brand>
                  {'Victory Sonification'}
                </Navbar.Brand>
            </Navbar>
            <Container>
                <Row>
                    <Col>
                        <GraphContainer/>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default App;
