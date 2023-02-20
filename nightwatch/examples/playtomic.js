const fs = require('fs');
const path = require('path');
const moment = require('moment');
const transpose = m => m[0].map((_, i) => m.map(x => x[i]));

describe('playtomic example', function () {
	it('Search Nightwatch.js and check results', (browser) => {
		const today = moment().format("YYYY-MM-DD");
		browser
			// .navigateTo(`https://playtomic.io/surge-padel-harrogate/18fda907-f989-4d40-b124-b8bf98ecbbd2?q=PADEL~${today}~~~`)
			.navigateTo(`https://playtomic.io/surge-padel-harrogate/18fda907-f989-4d40-b124-b8bf98ecbbd2?q=PADEL~2023-02-21~~~`)
			.waitForElementVisible('.bbq2__slots-resource')
			.execute(() => {
				const OPENING_HOUR = 6;
				const WIDTH = 39;

				const createAllHalfHoursSlots = () => {
					const bookedHalfedHours = {};
					for (let i = OPENING_HOUR; i < 24; i++) {
						bookedHalfedHours[("" + i).padStart(2, "0") + ":00"] = true;
						bookedHalfedHours[("" + i).padStart(2, "0") + ":30"] = true;
					}
					return bookedHalfedHours;
				}

				const getTime = (hours, isHalf) => {
					const minutes = isHalf ? '30' : '00';
					const date = new Date(`2000-12-12 ${hours}:${minutes}`);
					return (date.getHours() + "").padStart(2, "0") + ":" + (date.getMinutes() + "").padEnd(2, "0")
				}
				const courts = [...document.querySelectorAll('.bbq2__slots-resource')];
				const slotsByCourt = courts.map((court) => [...court.querySelectorAll(".bbq2__slot")]);
				const takenSlots = {};

				slotsByCourt.forEach((slots, court) => {
					const currentCourtIndex = court + 1;
					takenSlots[currentCourtIndex] = createAllHalfHoursSlots();
					slots.forEach((slot) => {
						const time = (Number(slot.style.left.replace('px', '')) / WIDTH) + OPENING_HOUR;
						let hours = Math.floor(time);
						let isHalf = time % 1 === .5;
						let timeKey = getTime(hours, isHalf);
						takenSlots[currentCourtIndex][timeKey] = false;

						hours = Math.floor(time + .5);
						timeKey = getTime(hours, !isHalf);
						takenSlots[currentCourtIndex][timeKey] = false;
					});
				});
				/**
				 *  Taken slots is like this now
				 * {
						'1': {
							'06:00': false,
							'06:30': false,
							'07:00': false,
							'07:30': false,
							'08:00': false,
							'08:30': false,
						},
						'2': {...}
					}
				 * 
				 *  */
				return takenSlots
			}, [], ({ value }) => {
				const courtTimes = Object.keys(value[1]);
				const courtNames = ["Time\\Court", "C1", "C2", "C3", "C4", "C5", "C6"];
				const bookedSlots = Object.values(value).map((times) => Object.values(times));
				const matrix = [courtTimes, ...bookedSlots];
				const csvWithoutCourtNames = transpose(matrix).map(row => row.join("\t"));
				const csv = "\n\n" + [courtNames.join("\t"), ...csvWithoutCourtNames].join("\n");
				fs.appendFileSync(path.join(__dirname , '../../data/playtomic.csv'), csv);
			});
	});
});