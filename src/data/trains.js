const trainTemplates = [
  { name: 'Rajdhani Express', type: 'Rajdhani', speed: 'superfast', classes: ['1A', '2A', '3A'] },
  { name: 'Shatabdi Express', type: 'Shatabdi', speed: 'superfast', classes: ['CC', 'EC'] },
  { name: 'Duronto Express', type: 'Duronto', speed: 'superfast', classes: ['1A', '2A', '3A', 'SL'] },
  { name: 'Garib Rath', type: 'GaribRath', speed: 'superfast', classes: ['3A', 'CC'] },
  { name: 'Vande Bharat', type: 'VandeBharat', speed: 'superfast', classes: ['CC', 'EC'] },
  { name: 'Humsafar Express', type: 'Humsafar', speed: 'express', classes: ['3A'] },
  { name: 'Sampark Kranti', type: 'SamparkKranti', speed: 'express', classes: ['2A', '3A', 'SL'] },
  { name: 'Jan Shatabdi', type: 'JanShatabdi', speed: 'express', classes: ['CC', '2S'] },
  { name: 'Superfast Express', type: 'Superfast', speed: 'superfast', classes: ['2A', '3A', 'SL', '2S'] },
  { name: 'Mail Express', type: 'Mail', speed: 'express', classes: ['2A', '3A', 'SL', '2S'] },
];

const classPricing = {
  '1A': { base: 2800, perKm: 4.5 },
  '2A': { base: 1600, perKm: 2.8 },
  '3A': { base: 1100, perKm: 1.8 },
  'SL': { base: 400, perKm: 0.7 },
  'CC': { base: 1400, perKm: 2.2 },
  'EC': { base: 2200, perKm: 3.5 },
  '2S': { base: 200, perKm: 0.4 },
};

const classNames = {
  '1A': 'First AC', '2A': 'Second AC', '3A': 'Third AC',
  'SL': 'Sleeper', 'CC': 'Chair Car', 'EC': 'Exec Chair', '2S': 'Second Sitting',
};

const seatsPerClass = {
  '1A': 24, '2A': 48, '3A': 72, 'SL': 72, 'CC': 78, 'EC': 56, '2S': 108,
};

function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function generateTrainNumber() {
  return String(randomInt(10000, 99999));
}

function generateTime() {
  const h = randomInt(0, 23);
  const m = randomInt(0, 3) * 15;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
}

function addMinutes(time, mins) {
  const [h, m] = time.split(':').map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  return `${String(nh).padStart(2,'0')}:${String(nm).padStart(2,'0')}`;
}

function formatDuration(mins) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h}h ${m ? m + 'm' : ''}`.trim();
}

export function generateTrains(fromCode, toCode) {
  const count = randomInt(5, 9);
  const distance = randomInt(400, 2200);
  const trains = [];

  for (let i = 0; i < count; i++) {
    const template = trainTemplates[i % trainTemplates.length];
    const deptTime = generateTime();
    const durationMins = template.speed === 'superfast' ? randomInt(240, 720) : randomInt(480, 1080);
    const arrTime = addMinutes(deptTime, durationMins);
    const daysLater = durationMins > 720 ? 1 : 0;

    const pricing = {};
    const availability = {};
    template.classes.forEach(cls => {
      const cp = classPricing[cls];
      pricing[cls] = Math.round(cp.base + cp.perKm * distance);
      const total = seatsPerClass[cls];
      availability[cls] = { total, available: randomInt(0, total) };
    });

    trains.push({
      id: `TRN${generateTrainNumber()}`,
      number: generateTrainNumber(),
      name: template.name,
      type: template.type,
      from: fromCode,
      to: toCode,
      departure: deptTime,
      arrival: arrTime,
      duration: formatDuration(durationMins),
      durationMins,
      daysLater,
      distance,
      classes: template.classes,
      pricing,
      availability,
      runsOn: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].filter(() => Math.random() > 0.2),
    });
  }

  return trains.sort((a, b) => a.departure.localeCompare(b.departure));
}

export function generateSeats(trainId, cls) {
  const total = seatsPerClass[cls] || 48;
  const cols = cls === 'SL' || cls === '3A' ? 8 : cls === '1A' ? 4 : 6;
  const rows = Math.ceil(total / cols);
  const seats = [];
  let seatNum = 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (seatNum > total) break;
      const types = ['Lower','Middle','Upper','Side Lower','Side Upper','Window','Aisle'];
      seats.push({
        id: `${cls}-${seatNum}`,
        number: seatNum,
        row: r, col: c,
        status: Math.random() > 0.35 ? 'available' : 'booked',
        type: types[c % types.length],
      });
      seatNum++;
    }
  }
  return { seats, cols, rows, className: classNames[cls] || cls };
}

export { classNames, classPricing };
