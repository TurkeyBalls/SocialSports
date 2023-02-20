const axios = require('axios');
const excel = require('excel4node');
const moment = require('moment');

const date = process.argv[2];
const apiUrl = `https://hyde.parksports.co.uk/v0/VenueBooking/hyde_parksports_co_uk/GetVenueSessions?startDate=${date}&endDate=${date}`;

// Create a new workbook and add a worksheet
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Slots');

// Define the headers for the worksheet
worksheet.cell(1, 1).string('Time');
worksheet.cell(1, 2).string('Name');
worksheet.cell(1, 3).string('Category');
worksheet.cell(1, 4).string('Cost');

axios.get(apiUrl)
    .then(response => {
        let row = 2;
        const data = response.data;
        const resources = data.Resources;

        resources.forEach((resource) => {
            resource.Days.forEach((day) => {
                day.Sessions.forEach((session) => {
                    const time = moment().startOf('day').seconds(session.StartTime).format('HH:mm');
                    const name = session.Name;
                    const category = session.Category;
                    const cost = session.Cost;

                    worksheet.cell(row, 1).string(time);
                    worksheet.cell(row, 2).string(name);
                    worksheet.cell(row, 3).string(category);
                    worksheet.cell(row, 4).string(cost);
                    row++;
                });
            });
        });
        // Save the workbook to an Excel file
        workbook.write('Slots.xlsx');
        console.log('Excel file successfully generated.');
    }).catch(error => {
        console.log(`Error fetching the data: ${error}`);
    });
