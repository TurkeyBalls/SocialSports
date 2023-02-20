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
 * takenSlots is Record<CourtIndex, Record<Time, boolean>>
 * e.g.
 * takenSlots = {
 * 		1: {
 * 			06:00: true,
 * 			06:30: true,
 * 			07:00: true,
 * 			07:30: false,
 * 			08:00: false,
 * 			08:30: true,
 * 			09:00: true,
 * 			09:30: false,
 * 		}
 * }
 * true -> is booked
 * false -> is NOT booked
 */ 

