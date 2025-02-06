import { google } from 'googleapis'
import { GameWeekFixtures } from '@/types/fixtures'

interface GoogleSheetsError extends Error {
  code?: number;
  status?: number;
  message: string;
  response?: {
    status?: number;
    data?: {
      error?: {
        message?: string;
        status?: string;
      }
    }
  }
}

export async function getGameWeekFixtures(accessToken: string) {
  try {
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID
    if (!spreadsheetId) {
      throw new Error('GOOGLE_SHEETS_ID environment variable is not set')
    }

    const sheets = google.sheets({ version: 'v4' })
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: accessToken })

    // Get token info to check scopes and email
    const tokenInfo = await oauth2Client.getTokenInfo(accessToken)
    console.log('Sheet Access Token Info:', {
      email: tokenInfo.email,
      scopes: tokenInfo.scopes,
      expiry: tokenInfo.expiry_date,
      audience: tokenInfo.aud,
      accessType: tokenInfo.access_type
    })

    // First check if we can access the spreadsheet at all
    try {
      const spreadsheet = await sheets.spreadsheets.get({
        auth: oauth2Client,
        spreadsheetId,
        fields: 'sheets.properties.title,properties.title'
      })

      console.log('Spreadsheet access:', {
        title: spreadsheet.data.properties?.title,
        sheets: spreadsheet.data.sheets?.map(sheet => sheet.properties?.title),
        userEmail: tokenInfo.email
      })

      // Now try to access the specific sheet
      try {
        const response = await sheets.spreadsheets.values.get({
          auth: oauth2Client,
          spreadsheetId,
          range: encodeURI('GameWeek!A:F')
        })

        if (!response.data.values) {
          throw new Error('No fixtures found in GameWeek sheet')
        }

        console.log('GameWeek sheet access successful:', {
          rowCount: response.data.values.length,
          headerRow: response.data.values[0],
          userEmail: tokenInfo.email
        })

        const fixtures = response.data.values.slice(1).map(row => ({
          fixtureId: row[0],
          round: row[1],
          date: row[2],
          startTime: row[3],
          homeTeam: row[4],
          awayTeam: row[5],
        }))

        return fixtures

      } catch (sheetError) {
        console.error('GameWeek sheet access error:', {
          error: sheetError as GoogleSheetsError,
          userEmail: tokenInfo.email,
          status: (sheetError as GoogleSheetsError).response?.status,
          message: (sheetError as GoogleSheetsError).response?.data?.error?.message
        })
        throw new Error(`Cannot access GameWeek sheet. User ${tokenInfo.email} may need specific sheet access.`)
      }

    } catch (spreadsheetError) {
      console.error('Spreadsheet access error:', {
        error: spreadsheetError as GoogleSheetsError,
        userEmail: tokenInfo.email,
        status: (spreadsheetError as GoogleSheetsError).response?.status,
        message: (spreadsheetError as GoogleSheetsError).response?.data?.error?.message
      })
      throw new Error(`User ${tokenInfo.email} does not have access to the spreadsheet.`)
    }

  } catch (error) {
    console.error('Google Sheets GameWeek API error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      stack: error instanceof Error ? error.stack : undefined
    })
    throw error
  }
} 