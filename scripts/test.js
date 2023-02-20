const axios = require('axios');

const getPaddedStuff = (d) => {
	const date = new Date(d);
	const year = date.getFullYear(); 
	const month = (date.getMonth() + 1 + "").padStart(2, 0); 
	const day = (date.getDate() + "").padStart(2, 0);
	return [year, month, day];
}

const getHideParkSport = async (dateRaw) => {
	const date = new Date(dateRaw);
	// const hydeParkSport = `https://hyde.parksports.co.uk/Booking/BookByDate#?date=${year}-${month}-${day}&role=guest`;
	const [year, month, day] = getPaddedStuff(dateRaw.split("-"));
	const startDate = `${year}-${month}-${day}`;
	const endDateRaw =  date.setDate(date.getDate() + 7);
	const [sYear, eMonth, eDay] = getPaddedStuff(startDate.split("-"));
	const endDate = `${sYear}-${eMonth}-${eDay}`;
	
	const hydeParkSportUrl = `https://hyde.parksports.co.uk/v0/VenueBooking/hyde_parksports_co_uk/GetVenueSessions?resourceID=5abc4055-7db8-4a93-99db-6e3bab8e8585&startDate=${startDate}&endDate=${endDate}&roleId=&_=1674078048649`;

	try {
		const { data } = await axios.get(hydeParkSportUrl);
		console.log(data.Resources.map(x => x.Days))
	} catch (e) {
		console.log("we got this error", e)
	}
};

getHideParkSport("2023-01-10")