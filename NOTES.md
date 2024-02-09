# Notes

Biome.js linter has no support for caching?
  - eslint does

- Use navigator.share() to share link to directory where study guides should be downloaded
- Or Mozilla note?? Note: If you want to access or process all the files in a selected folder, you can do so using <input type="file" webkitdirectory="true"/> to select the folder and return all the files it contains.

Maybe use?
- [Storing files or blobs locally with IndexedDB using the idb-file-storage library.](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Working_with_files#store_files_data_locally_using_the_indexeddb_file_storage_library)
- class-variance-authority?
- clsx?

[Cucumber with Playwright](https://www.genui.com/resources/getting-started-with-bdd-using-cucumber-io)

Fix create-guide spec to be a unit test
  - just make sure function at end is processing files correctly. No need to simulate user

In order to use Web APIs in test, needs to use browser

Setup Github Actions

Potential Features:
  - Add class progress
    - Allows user to "update" pdfs by adding new class notes and homeworks
    - Sync with calendar?
      - Send reminders to user to review notes on particular days
  - Add note for firefox users to switch browsers

Maybe restrucuture project??
  - app directory only for next specific code?
  - components for all components?

Look into persisting file handles
  <https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api>

Go over feature set, potential things to add
Add payment integration with stripe

- spreadsheet for users
Analytics?
What other things are necessary for first go

## Instead of jsons for keeping track of course progress

- use idb/localStorage
- This way will keep basic functionality working on all browsers
Create two types of users
- full app functionality
- Restricted permissions app

Setup will depend on user type

Once permissions set, user chosen
Write out features available for each user type, then implement

Change course object to allow assigning midterm groups of files

- final will group all of these together
Save specific class settings inside JSON to persist

Add fallbacks for certain features??

Try to figure out best way to structure file system??
- restructure eventually for combining file systems/fallbacks
- Write out feature list
- Create different user types
- Use classes/methods based on type of user

Make class for user type
User methods

- getCourses
- saveToStorage
  - canReaccess - boolean

FullAccessUser

- save file handles in idb
- Store files locally on user pc

LimitedAccessUser

- save file blobs in other storage?
-

Combine dean into user?

Do more research, reading so that can architect the app better going forward

- once have bases covered, start design

Rearchitect before too much further??

- change professor to track? Courseload?
- Plan to allow for diff types in future
- Change dean to university?
- Move dean class to hook

Only use class for things made more than once

useUser

- check type and assign config
- Full access
  - request permissions
  - instantiate courses
- Partial
  - Save blobs into idb
  - save course settings on localStorage
- User methods implemented based on options in config for user

Student profile

- merge professor, dean into this

Move notes into project

Check if Github Copilot can generate tests using Cypress?
Dark Mode
  - <https://ui.shadcn.com/docs/dark-mode/next>


NextJS Error Boundaries
- Would be nice if can get to work for pages?
- For now, just create a page component for error handling??