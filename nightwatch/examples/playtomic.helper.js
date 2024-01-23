const fs = require('fs');
const path = require('path');
const moment = require('moment');

const transpose = m => m[0].map((_, i) => m.map(x => x[i]));
// IF YOU WANT TO CHANGE THE DAY FROM TODAY TO TOMORRO (and viceversa), YOU
// CAN CHANGE THE VALUE BELOW:
// TODAY -> moment().add(0, 'days')
// TOMORROW -> moment().add(1, 'days')
const day = moment().add(1, 'days');
const nameOfTheDay = day.format('ddd');

module.exports = {
	populateTsv: (location, value) => {
		const fullDay = day.format("DD/MM/YY");
		const courtTimes = Object.keys(value[1]);
		const bookedSlots = Object.values(value).map((times) => Object.values(times));
		const matrix = [
			Array(courtTimes.length).fill(fullDay),
			Array(courtTimes.length).fill(nameOfTheDay),
			courtTimes,
			...bookedSlots
		];
		const csvWithoutCourtNames = transpose(matrix).map(row => row.join("\t"));
		const csv = "\n" + csvWithoutCourtNames.join("\n");
		fs.appendFileSync(path.join(__dirname , `../../data/playtomic_${location}.tsv`), csv);
	},
	formattedDay: day.format("YYYY-MM-DD"),
}
