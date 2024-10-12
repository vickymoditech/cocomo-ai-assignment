## Cocomo Technical Assessment

This is a technical assessment as part of the [interview process](https://cocomo.ai/hiring) for Cocomo.

> [!IMPORTANT]  
> You will need a `FAL-KEY` API key to complete the technical assessment portion of the application. You will have received one alongside this application. Please message us on LinkedIn if you need one or sign up for a key at https://fal.ai  

To begin, clone this repository to your local machine.

## Development

This is a [NextJS](https://nextjs.org) app, with a SQLite based backend, intended to be run with the LTS version of Node.

To run the development server:

```bash
npm i
npm run dev
```

## Task:

Modify the code to add support for due dates and image previews.

### Part 1: Due Dates 

When a new task is created, users should be able to set a due date.

When showing the task list is shown, it must display the due date, and if the date is past the current time, the due date should be in red.

### Part 2: Image Generation 

When a todo is created, generate an image to visualize the task to be done. 

To do this, make a request to the [flux API on fal.ai](https://fal.ai/models/fal-ai/flux/dev/playground) and display the returned image to the user within the appropriate todo item. While the image is being generating, indicate a loading state.

You will be provided an API key to make the fetch request to fal.ai. 

## Submission:

1. Add a new "Solution" section to this README with a description and screenshot or recording of your solution. 
2. Push your changes to a private repository.
3. Add `kunalgorithm` and `GeorgeL9` as collaborators.
4. Submit the link to the [Application Google Form](https://cocomo.ai/apply). If you have already previously completed the form, send a link to the repository to george@cocomo.ai and kunal@cocomo.ai with the subject "Cocomo Technical Assessment Submission".
5. Message [Kunal on LinkedIn](https://www.linkedin.com/in/kunalsh22/) with a link of your submission. 

Thanks for your time and effort. We'll be in touch soon!

### OutPut

Implemented Due Date Feature: Introduced a due date field to enhance task management by allowing users to set deadlines for each item on the Todo List.

Added API-Level Loader: Integrated a loading indicator at the API level to improve the user experience by providing feedback during data fetching or processing operations.

Incorporated Image-Level Loader: Added a loader specific to image rendering, ensuring the interface remains responsive while images load asynchronously.
Enabled Local-Level Operations: Developed support for local storage and offline operations, allowing users to interact with the application even without an active internet connection.

Optimized Local-Level Operations: Implemented add and delete operations at the local level, reducing unnecessary API calls by updating the Todo List instantly in the UI. This avoids re-fetching the entire list after each operation, ensuring smoother and faster performance.

Optimized Image Management on Server: Implemented logic to save images directly on the server, simplifying the rendering process when displaying the Todo List. This reduces load times and ensures reliable image retrieval.

Added Fallback URL for Images: Configured a fallback mechanism to handle missing or unavailable images from the API. If an image is not provided, a default "No Image Available" placeholder will be displayed to maintain the visual integrity of the interface.

<video controls src="20241012_183338.mp4" title="Title"></video>