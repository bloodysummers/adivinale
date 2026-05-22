## ADDED Requirements

### Requirement: Reset script truncates words table safely
`db/scripts/reset-words.ts` SHALL execute `TRUNCATE words` only when the flag `--execute` is passed. Without the flag it SHALL print a dry-run summary and exit without touching the database.

#### Scenario: Dry run prints summary without touching DB
- **WHEN** the script is run without `--execute`
- **THEN** it prints the number of rows that would be deleted and exits with code 0, making no DB changes

#### Scenario: Execute flag truncates the table
- **WHEN** the script is run with `--execute`
- **THEN** it executes `TRUNCATE words` and logs the confirmation message
