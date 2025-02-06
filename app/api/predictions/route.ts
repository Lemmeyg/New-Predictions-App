import { auth } from '@/auth'
import { google } from 'googleapis'
import { NextResponse } from 'next/server'

interface GoogleAPIError extends Error {
  response?: {
    config?: {
      scopes?: string[]
    }
    status?: number
    statusText?: string
  }
}

interface PredictionData {
  userName: string | null | undefined
  fixtureId: string
  homeTeam: string
  awayTeam: string
  homeTeamScore: string
  awayTeamScore: string
  round: string
  date: string
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    
    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const predictions = await request.json() as PredictionData[]
    const spreadsheetId = process.env.GOOGLE_SHEETS_ID

    const sheets = google.sheets({ version: 'v4' })
    const oauth2Client = new google.auth.OAuth2()
    oauth2Client.setCredentials({ access_token: session.accessToken })

    // First, let's get the sheet names to verify
    const spreadsheet = await sheets.spreadsheets.get({
      auth: oauth2Client,
      spreadsheetId,
      fields: 'sheets.properties.title'
    })

    console.log('Available sheets:', spreadsheet.data.sheets?.map(sheet => sheet.properties?.title))

    // Format predictions for Google Sheets
    const values = predictions.map((pred: PredictionData) => [
      pred.userName,
      pred.fixtureId,
      pred.homeTeam,
      pred.awayTeam,
      pred.homeTeamScore,
      pred.awayTeamScore,
      pred.round,
      pred.date
    ])

    console.log('Attempting to write to predictions sheet with values:', values[0])

    // Append to predictions sheet
    await sheets.spreadsheets.values.append({
      auth: oauth2Client,
      spreadsheetId,
      range: 'Predictions!A:H',
      valueInputOption: 'RAW',
      requestBody: {
        values
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Predictions submission error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      error,
      stack: error instanceof Error ? error.stack : undefined,
      scopes: (error as GoogleAPIError).response?.config?.scopes,
      status: (error as GoogleAPIError).response?.status,
      statusText: (error as GoogleAPIError).response?.statusText
    })
    return NextResponse.json(
      { error: 'Failed to submit predictions' },
      { status: 500 }
    )
  }
} 