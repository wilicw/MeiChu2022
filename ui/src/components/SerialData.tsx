import React, { useState, useEffect } from 'react';
import DataRecord from './DataRecord';

interface SerialDataProps {
  getSerialData: (data: DataRecord) => void;
}

function SerialData({ getSerialData }: SerialDataProps) {
  const dataRecord = new DataRecord();
  dataRecord.key.temp = 0;
  dataRecord.key.humidity = 0;
  dataRecord.key.pressure = 0;
  dataRecord.key.speed = 0;

  const [data, setData] = useState(dataRecord);

  async function requestSerialPort() {
    const port = await (navigator as any).serial.requestPort();
    await port.open({ baudRate: 115200 });
    const decoder = new TextDecoderStream();
    port.readable.pipeTo(decoder.writable);
    const reader = decoder.readable.getReader();
    try {
      setInterval(async () => {
        const { value } = await reader.read();
        const v = value as string;
        const splitted = v.split(',', 4);
        if (splitted.length === 4) {
          data.key.temp = parseInt(splitted[0], 10);
          data.key.humidity = parseInt(splitted[1], 10);
          data.key.pressure = parseInt(splitted[2], 10);
          data.key.speed = parseInt(splitted[3], 10);
          getSerialData(data);
        }
      }, 1000);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    setData(data);
  }, [data]);

  return (
    <div>
      <button
        type="button"
        onClick={requestSerialPort}
      >
        Request Port
      </button>
    </div>
  );
}

export default SerialData;
