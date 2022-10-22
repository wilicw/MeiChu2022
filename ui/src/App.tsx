import React, { useState, useCallback } from 'react';
import './App.css';
import { Flex, Box, Text } from 'rebass';
import { ToggleButton } from '@fluentui/react-components';
import DataVisualization from './components/DataVisualization';

function App() {
  const [temp, setTemp] = useState([{ time: 0, temp: 0 }]);
  const [humidity, setHumidity] = useState([{ time: 0, humidity: 0 }]);
  const [pressure, setPressure] = useState([{ time: 0, pressure: 0 }]);
  const [speed, setSpeed] = useState([{ time: 0, speed: 0 }]);
  const [fanState, setFanState] = useState(0);

  const requestSerialPort = useCallback(() => {
    (navigator as any).serial.requestPort().then((port:any) => {
      port.open({ baudRate: 115200 }).then(() => {
        const decoder = new TextDecoderStream();
        port.readable.pipeTo(decoder.writable);
        const reader = decoder.readable.getReader();
        setInterval(() => {
          reader.read().then(({ value }) => {
            const v = value as string;
            console.log(v);
            const splitted = v.split(',', 6);
            if (splitted.length === 6) {
              // const t = parseInt(splitted[0], 10);
              setTemp((oldTemp) => [...oldTemp, {
                time: oldTemp.slice(-1)[0].time + 1,
                temp: parseInt(splitted[1], 10) / 10,
              }].slice(-10));
              setHumidity((oldHumidity) => [...oldHumidity, {
                time: oldHumidity.slice(-1)[0].time + 1,
                humidity: parseInt(splitted[2], 10) / 10,
              }].slice(-10));
              setPressure((oldPressure) => [...oldPressure, {
                time: oldPressure.slice(-1)[0].time + 1,
                pressure: parseInt(splitted[4], 10) / 10,
              }].slice(-10));
              setSpeed((oldSpeed) => [...oldSpeed, {
                time: oldSpeed.slice(-1)[0].time + 1,
                speed: parseInt(splitted[3], 10) / 10,
              }].slice(-10));
              setFanState(() => parseInt(splitted[5], 10));
            }
          }).catch((error: any) => {
            alert(error);
          });
        }, 1000);
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
        {fanState === 1 ? (
          <ToggleButton shape="rounded" style={{ margin: 10 }} disabled>Fan Flipped</ToggleButton>
        ) : (
          <ToggleButton shape="rounded" style={{ margin: 10 }}>Fan Open</ToggleButton>
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
            unit="m/s"
            data={speed}
            height={300}
          />
        </Box>
      </Flex>
    </div>
  );
}

export default App;
