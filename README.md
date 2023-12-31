# Gitlab-Search-ui

---
## Overview


Gitlab-Search is an internal  web application tool designed to search through gitlab projects and subgroups for keywords and regular expressions (regex) . This tool helps streamline the process of searching and analyzing codebases, enabling developers to efficiently locate specific patterns or function calls across projects and subgroups.


---
## ScreenShots

![](eyes.gif)

*Loading*

![](results.jpg)

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
uvicorn backend.main:app --reload
```
---
## Production Environment Setup
```bash
docker run -t gitlab_search_ui
```
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


## Useful Commands

```bash
docker build -t ui .
docker run -it <docker-image-id> sh
docker run -dp 80:80 <docker-image-id>
```

