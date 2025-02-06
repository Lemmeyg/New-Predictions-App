import { google } from 'googleapis'
import { GameWeekFixtures } from '@/types/fixtures'

export async function getGameWeekFixtures(accessToken: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set')
    }

    const sheets = google.sheets({ version: 'v4' })
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    // First, let's get the actual sheet name to verify it exists
    const spreadsheet = await sheets.spreadsheets.get({
      auth,
      spreadsheetId,
      fields: 'sheets.properties.title'
    })

    console.log('Available sheets:', spreadsheet.data.sheets?.map(sheet => sheet.properties?.title))

    // Use encodeURI to handle spaces and special characters
    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: encodeURI('GameWeek!A:F'), // Try without space first
    })

    if (!response.data.values) {
      throw new Error('No fixtures found in GameWeek sheet')
    }

    console.log('First row of data:', response.data.values[0])

    // Skip header row and transform data
    const fixtures = response.data.values.slice(1).map(row => ({
      fixtureId: row[0],
      round: row[1],
      date: row[2],
      startTime: row[3],
      homeTeam: row[4],
      awayTeam: row[5],
    }))

    return fixtures
  } catch (error) {
    console.error('Google Sheets GameWeek API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
} 