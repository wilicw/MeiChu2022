import React, { useState, useCallback } from 'react';
import './App.css';
import { Flex, Box, Text } from 'rebass';
import { ToggleButton, Slider } from '@fluentui/react-components';
import DataVisualization from './components/DataVisualization';
import IDataVisual from './interfaces/IDataVisual';

const maxX = 100;

function App() {
  const [temp, setTemp] = useState<IDataVisual[]>([]);
  const [humidity, setHumidity] = useState<IDataVisual[]>([]);
  const [pressure, setPressure] = useState<IDataVisual[]>([]);
  const [speed, setSpeed] = useState<IDataVisual[]>([]);
  const [fanState, setFanState] = useState(0);
  const [earthquakeState, setEarthquakeState] = useState(0);

  const plot = (v: string) => {
    console.log(v);
    const splitted = v.split(',', 10);
    if (splitted.length === 7) {
      // const t = parseInt(splitted[0], 10);
      setTemp((oldTemp) => [...oldTemp, {
        time: oldTemp.length ? oldTemp.slice(-1)[0].time + 1 : 0,
        temp: parseInt(splitted[1], 10) / 10,
      }].slice(-maxX));
      setHumidity((oldHumidity) => [...oldHumidity, {
        time: oldHumidity.length ? oldHumidity.slice(-1)[0].time + 1 : 0,
        humidity: parseInt(splitted[2], 10) / 10,
      }].slice(-maxX));
      setPressure((oldPressure) => [...oldPressure, {
        time: oldPressure.length ? oldPressure.slice(-1)[0].time + 1 : 0,
        pressure: parseInt(splitted[4], 10),
      }].slice(-maxX));
      setSpeed((oldSpeed) => [...oldSpeed, {
        time: oldSpeed.length ? oldSpeed.slice(-1)[0].time + 1 : 0,
        speed: parseInt(splitted[3], 10) / 10,
      }].slice(-maxX));
      setFanState(() => parseInt(splitted[5], 10));
      setEarthquakeState(() => parseInt(splitted[6], 10));
    }
  };

  const requestSerialPort = useCallback(() => {
    (navigator as any).serial.requestPort().then((port:any) => {
      port.open({ baudRate: 115200 }).then(() => {
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const reader = decoder.readable.getReader();
        let result = '';
        reader.read().then(function process({ value }) :any {
          result += value;
          const endlIdx = result.indexOf('\n');
          if (endlIdx !== -1) {
            const s = result.slice(0, endlIdx);
            plot(s);
            result = result.slice(endlIdx + 1, -1);
          }
          return reader.read().then(process);
        }).catch((error: any) => {
          alert(error);
        });
      }).catch((error: any) => {
        alert(error);
      });
    }).catch((error: any) => {
      alert(error);
    });
  }, []);

  return (
    <div className="App">
      <Flex>
        <Text style={{ margin: 5 }} p={3} fontWeight="bold">Still Discussing...</Text>
        <Box mx="auto" />
        {/* <Slider size="medium" defaultValue={100} /> */}
        {earthquakeState === 1 ? (
          <ToggleButton shape="rounded" style={{ margin: 10, backgroundColor: '#ef233c', color: 'white' }} disabled>Shaking!</ToggleButton>
        ) : (
          <ToggleButton shape="rounded" style={{ margin: 10, backgroundColor: '#55A630', color: 'white' }}>Static</ToggleButton>
        )}
        {fanState === 1 ? (
          <ToggleButton shape="rounded" style={{ margin: 10, backgroundColor: '#F77F00', color: 'white' }} disabled>Feathering</ToggleButton>
        ) : (
          <ToggleButton shape="rounded" style={{ margin: 10, backgroundColor: '#55A630', color: 'white' }}>Normal Operating</ToggleButton>
        )}
        <ToggleButton shape="rounded" style={{ margin: 10 }} appearance="primary" onClick={requestSerialPort}>
          Request Port
        </ToggleButton>
      </Flex>
      <Flex>
        <Box style={{ margin: 5 }} width={1 / 2} px={2}>
          <DataVisualization
            colors={['#28536b']}
            keys={['temp']}
            chartName="Temperature"
            unit="℃"
            data={temp}
            height={300}
          />
        </Box>
        <Box style={{ margin: 5 }} width={1 / 2} px={2}>
          <DataVisualization
            colors={['#28536b']}
            keys={['humidity']}
            chartName="Humidity"
            unit="%"
            data={humidity}
            height={300}
          />
        </Box>
      </Flex>
      <Flex>
        <Box style={{ margin: 5 }} width={1 / 2} px={2}>
          <DataVisualization
            colors={['#28536b']}
            keys={['pressure']}
            chartName="Pressure"
            unit="hPa"
            data={pressure}
            height={300}
          />
        </Box>
        <Box style={{ margin: 5 }} width={1 / 2} px={2}>
          <DataVisualization
            colors={['#28536b']}
            keys={['speed']}
            chartName="Wind Speed"
            unit=""
            data={speed}
            height={300}
          />
        </Box>
      </Flex>
    </div>
  );
}

export default App;
