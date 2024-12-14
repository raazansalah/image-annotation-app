# Image Annotation Tool

## Description

The Image Annotation Tool allows users to upload an image, annotate it with text, and manage tasks assigned to them. The application uses Firebase for user authentication and Firestore for storing tasks and annotations. 

## Features

- **User Authentication**: Sign up and login with Firebase Authentication.
- **Image Upload**: Upload images and annotate them with text.
- **Task Management**: View, update, and complete tasks that are assigned to the logged-in user.
- **Annotations**: Draw rectangles and add custom annotations to images.
- **Responsive UI**: The application is fully responsive, with mobile-first design and flexible layouts.
- **Filtered Views**: Tasks can be filtered by status (Pending, In Progress, Completed).

## Tech Stack

- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: Firebase (Firestore, Firebase Authentication)
- **Image Handling**: Cloudinary for image storage 
- **Deployment**: Vercel 

## Installation

### Step-by-step Guide:

1. **Clone the repository**:

```bash
git clone https://github.com/yourusername/image-annotation-tool.git
```
2. **Install dependencies**:
```bash
cd image-annotation-tool
npm install 
```
2. **Run the development server**:

```bash
npm run dev