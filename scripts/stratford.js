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
		bookedHalfedHours[("" + i).padStart(2, "0") + ":00"] = false;
		bookedHalfedHours[("" + i).padStart(2, "0") + ":30"] = false;
	}
	times.forEach((time) => {
		const [start, end] = time.split("-");
	
		for (let currentTime = new Date('2017-03-13 ' + start); currentTime < new Date('2017-03-13 ' + end);) {
			const timeKey = (currentTime.getHours() + "").padStart(2, "0") + ":" + (currentTime.getMinutes() + "").padEnd(2, "0"); 
			bookedHalfedHours[timeKey] = true;
			currentTime.setMinutes(currentTime.getMinutes() + 30);
		}
	});
	return bookedHalfedHours;
}

const courts = ["centre court", "court 2", "terractotta court", "court 1", "panoramic court"];
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

// TODO - convert to EXCEL
slotsByCourt.forEach((s, i) => console.log(courts[i], s))

const headers = ["Court", ...Object.keys(slotsByCourt[0])].join("\t")
const values = slotsByCourt.map((court, courtIndex) => [courts[courtIndex], ...Object.values(court)].join("\t"))

const csv = [headers, ...values].join("\n")

console.log(csv)
