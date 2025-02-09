import { google } from 'googleapis'

export async function getLeaderboardData(accessToken: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set')
    }

    console.log('Google Sheets API request details:', {
      spreadsheetId,
      hasAccessToken: !!accessToken,
      tokenLength: accessToken?.length,
      range: 'Table!A1:E7'
    })

    const sheets = google.sheets({ version: 'v4' })
    const auth = new google.auth.OAuth2()
    auth.setCredentials({ access_token: accessToken })

    const response = await sheets.spreadsheets.values.get({
      auth,
      spreadsheetId,
      range: 'Table!A1:E7',
    })

    console.log('Google Sheets API response:', {
      hasValues: !!response.data.values,
      rowCount: response.data.values?.length,
      firstRow: response.data.values?.[0]
    })

    if (!response.data.values) {
      throw new Error('No data found in spreadsheet')
    }

    return response.data.values
  } catch (error) {
    console.error('Google Sheets API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      name: error instanceof Error ? error.name : 'Unknown error type',
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
} 