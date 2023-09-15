import fs from 'fs';
import { parse, stringify } from 'csv';
import { ProgressBar } from 'ascii-progress';
import { exec } from 'child_process';

const STATIONS = {
  '3400.04': true,
  '3439.03': true,
  '3448.02': true,
  '3454.01': true,
  '3463.01': true,
  '3472.03': true,
  '3480.04': true,
  '3486.02': true,
  '3504.02': true,
  '3512.03': true,
  '3520.01': true,
  '3526.04': true,
  '3535.03': true,
  '3544.02': true,
  '3552.09': true,
  '3585.06': true,
  '3593.01': true,
  '3593.1' : true,
  '3599.01': true,
  '3608.06': true,
  '3617.02': true,
  '3625.04': true,
  '3625.07': true,
  '3633.08': true,
  '3639.04': true,
  '3648.08': true,
  '3657.06': true,
  '3665.06': true,
  '3680.04': true,
  '3696.05': true,
  '3704.01': true,
  '3710.07': true,
  '3719.02': true,
  '3728.04': true,
  '3728.05': true,
  '3736.03': true,
  '3736.04': true,
  '3742.11': true,
  '3759.07': true,
  '3768.02': true,
  '3776.05': true,
  '3782.03': true,
  '3791.02': true,
  '3822.08': true,
  '3831.03': true,
  '3839.02': true,
  '3847.04': true,
  '3853.02': true,
  '3862.07': true,
  '3871.02': true,
  '3879.04': true,
  '3887.03': true,
  '3893.03': true,
  '3902.06': true,
  '3911.05': true,
  '3919.07': true,
  '3928.08': true,
};

const stationData = {};

let filesRemaining;

function addStationToData(id, name, dateStr) {
  if (stationData[name] === undefined) {
    stationData[name] = { id, data: {}};
    stationData[name].data[dateStr] = 1;
  } else if (stationData[name].data[dateStr] === undefined) {
    stationData[name].data[dateStr] = 1;
  } else {
    stationData[name].data[dateStr] += 1;
  }
}

function randomColor() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
}

function writeCsv(stationData, dates) {
  const filename = "station_data.csv";
  const writableStream = fs.createWriteStream(filename);

  const columns = [
    'station_id',
    'station_name',
    ...dates
  ];

  const stationDataArray = Object.keys(stationData).map(stationName => {
    const station = stationData[stationName];
    return({station_id: station.id, station_name: stationName, ...station.data});
  });

  stringify(stationDataArray, { header: true, columns }, (e, o) => {
    fs.writeFileSync("output.csv", o)
  });
}

function processFiles(files) {
  const dates = [];

  Object.keys(files).forEach(file => {
    const date = /\d{6}/.exec(file)[0];
    const year= date.slice(0,4);
    const month = date.slice(4,6);
    const dateStr = `${year}-${month}`;

    dates.push(dateStr);

    const progressBar = new ProgressBar({
      schema: `[${dateStr}].bold[:bar.gradient(${randomColor()},${randomColor()})][:percent].bold`,
      total: files[file],
    });

    fs.createReadStream(file)
      .pipe(parse({ delimiter: ',', columns: true }))
      .on('data', function (row) {
        if (STATIONS[row.start_station_id]) {
          addStationToData(row.start_station_id, row.start_station_name, dateStr);
        }

        if (STATIONS[row.end_station_id]) {
          addStationToData(row.end_station_id, row.end_station_name, dateStr);
        }

        progressBar.tick();
      })
      .on('end', function() {
        filesRemaining -= 1;
        if (filesRemaining === 0) {
          writeCsv(stationData, dates);
        }
      });
  })
}

exec(`wc -l ./data/*`, (error, stdout, stderr) => {
  let total;

  const lines = stdout.split('\n').map(l => l.trim().split(' ')).filter(l => {
    if (l.length < 2) { return false}
    if (l[1] === 'total') { total = l[0]; return false }
    return true;
  });

  filesRemaining = lines.length;
  const files = {};
  lines.forEach(line => files[line[1]] = parseInt(line[0]));

  processFiles(files);
});
