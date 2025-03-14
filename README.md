# PDF Upload Service

## Overview
This application provides a simple service to upload PDFs and attach them to a specified endpoint. It supports authentication via Microsoft Dynamics Business Central (MSDBC) access tokens and utilizes OData for content attachment management.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (latest LTS version recommended)
- [TypeScript](https://www.typescriptlang.org/)
- [ts-node](https://typestrong.org/ts-node/)

### Installation
Clone the repository and install dependencies:
```sh
npm install
```

### Running the Application
To start the application, run:
```sh
npx ts-node app.ts
```

### Accessing the UI
Once the application is running, you can access the UI via the browser at:
```
http://localhost:9000
```
Alternatively, you can make HTTP requests directly to the API endpoint.

## API Endpoint

### Upload PDF
#### Endpoint
```
POST {host}/upload-pdf
```
#### Request Parameters
The request should be sent as `form-data` with the following parameters:

| Parameter      | Type     | Description                                  |
|--------------|---------|----------------------------------------------|
| `pdfFile`     | File    | The PDF file to be uploaded.                 |
| `accessToken` | String  | The MSDBC access token for authentication.   |
| `baseUrl`     | String  | The endpoint URL for content attachment.     |
| `attachmentId`| String  | The ID of the attachment object.             |
| `eTag`        | String  | The OData tag of the attachment object.      |

### Example cURL Request
```sh
curl -X POST "http://localhost:9000/upload-pdf" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -F "pdfFile=@your.pdf" \
     -F "accessToken=YOUR_ACCESS_TOKEN" \
     -F "baseUrl=https://your-api-endpoint.com" \
     -F "attachmentId=ATTACHMENT_ID" \
     -F "eTag=ETAG_VALUE"
```

## Notes
- Ensure that the provided `accessToken` is valid to authenticate requests successfully.
- The `eTag` parameter is required for OData concurrency control.
- The application must be running on the specified host for API access.

## License
This project is licensed under [MIT License](LICENSE).

## Contributing
Feel free to submit issues or pull requests to improve the service.

---
Happy coding! 🚀

