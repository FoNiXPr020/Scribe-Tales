<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

# Scribe Tales (Laravel Backend)

Welcome to the backend documentation for **Scribe Tales**, a platform that allows writers to share their stories effortlessly. This section focuses on the Laravel framework powering the backend services, including user authentication, story management, and API functionality.

## Features

- **User Authentication**: Secure login, registration, and profile management.
- **Story Management**: Create, edit, and delete stories with ease.
- **API Services**: Provides RESTful APIs for the front-end interaction.
- **Commenting System**: Enable readers to comment on stories.
- **Notifications**: Notify authors when someone comments on their stories.
- **Real-Time Updates**: Leveraging Laravel Reverb for real-time events.
- **Token-based Authentication**: Using Laravel Sanctum to authenticate API requests.

## Technologies

- **Laravel Framework**: (v11.x) The backbone of the backend, handling all business logic.
- **Laravel Sanctum**: For secure token-based API authentication.
- **MySQL**: For storing user and story data.
- **Laravel Breeze**: For authentication scaffolding.
- **Reverb**: For handling real-time events like comments and notifications.

## Laravel Dependencies

### Core

- **PHP** (^8.2): The core language for the Laravel backend.
- **Laravel Framework** (laravel/framework ^11.9): The primary framework for application logic.
- **Laravel Sanctum** (^4.0): Token-based API authentication.
- **MySQL**: Database management for user data, stories, and comments.

### Development

- **Laravel Pint** (^1.13): A PSR-12 compliant code formatter.
- **FakerPHP** (^1.23): For generating fake data during testing.
- **Laravel Breeze** (^2.1): Simple authentication scaffolding.
- **Pest**: Testing framework with Laravel integration.
- **Laravel Reverb**: For real-time functionality like live notifications and comments.

## API Routes

### Authentication Routes

- **POST /register**: Registers a new user.
- **POST /login**: Logs in a user and returns an API token.
- **POST /auth/google**: Authenticates a user with Google.
- **POST /logout**: Logs out the authenticated user (requires authentication).

### User and Profile

- **GET /user**: Retrieves the authenticated user's profile.
- **POST /user/profile**: Updates the authenticated user's profile.
- **POST /user/password**: Updates the authenticated user's password.

### Stories

- **GET /explore**: Retrieves a list of all public stories.
- **GET /explore/{story_id}**: Retrieves a specific story (requires authentication).
- **GET /user/stories**: Retrieves all stories created by the authenticated user.
- **POST /stories**: Creates a new story (authenticated users only).
- **PUT /stories/{id}**: Updates an existing story (authenticated users only).
- **DELETE /stories/{id}**: Deletes a story (authenticated users only).

### Comments

- **GET /comments/{story_id}**: Retrieves all comments for a specific story.
- **POST /comments**: Adds a comment to a story (authenticated users only).
- **PUT /comments/{id}**: Updates a comment (authenticated users only).
- **DELETE /comments/{id}**: Deletes a comment (authenticated users only).

### Notifications

- **GET /notifications**: Retrieves all notifications for the authenticated user.
- **POST /notifications/mark-all-as-read**: Marks all notifications as read.
- **POST /notifications/{notification}**: Updates a specific notification.
- **DELETE /notifications/{notification}**: Deletes a specific notification.

### Follower and Like Management

- **POST /follow/{username}**: Follows a user (authenticated users only).
- **DELETE /unfollow/{username}**: Unfollows a user (authenticated users only).
- **POST /like/{story}**: Likes a story (authenticated users only).
- **DELETE /unlike/{story}**: Unlikes a story (authenticated users only).
- **GET /user/followers/{username}**: Retrieves followers of a user.
- **GET /user/likes/{username}**: Retrieves likes of a user.

### Public Routes

- **GET /users/{username}**: Retrieves user details by username.
- **GET /users/stories/{username}**: Retrieves stories by a specific user.
- **GET /familiar**: Retrieves familiar stories by type.

## Getting Started (Laravel Setup)

Follow these instructions to set up the Laravel backend for Scribe Tales.

### Prerequisites

Ensure you have the following installed:

- [PHP](https://www.php.net/) (version 8.2 or later)
- [Composer](https://getcomposer.org/) (version 2.7.9 or later)
- [MySQL](https://www.mysql.com/) or any other database supported by Laravel

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/FoNiXPr020/scribe-tales.git
    ```

2. **Navigate to the backend directory**:

    ```bash
    cd scribe-tales/ALXBackEnd
    ```

3. **Install PHP dependencies**:

    ```bash
    composer install
    ```

4. **Set up environment variables**:

    Copy the `.env.example` file and rename it to `.env`:

    ```bash
    cp .env.example .env
    ```

    Modify the `.env` file to configure your database and other environment variables.

5. **Generate the application key**:

    ```bash
    php artisan key:generate
    ```

6. **Migrate and seed the database**:

    Run the following command to migrate the database schema and seed the data:

    ```bash
    php artisan migrate:fresh --seed
    ```

7. **Link storage for file uploads**:

    ```bash
    php artisan storage:link
    ```

8. **Start the backend server**:

    ```bash
    php artisan serve
    ```

9. **Start the Reverb service** (for real-time updates):

    ```bash
    php artisan reverb:start
    ```

10. **Queue Worker**:

    Ensure Laravel queue workers are running for background jobs like notifications:

    ```bash
    php artisan queue:work
    ```

## Deployment

For production deployment, follow the official Laravel documentation for setting up environments like Apache, Nginx, or Docker.

### Optimizing the Application

Before deploying to production, optimize the application:

```bash
php artisan optimize
```

Ensure queues are managed properly using a process manager like Supervisor for queue workers.

## Contact
For any issues or questions related to the backend, please contact:

- [Mohamed Barhoun](mailto:rogueman2018@gmail.com)
- [Oumaima El Khanchoufi](mailto:omaimaelkhanchoufi9@gmail.com)


This README now includes details about the API routes for the Laravel backend, making it clear how to interact with the various endpoints provided by your application.