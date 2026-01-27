# NorCal Resist – Contact Your Representative Tool

A lightweight, frontend-only civic engagement tool that helps users identify their elected representatives and contact them using their own email client.

This project is designed to:
- Be hosted on GitHub
- Require no backend email sending
- Be embedded later into a WordPress site
- Allow site administrators to customize email subject and body text

## Features

- ZIP code → representative lookup
- Admin-defined email subject and message template
- Placeholder-based personalization
- Opens the user’s default email application (no emails sent by the site)
- No user data stored

## How It Works

1. User enters their ZIP code (and optional name/location)
2. The tool looks up their representative
3. A pre-filled email draft is generated
4. Clicking “Send Email” opens the user’s email client

## Customizing Email Content

Email content is controlled using templates with placeholders, such as:
{{rep_name}}
{{user_city}}
{{user_state}}
{{user_full_name}}
Templates can be edited directly in the configuration file or later via WordPress admin settings.

## Development

This project is written in plain JavaScript and does not require a build step.
