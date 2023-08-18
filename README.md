# JanusGraph Server Advance

This is a simple Express.js server that uses Gremlin to connect to a JanusGraph database. It is intended to be used as a starting point for building a more advanced server-side application.

## Table of Contents

- [JanusGraph Server Advance](#janusgraph-server-advance)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Usage](#usage)
  - [API Endpoints](#api-endpoints)
  - [Database](#database)

## Getting Started

Before you begin, make sure you have a basic understanding of Express.js, Gremlin, and general server-side development concepts.

## Installation

1. Clone this repository to your local machine: `https://gitlab.nome.fi/Andy/janusgraph-server-advance.git`
2. Navigate to the project directory: `cd janusgraph-server-advance`
3. Install the required dependencies: `npm install`

## Configuration

1. Rename `.env.example` to `.env` and provide the necessary configuration values, including your Gremlin database credentials and other environment-specific settings.

## Usage

To start the server locally, run the following command:

```bash
npm start
```

This will start the Express.js server and allow you to access it through your web browser or API client.

## API Endpoints

Route structure:

- **GET /graph**: Fetch all vertices and edges from the Gremlin database.
- **POST /vertex/edge**: Create a new vertex and edge by id in the Gremlin database.
- **POST /edge**: Create a new edge by uuid in the Gremlin database.

## Database

Your server uses Gremlin as the database language. Make sure to handle database connections properly and follow best practices for querying and data manipulation.