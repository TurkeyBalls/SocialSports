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

describe('playtomic example', function () {
	it('Search Nightwatch.js and check results', (browser) => {
		browser
			.navigateTo(`https://playtomic.io/we-are-padel-derby/f33c3aee-f075-408a-a69c-6c50309f0df2?q=PADEL~${day.format("YYYY-MM-DD")}~~~`)
			.waitForElementVisible('.bbq2__slots-resource')
			.execute(() => {
				const OPENING_HOUR = 6;
				const WIDTH = 39;

				const createAllHalfHoursSlots = () => {
					const bookedHalfedHours = {};
					for (let i = OPENING_HOUR; i < 24; i++) {
						bookedHalfedHours[("" + i).padStart(2, "0") + ":00"] = 1;
						bookedHalfedHours[("" + i).padStart(2, "0") + ":30"] = 1;
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
						takenSlots[currentCourtIndex][timeKey] = 0;

						hours = Math.floor(time + .5);
						timeKey = getTime(hours, !isHalf);
						takenSlots[currentCourtIndex][timeKey] = 0;
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
				const bookedSlots = Object.values(value).map((times) => Object.values(times));
				const matrix = [Array(courtTimes.length).fill(nameOfTheDay), courtTimes, ...bookedSlots];
				const csvWithoutCourtNames = transpose(matrix).map(row => row.join("\t"));
				const csv = "\n" + csvWithoutCourtNames.join("\n");
				fs.appendFileSync(path.join(__dirname , '../../data/playtomic_derby.tsv'), csv);
			});
	});
});