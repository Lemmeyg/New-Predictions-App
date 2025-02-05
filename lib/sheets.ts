import { google } from 'googleapis'

export async function getLeaderboardData(accessToken: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set')
    }

    const sheets = google.sheets({ version: 'v4' })
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Table!A1:D7',
    })

    if (!response.data.values) {
      throw new Error('No data found in spreadsheet')
    }

    return response.data.values
  } catch (error) {
    console.error('Error fetching leaderboard data:', error)
    throw error
  }
} 