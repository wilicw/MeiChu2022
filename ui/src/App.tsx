import React, { useState, useEffect } from 'react';
import './App.css';
// import SerialData from './components/SerialData';
import DataVisualization from './components/DataVisualization';
import DataRecord from './components/DataRecord';

function App() {
  const [temp, setTemp] = useState([{ time: 0, temp: 0 }]);
  const [humidity, setHumidity] = useState([{ time: 0, humidity: 0 }]);
  const [pressure, setPressure] = useState([{ time: 0, pressure: 0 }]);
  const [speed, setSpeed] = useState([{ time: 0, speed: 0 }]);
  const [t, setTime] = useState(0);

  const dataRecord = new DataRecord();
  dataRecord.key.temp = 0;
  dataRecord.key.humidity = 0;
  dataRecord.key.pressure = 0;
  dataRecord.key.speed = 0;
  const [data, setData] = useState(dataRecord);

  // async function requestSerialPort() {
  //   (navigator as any).serial.requestPort().then((port:any) => {
  //     port.open({ baudRate: 115200 }).then(() => {
  //       const decoder = new TextDecoderStream();
  //       port.readable.pipeTo(decoder.writable);
  //       const reader = decoder.readable.getReader();
  //       reader.read().then(({ value }) => {
  //         const v = value as string;
  //         const splitted = v.split(',', 4);
  //         if (splitted.length === 4) {
  //           data.key.temp = parseInt(splitted[0], 10);
  //           data.key.humidity = parseInt(splitted[1], 10);
  //           data.key.pressure = parseInt(splitted[2], 10);
  //           data.key.speed = parseInt(splitted[3], 10);
  //           setData(data);
  //           setTime(t + 1);
  //           console.log(data, t);
  //         }
  //       });
  //     });
  //   });
  // }

  async function requestSerialPort() {
    const port = await (navigator as any).serial.requestPort();
    await port.open({ baudRate: 115200 });
  }

  useEffect(() => {
    console.log(data, t);
    temp.push({
      time: t,
      temp: data.key.temp,
    });
    setTemp(temp);
    humidity.push({
      time: t,
      humidity: data.key.humidity,
    });
    setHumidity(humidity);
    pressure.push({
      time: t,
      pressure: data.key.pressure,
    });
    setPressure(pressure);
    speed.push({
      time: t,
      speed: data.key.speed,
    });
    setSpeed(speed);
  }, [data, t]);

  return (
    <div className="App">
      {/* <SerialData getSerialData={getSerialData} /> */}
      <button
        type="button"
        onClick={requestSerialPort}
      >
        Request Port
      </button>
      <DataVisualization
        colors={['#28536b']}
        keys={['temp']}
        chartName="Temperature"
        unit="℃"
        data={temp}
        height={300}
      />
      <DataVisualization
        colors={['#28536b']}
        keys={['humidity']}
        chartName="Humidity"
        unit="%"
        data={humidity}
        height={300}
      />
      <DataVisualization
        colors={['#28536b']}
        keys={['pressure']}
        chartName="Pressure"
        unit="c"
        data={pressure}
        height={300}
      />
      <DataVisualization
        colors={['#28536b']}
        keys={['speed']}
        chartName="Wind Speed"
        unit="c"
        data={speed}
        height={300}
      />
    </div>
  );
}

export default App;
