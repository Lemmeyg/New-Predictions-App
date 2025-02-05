npx shadcn@2.1.8 add table

git push origin master --force



# Objective
To implement 5 API calls into an existing application



## Tools and Technologies
- **UI Components**: [shadcn/ui](https://shadcn.dev/)
- **Database**: Googsheets (via API)
-)Auth (Google) 
**API Calls**: [axios](https://axios-http.com/)
-**Soccer match data** (www.api-football.com)
- **Navigation**: [react-router-dom](https://reactrouter.com/)
- **Framework**: [Next.js](https://nextjs.org/) (using App Router)

## Front end UX design
- pages will be created for primarily mobile devices.
- The design will be modern and clean with a focus on the user experience.
- the design will be based on the [shadcn/ui](https://shadcn.dev/) library.
- the design will be responsive and will look good on both laptop and mobile devices.
- the design will be consistent and will use the same colors and fonts throughout the application.

##Guiding points
Use Typescript as the main language, using JS only when there are no other options
Keep the file structure as simple a clean as possible.

##Credentials
-NEXT_PUBLIC_BASE_URL=http://localhost:3000
- googlesheets sheet ID Sheet details - 1OJpcocsLUD-5CUGTZcaNJzJ2ZyHw-hG-ryXUo25Ro7E
-footballAPI _KEY=ab0496f8c413baa9d1b31f4386b04a51
-Googlesheets API Key : to be provided
Googlesheer secret to be provided

## Note
This application will be eventually deployed to the production environment using Vercel

##Useful documentation
###GoogleSheets
https://developers.google.com/sheets/api/guides/concepts
https://developers.google.com/sheets/api/guides/values
###Football API
---

# 1. API  Core Features and Functionalities

## 1.1  Google OAuth
Google OAuth is already implemented but maybe needed to authneticating the API calls
https://blog.logrocket.com/how-to-authenticate-access-google-apis-using-oauth-2-0/


##1.2 APIs
### 1.2.1 football API

Run the API call at 5pm EST everyday
Pull in all the fixtures from League 39 and season 2024

football_KEY=ab0496f8c413baa9d1b31f4386b04a51
Keep credentials in a .env fileImport Fixtures from Football API
Example of previous implementation of this API: C:\Users\Gordo\Documents\GitHub\Predictions-App-Cursor-V4.2-master\src\lib\api\football.ts

- **API Example**:
  - **Request**:
    ```javascript
    axios.get('/api/matches/upcoming');
    ```
  - **Response**:
    ```json
    [
      {
        "username": "user1",
        "matchId": 1,
        "homeTeam": "Team A",
        "awayTeam": "Team B",
        "homeTeamScore": 1, // this will be the score of the home team
        "awayTeamScore": 2,
        "round": 12,
        "status": "not Started",
        "startTime": "2024-01-15T15:00:00Z"
      }
    ]
    ```

### 1.2.2 Store the Fixtures in the Airtable Table
The process for storing fixtures in Airtable follows these steps:

1.2.2.1. Clear existing data:
 - Delete records in googlesheets sheet “fixtures”\
 - Log the number of records deleted
 - Fetch all existing records from the "Fixtures" table

1.2.2.2. Import new Football API data into Fixture table:


   - Process fixtures in batches
   - Each record contains:
     - id: unique identifier
     - homeTeam: name of home team
     - awayTeam: name of away team
     - round: match round number
     - status: match status
     - startTime: scheduled start time
     - homeTeamScore: current/final score (if available)
     - awayTeamScore: current/final score (if available)
   - Log successful insertion of new records


### 1.3 import leaderboard Table

C:\Users\Gordo\Documents\GitHub\Predictions-App-Cursor-V4.2\src\app\api
This API should Import data from googlesheets workbook sheet  Table !a1:d7
It will be used to populate the table on the leaderboard app.
Will contain 6 rows of 4 columns
Rank
Player Name
Game Week points
Total Point

### 1.4 import gameweek fixtures
-Worksheet 1OJpcocsLUD-5CUGTZcaNJzJ2ZyHw-hG-ryXUo25Ro7E/edit?gid=2008750902#gid=2008750902
Table = predictions
-Columns headers are: Fixture ID, Round, Date, Starttime, Home Team, Away Team,
-Current game week is defined as the lowest numbered round where all fixtures status is NS
-There will be up to 20 fixtures per import
-Add the records to the bottom of the table
-Import the fixtures into the Predictions form
-Include the screenshot


###1.5 Submit Predictions

This API should Import game week fixtures from GameWeek!A:J
There could be between 4 and 20 fixtures
   the user will be able to click on the submit button to submit their predictions.
  when they submit their predictions they will be shown a toast notification containing all their predictions in one message so they can take a screen shot.
  display teh toast notice for 3 seconds before returning the user to the home page.
  all predictions will be stored in the same googlesheets workbook as the fixtures, on a table titled "predictions". 
  the predictions table will have the following columns:
    - userName: name of user
    - fixtureId: unique identifier matching the fixtureId in the fixtures table
    - homeTeam: name of home team
    - awayTeam: name of away team
    - homeTeamScore: predicted score of home team
    - awayTeamScore: predicted score of away team
    - round: match round number
    -date
  note that there are other columns in the table but these are the ones that are to be updated. ignore the existing columns.
   never write over any existing rows.



2. Pages
Login page - 
shows google login button
Starts the OAuth process
Front page - 
Menu to select Table or Enter Predictions
Display user email from login 
Table
Display the imported data from Import table API
Display a back button that takes the user to the front page
Prediction
Display fixtures from import Game week fixtures API
Include 2 input fields
Advance cursor on to next field when single numeric value is imputed.




API call logging
Implement step by step login on the API for debugging later.

Production deployment - Vercel
Note that the application will be deployed on Vercel. 

1.2.3. Error handling:
   - Comprehensive error logging for both deletion and insertion operations
   - Batch processing ensures reliable operation within API limits
   - Transaction-like behavior: if insertion fails, the process can be safely retried

This process is automatically handled by the updateFixturesInAirtable function and runs as part of the daily fixture update routine.

1.2.4 Additional Information and Documentation

1. Google Sheets API Reference: https://developers.google.com/sheets/api/reference/rest
2. Google Cloud Console: https://console.cloud.google.com/
3. TypeScript Documentation: https://www.typescriptlang.org/docs/
4. Jest Testing Framework: https://jestjs.io/docs/getting-started
5. TypeDoc: https://typedoc.org/guides/installation/



—
# 2.UX and Front end

## 2.1 Home Page
- Display a welcome message.
- Provide buttons to:
  - Enter predictions - this will take the user to the user page.
  - View the leaderboard - this will take the user to the leaderboard page.
  
## 2.3 Enter Predictions
- the screen should display user email at the top left of the screen
  - it will display the home team on the left and the away team on the right with two blank numeric input fields in the middle
  - the user will be able to click on the blank field to enter their prediction.
  - when the user input a single character numeric value into the first blank field, it will move onto the next blank field.-
  - once all the fields are filled the user will be able to click on the submit button to submit their predictions.
  


## 2.4 View Predictions
- Users can view predictions made by all users for the current game week.
- **Definition of current game week**:
  - The game week with the lowest number where at least one match is scheduled to start later than `NOW` and has a status: `not Started`.

## 2.5.1 Leaderboard page
###2.5.1.1 Layout
 - the leaderboard should follow the same design language and color scheme as the rest of the application.
 - the leaderboard should be responsive and should look good on both laptop and mobile devices.
 - it should contain a "Back" button in the top left of the screen that the user can use to return to the home page.  

 ###2.5.1.2 Table
 - the top frame should be titled "Leaderboard"
 - the top frame should show a table with the following columns:
      - Rank
      - Player
      - Total Points
      - Points from the previous game week
  - the table should be sorted by total points, highest to lowest.
- data to populate this table will come from googlesheets "leaderBoard" sheet.

# 3. Project Setup and Best Practices

## 3.1 Project Setup
- All new components should go in `/components` at the root (not in the app folder) and be named like `example-cor`.
- All new pages go in `/app`.
- Use the Next.js 14 App Router.
- All data fetching should be done in a server component and passed down as props.
- Client components (using `useState`, hooks, etc.) require the `'use client'` directive at the top of the file.

## 3.2 Server-Side API Calls
- All interactions with external APIs (e.g., Reddit, OpenAI) should be performed server-side.
- Create dedicated API routes in the `pages/api` directory for each external API interaction.
- Client-side components should fetch data through these API routes, not directly from external APIs.

## 3.3 Environment Variables
- Store all sensitive information (API keys, credentials) in environment variables.
- Use an `.env.local` file for local development and ensure it is listed in `.gitignore`.
- For production, set environment variables in the deployment platform (e.g., Vercel).
- Access environment variables only in server-side code or API routes.

## 3.4 Error Handling and Logging
- Implement comprehensive error handling in both client-side components and server-side API routes.
- Log errors on the server-side for debugging purposes.
- Display user-friendly error messages on the client-side.

## 3.5 Type Safety
- Use TypeScript interfaces for all data structures, especially API responses.
- Avoid using the `any` type to ensure type safety.

## 3.6 API Client Initialization
- Initialize API clients as needed to streamline server-side interactions and reduce redundancy.


#6 # AI Development Agent Guidelines

# AI Development Agent Guidelines

## 1. Changelog Management
Please maintain a detailed changelog in the following format:

```markdown
# Changelog

## [Unreleased]
### Added
- New features that have been added

### Changed
- Changes in existing functionality

### Deprecated
- Features that will be removed in future versions

### Removed
- Features that have been removed

### Fixed
- Bug fixes

### Security
- Security improvements or fixes

Each entry should include:
- Date and time of change
- Brief description of what was changed
- Reason for the change
- File(s) affected
```

#7. Development Process Guidelines

### Before Starting Each Task
1. Review the current state of the codebase
2. Identify dependencies and potential impacts
3. State your planned approach
4. List any assumptions you're making
5. Identify potential risks or challenges

### During Development
1. Write commit messages in present tense, explaining:
   - What changes are being made
   - Why the changes are necessary
   - Any potential side effects

### After Each Major Change
1. Summarize what was completed
2. List any deviations from the original plan
3. Document any technical debt created
4. Suggest next steps or related tasks

## 7.2. Code Organization Rules

### File Structure
- Place new files in appropriate directories as per the project structure
- Update import paths in affected files
- Document new directory creation in changelog

### Component Creation
1. Before creating a component:
   - Check if similar component exists
   - Consider component reusability
   - Plan component interface (props, events)

2. When creating a component:
   - Add TypeScript interfaces
   - Include JSDoc comments
   - Add error handling
   - Consider accessibility
