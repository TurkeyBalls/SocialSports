const fs = require('fs');
const path = require('path');
const moment = require('moment');

const transpose = m => m[0].map((_, i) => m.map(x => x[i]));

describe('playtomic example', function () {
	it('Search Nightwatch.js and check results', (browser) => {
		browser
			.navigateTo('https://stratfordpadelclub.matchpoint.com.es/Booking/Grid.aspx')
			.waitForElementVisible('#tablaReserva')
			.pause(2_000)
			.execute(() => {
				const columns = {};

				const data = [...document.getElementById("tablaReserva").querySelectorAll("g[id^=event]")]

				data.forEach(event => {
					const col = event.querySelector("rect").getAttribute("x");
					if (!columns[col]) columns[col] = [];
					columns[col].push(event.querySelector("g > text").innerHTML);
				});

				const getBookedHalfHourSlotsForArray = (times) => {
					// initialise slots
					const bookedHalfedHours = {};
					for (let i = 10; i < 23; i++) {
						bookedHalfedHours[("" + i).padStart(2, "0") + ":00"] = 0;
						bookedHalfedHours[("" + i).padStart(2, "0") + ":30"] = 0;
					}
					times.forEach((time) => {
						const [start, end] = time.split("-");
					
						for (let currentTime = new Date('2017-03-13 ' + start); currentTime < new Date('2017-03-13 ' + end);) {
							const timeKey = (currentTime.getHours() + "").padStart(2, "0") + ":" + (currentTime.getMinutes() + "").padEnd(2, "0"); 
							bookedHalfedHours[timeKey] = 1;
							currentTime.setMinutes(currentTime.getMinutes() + 30);
						}
					});
					return bookedHalfedHours;
				}

				const slotsByCourt = Object.keys(columns).sort().map(key => getBookedHalfHourSlotsForArray(columns[key]));
				/**
				 * slotsByCourt is an array where the index equivalent is the court name. Inside, is an object <{ time: boolean }>
				 * ex:
				 * slotsByCourt = [
				 * 		{
				 * 			13:30: true,
				 * 			14:00: true,
				 * 			14:30: true,
				 * 			15:00: false,
				 * 		}
				 * ]
				 * true -> is booked
				 * false -> is NOT booked
				 */

				return slotsByCourt;
			}, [], ({ value }) => {
				const courtsNames = ["centre court", "court 2", "terracotta court", "court 1", "panoramic court"];
				const courtTimes = ["Time\\Court", ...Object.keys(value[0])];
				const bookedSlots = value.map((court, courtIndex) => [courtsNames[courtIndex], ...Object.values(court)]);
				const matrix = [['Day', ...Array(courtTimes.length - 1).fill(moment().format("ddd"))], courtTimes, ...bookedSlots];
				const today = moment().format("YYYY-MM-DD");
				const csv = "\n\n" + [today, ...transpose(matrix).map(row => row.join("\t"))].join("\n");
				fs.appendFileSync(path.join(__dirname , '../../data/stratford.tsv'), csv);
			});
	});
});