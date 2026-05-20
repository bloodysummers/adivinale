## ADDED Requirements

### Requirement: Submit answer screen with category dropdown
The submit-answer screen (`app/submit-answer.tsx`) SHALL display a dropdown listing all available categories fetched from the existing categories API. The user SHALL be required to select a category before submitting.

#### Scenario: Categories populate the dropdown
- **WHEN** the submit-answer screen mounts
- **THEN** the dropdown is populated with all category names from the API

#### Scenario: Submit is disabled until category is selected
- **WHEN** the user has not yet selected a category
- **THEN** the submit button is disabled

### Requirement: Text field for suggested answer
The screen SHALL display a text input field below the category dropdown where the user types the word or phrase they want to suggest.

#### Scenario: Text field accepts input
- **WHEN** the user taps the text field and types a word
- **THEN** the word appears in the field

#### Scenario: Submit is disabled when text field is empty
- **WHEN** the user has selected a category but the text field is empty
- **THEN** the submit button is disabled

### Requirement: Submit button calls Vercel Function
Tapping the enabled submit button SHALL POST to the `/api/suggest-word` Vercel Function with `{ categoryId, text }`. The screen SHALL show a loading indicator while the request is in flight.

#### Scenario: Successful submission shows confirmation
- **WHEN** the API returns `{ status: 'created' }`
- **THEN** the screen shows a success message and clears the form fields

#### Scenario: Duplicate submission shows informative message
- **WHEN** the API returns `{ status: 'duplicate' }`
- **THEN** the screen shows a message indicating the word already exists in that category

#### Scenario: Network error shows error message
- **WHEN** the request fails due to a network error
- **THEN** the screen shows an error message and the form remains populated so the user can retry

### Requirement: Vercel Function deduplication logic
The `/api/suggest-word` Vercel Function SHALL check for an existing word with a case-insensitive exact match in the given category (in both the `words` production table and the `word_suggestions` staging table). If no duplicate exists it SHALL insert a row into `word_suggestions` and return `{ status: 'created' }`. If a duplicate is found it SHALL return `{ status: 'duplicate' }` without inserting.

#### Scenario: New word is inserted
- **WHEN** the function receives a categoryId and text that do not match any existing entry
- **THEN** a row is inserted into `word_suggestions` and the function returns `{ status: 'created' }`

#### Scenario: Duplicate word is rejected
- **WHEN** the function receives a categoryId and text that match an existing entry (case-insensitive)
- **THEN** no row is inserted and the function returns `{ status: 'duplicate' }`
