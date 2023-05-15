const { populateTsv, formattedDay } = require('./playtomic.helper');

describe('playtomic example', function () {
	it('Search Nightwatch.js and check results', (browser) => {
		browser
			.navigateTo(`https://playtomic.io/we-are-padel-bristol/a47b132f-9019-45b4-9197-6f9ba09667e0?q=PADEL~${formattedDay}~~~`)
			.waitForElementVisible('.bbq2__slots-resource')
			.execute(() => {
				const hours = [...document.querySelectorAll(".bbq2__hours > .bbq2__hour")].map(x => Number(x.innerText));
				const openingTime = Math.min(...hours);
				const closingTime = Math.max(...hours) + 1;
				const WIDTH = Number(document.querySelector(".bbq2__slot").style.width.replace("px", ""));

				const createAllHalfHoursSlots = () => {
					const bookedHalfedHours = {};
					for (let i = openingTime; i < closingTime; i++) {
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
						const time = (Number(slot.style.left.replace('px', '')) / WIDTH) + openingTime;
						// the free slots box could be 1h but also 1h30 (and maybe more)
						const timeLength = Number(slot.style.width.replace('px', '') / WIDTH);
						for (let i = 0; i < timeLength; i += .5) {
							const offsetTime = time + i;
							let hours = Math.floor(offsetTime);
							let isHalf = offsetTime % 1 === .5;
							let timeKey = getTime(hours, isHalf);
							takenSlots[currentCourtIndex][timeKey] = 0;
						}
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
			}, [], ({ value }) => populateTsv('bristol_wap', value));
	});
});