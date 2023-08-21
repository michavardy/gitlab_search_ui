# Gitlab-Search-ui
---
## Overview


Gitlab-Search is an internal  web application tool designed to search through gitlab projects and subgroups for keywords and regular expressions (regex) . This tool helps streamline the process of searching and analyzing codebases, enabling developers to efficiently locate specific patterns or function calls across projects and subgroups.
---
## ScreenShots

![Loading](../public/loading.jpg)
*Loading*

![Loading](../public/results.jpg)
*Results*
## Features
- search text over all of the gitlab projects
- select branch
- black list filter out unwanted file names
- table with pagination to view results
---

## Development Environment Setup

### Frontend react server
```bash
npm start
```
### Backend FastAPI server
```bash
uvicorn fast.main:app --reload
```
---
## Production Environment Setup
---
## Usage
- fill out search prompt table 
- search and wait a couple of minutes
- view results table

---
## Configuration

Edit the .env file to specify default settings, such as token and group

```env
GROUP= <gitlab-group-id>
TOKEN=xxxxxxxxxx
RESULTS_PER_PAGE=100
```
---
## Contributing
Contributions are welcome! If you encounter any issues or have ideas for enhancements, please feel free to create a pull request or submit an issue.
---
## License
This project is licensed under the MIT License.
---


