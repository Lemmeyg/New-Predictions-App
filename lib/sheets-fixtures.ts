import { google } from 'googleapis';
import type { FootballFixture } from './football-api';

async function getSheetId(sheets: any, spreadsheetId: string, sheetName: string, auth: any) {
  const response = await sheets.spreadsheets.get({
    auth,
    spreadsheetId,
    fields: 'sheets.properties'
  });

  const sheet = response.data.sheets.find(
    (s: any) => s.properties.title === sheetName
  );

  if (!sheet) {
    throw new Error(`Sheet "${sheetName}" not found`);
  }

  return sheet.properties.sheetId;
}

export async function updateFixturesSheet(fixtures: FootballFixture[], accessToken: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID;
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set');
    }

    const sheets = google.sheets({ version: 'v4' });
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    // Clear existing fixtures
    await sheets.spreadsheets.values.clear({
      auth: oauth2Client,
      spreadsheetId,
      range: 'Fixtures!A2:J',
    });

    // Prepare the values to insert
    const values = fixtures.map(fixture => {
      const score = fixture.homeTeamScore !== null && fixture.awayTeamScore !== null
        ? `${fixture.homeTeamScore}-${fixture.awayTeamScore}`
        : '';

      // Format date as MM/DD/YYYY
      const [year, month, day] = fixture.date.split('-');
      const formattedDate = `${month}/${day}/${year}`;

      return [
        fixture.fixtureId,
        formattedDate,
        fixture.startTime,
        fixture.round,
        fixture.homeTeam,
        fixture.awayTeam,
        fixture.homeTeamScore,
        fixture.awayTeamScore,
        fixture.status,
        score,
      ];
    });

    // First, update the headers
    await sheets.spreadsheets.values.update({
      auth: oauth2Client,
      spreadsheetId,
      range: 'Fixtures!A1:J1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          'fixtureId',
          'Date',
          'startTime',
          'round',
          'homeTeam',
          'awayTeam',
          'homeTeamScore',
          'awayTeamScore',
          'status',
          'Score',
        ]],
      },
    });

    // Insert the fixture data
    await sheets.spreadsheets.values.update({
      auth: oauth2Client,
      spreadsheetId,
      range: 'Fixtures!A2',
      valueInputOption: 'USER_ENTERED', // Changed to USER_ENTERED to handle date formatting
      requestBody: {
        values,
      },
    });

    // Get the correct sheet ID
    console.log('Fetching sheet ID for Fixtures sheet...');
    const sheetId = await getSheetId(sheets, spreadsheetId, 'Fixtures', oauth2Client);
    console.log('Found sheet ID:', sheetId);

    // Apply date formatting to the Date column
    await sheets.spreadsheets.batchUpdate({
      auth: oauth2Client,
      spreadsheetId,
      requestBody: {
        requests: [{
          repeatCell: {
            range: {
              sheetId: sheetId,
              startRowIndex: 1, // Skip header row
              endRowIndex: values.length + 1,
              startColumnIndex: 1, // Column B (Date)
              endColumnIndex: 2,
            },
            cell: {
              userEnteredFormat: {
                numberFormat: {
                  type: 'DATE',
                  pattern: 'MM/dd/yyyy'
                }
              }
            },
            fields: 'userEnteredFormat.numberFormat'
          }
        }]
      }
    });

    console.log('Fixtures sheet updated successfully:', {
      fixturesCount: fixtures.length,
      sheetName: 'Fixtures',
      columnsCount: 10,
      sheetId
    });

    return true;
  } catch (error) {
    console.error('Error updating fixtures sheet:', error);
    throw error;
  }
} 