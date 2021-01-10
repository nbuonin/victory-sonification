import React from "react";
import withSonification from './Sonifier';
import { VictoryBar, VictoryChart } from 'victory';

export default {
    title: "Sonifier Example"
};

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

export const Primary = () => {
    const SonifiedVictoryChart = withSonification(VictoryChart)
    return (
        <SonifiedVictoryChart>
            <VictoryBar data={DATA} x={0} y={1}>
            </VictoryBar>
        </SonifiedVictoryChart>
    );
};
