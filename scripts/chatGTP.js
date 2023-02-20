const request = require('request');
const cheerio = require('cheerio');
const excel = require('excel4node');

const url = 'https://www.matchi.se/facilities/game4padeledinburghpark';

// Create a new workbook and add a worksheet
const workbook = new excel.Workbook();
const worksheet = workbook.addWorksheet('Slots');

// Define the headers for the worksheet
worksheet.cell(1, 1).string('Time');
worksheet.cell(1, 2).string('Price');
worksheet.cell(1, 3).string('Status');
worksheet.cell(1, 4).string('Booked');
worksheet.cell(1, 5).string('Total');

request(url, (error, response, html) => {
    if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        let row = 2;

        $('.bookingslot').each((i, el) => {
            const time = $(el).find('.time span').text();
            const price = $(el).find('.price span').text();
            const status = $(el).find('.status span').text();
            const booked = $(el).find('.booked span').text();
            const total = $(el).find('.total span').text();

            worksheet.cell(row, 1).string(time);
            worksheet.cell(row, 2).string(price);
            worksheet.cell(row, 3).string(status);
            worksheet.cell(row, 4).string(booked);
            worksheet.cell(row, 5).string(total);

            // Add background color to indicate the amount of slots still available
            if (status === 'Fully booked') {
                worksheet.cell(row, 1, row, 5).style({ fill: '#ff0000' });
            } else if (status === 'Available') {
                worksheet.cell(row, 1, row, 5).style({ fill: '#00ff00' });
            } else {
                const percentage = (parseInt(booked) / parseInt(total)) * 100;
                if (percentage >= 75) {
                    worksheet.cell(row, 1, row, 5).style({ fill: '#ff6666' });
                } else if (percentage >= 50) {
                    worksheet.cell(row, 1, row, 5).style({ fill: '#ffb366' });
                } else if (percentage >= 25) {
                    worksheet.cell(row, 1, row, 5).style({ fill: '#ffff66' });
                } else {
                    worksheet.cell(row, 1, row, 5).style({ fill: '#b3ff66' });
                }
            }
            row++;
        });

        // Save the workbook to an Excel file
        workbook.write('Slots.xlsx');
        console.log('Excel file successfully generated.');
    } else {
        console.log(`Error fetching the webpage: ${error}`);
    }
});

