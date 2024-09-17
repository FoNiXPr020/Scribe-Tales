# Scribe Tales

Welcome to Scribe Tales, a platform designed for writers to share their stories effortlessly. Scribe Tales leverages AI technology to assist with image generation and grammar correction, helping you to create polished and engaging content.

## Features

- **AI-Powered Image Generation**: Automatically generate images to complement your stories.
- **Grammar Fixer**: Improve the quality of your writing with built-in grammar correction tools.
- **Story Sharing**: Easily share your stories with the community or keep them private.
- **Comments and Notifications**: Readers can comment on stories, and authors will receive notifications when someone comments.
- **User Authentication**: Register, log in, and manage your profile.
- **Dashboard**: View created stories, manage followers, and navigate through your stories and profile.
- **Story Management**: Edit, delete, and explore user stories.
- **Explore Stories**: Discover all available stories from the community.
- **About and Contact**: Learn more about us or get in touch via dedicated routes.

## Our Team

- **[Mohamed Barhoun](https://github.com/FoNiXPr020)**: Full-stack Developer, Software Engineer
- **[Oumaima El Khanchoufi](mailto:omaimaelkhanchoufi9@gmail.com)**: Full-stack Developer, Software Engineer


## Technologies

Scribe Tales is built using the following technologies:

- **Front-End**: React.js, Vite, Tailwind CSS, Material UI, Axios, and Radix UI.
- **Back-End**: Laravel Framework for handling API requests and authentication.
- **AI Integration**: Foooocus AI for image generation and grammar correction tools for writing enhancement.
- **Database**: MySQL for story and user data management.

## Front-End Libraries

### Core Dependencies

- **Vite + React** (^18.3.1): The core Vite + React library for building user interfaces.
- **React Router DOM** (^6.24.1): For handling routes and navigation in React.
- **Axios** (^1.7.3): Promise-based HTTP client for making API requests.
- **Tailwind CSS** (^3.4.4): A utility-first CSS framework for styling.

### UI & Design Libraries

- **Mui/material** (^5.16.5): Material UI for React components, enhancing the look and feel.
- **Radix-ui/react** (^5.16.5): Libraries for UI components like Dialog, Dropdown Menu, and Tabs.

### Handling & Validation

- **React Hook Form** (^7.52.1): For managing form state and validation in React.
- **@hookform/resolvers** (^3.9.0): Resolves validation for React Hook Form.
- **Zod** (^3.23.8): TypeScript-first schema declaration and validation tool.

## Back-End Libraries (Laravel)

### Core Dependencies

- **PHP** (^8.2): The programming language for Laravel applications.
- **Laravel Framework** (laravel/framework ^11.9): The core framework for building applications.
- **Laravel Sanctum** (^4.0): For token-based API authentication and SPA authentication.

### Development Dependencies

- **Faker PHP** (^1.23): For generating fake data for testing.
- **Laravel Breeze** (^2.1): Authentication scaffolding for Laravel.
- **Laravel Pint** (^1.13): A code formatter following PSR-12 standards.
- **Pest Plugin for Laravel** (pestphp/pest-plugin-laravel ^2.0): Adds Laravel-specific functionality to PestPHP for testing.
- **Laravel Reverb**: For real-time functionality like live notifications and comments.

## Third-Party Services

- **Foooocus AI**: A tool for generating high-quality images, used to create visual content that complements storytelling on the platform.
- **Language Tools**: 
    - A grammar checker that helps writers improve the quality of their text by detecting and correcting grammatical errors.
    - A language detection library that ensures proper language identification for multilingual stories and resources.
- **Laravel Reverb**: A library used to handle real-time events, such as comments and notifications.

## Getting Started

Follow these steps to get started with Scribe Tales:

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or later)
- [Composer](https://getcomposer.org/) (version 2.7.9 or later)
- [XAMPP](https://www.apachefriends.org/) (version 8.2.12 or later)
- [Python](https://www.python.org/downloads/) (version 3.12.4 or later)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/FoNiXPr020/scribe-tales.git
    ```

2. Navigate to the project directory:

    ```bash
    cd scribe-tales
    ```

3. Navigate to the Front-end directory and install the dependencies:

    ```bash
    cd ALXFrontEnd
    npm install
    ```

4. Navigate to the Back-end directory and install the dependencies:

    ```bash
    cd ../ALXBackEnd
    composer install
    ```

5. Start the development servers for front-end and back-end:

    Open XAMPP and start the MySQL module.

    ```bash
    # front-end - Navigate Scribe-Tales directory
    cd ALXFrontEnd
    npm run dev
    # back-end - Navigate Scribe-Tales directory
    cd ALXBackEnd
    php artisan migrate:fresh --seed
    php artisan storage:link
    php artisan reverb:start
    php artisan queue:work
    php artisan serve
    ```

6. Start the development for Grammar LanguageTool:

    ```bash
    # Install Requirements
    cd LanguageTool
    pip install -r requirements.txt
    # After you can run following command:
    python3 grammar_checker_api.py
    ```
    
    - The application should now be running at `http://localhost:3000`.
    - The back-end will be running at `http://localhost:8000`.
    - The Reverb sockets service will be running at `http://localhost:8080`.
    - The LanguageTool service will be running at `http://localhost:5000`.

## Usage

- **Creating a Story**: Navigate to the story creation page at `/create-story`, where you can write and format your story.
- **Generating Images**: Use the image generation feature to add visuals to your story.
- **Grammar Correction**: Review and correct your story with the built-in grammar fixer by pressing the Grammar Checker.
- **Commenting**: Readers can comment on stories, and authors will receive notifications when someone comments on their story.
- **User Authentication**: Register and log in to access the dashboard.
- **Dashboard**: Access your dashboard to view created stories, see followers, and navigate to profile and my stories.
- **Profile Management**: Update your profile and password at `/profile`.
- **My Stories**: Edit, delete, and explore your stories at `/my-stories` (auth users only).
- **Explore**: Discover all stories at `/explore`.
- **About and Contact**: Learn more about us at `/about` and contact us via `/contact`.

## Contact

For any questions or feedback, please reach out to us at:

- [Mohamed Barhoun](mailto:rogueman2018@gmail.com)
- [Oumaima El Khanchoufi](mailto:omaimaelkhanchoufi9@gmail.com)