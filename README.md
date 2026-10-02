# CredVault



Certificate Issuing & Verification Platform built as a full-stack SDE internship project.



## Overview



CredVault allows citizens to submit certificate requests, track application status, and verify issued certificates. Administrators can securely log in, review applications, approve or reject requests, and revoke issued certificates.



## Features



### Citizen Portal

- Submit certificate requests

- Receive a unique Application ID

- Track application status

- Verify certificates using Certificate ID

- View certificate details and status



### Admin Portal

- Secure admin login using JWT authentication

- View all applications

- Approve or reject pending applications

- Automatically generate Certificate IDs after approval

- View issued certificates

- Revoke valid certificates



## Tech Stack



- Frontend: HTML, CSS, JavaScript, Fetch API

- Backend: Node.js, Express.js

- Database: MongoDB Atlas, Mongoose

- Authentication: JWT, bcryptjs

- Configuration: dotenv

- API support: CORS



## API Integration



| Feature | Method | Endpoint |

|---|---|---|

| Submit Application | POST | `/api/applications` |

| Track Application | GET | `/api/applications/track/:applicationId` |

| Verify Certificate | GET | `/api/certificates/verify/:certificateId` |

| Admin Login | POST | `/api/admin/login` |

| Get Applications | GET | `/api/admin/applications` |

| Approve Application | PATCH | `/api/admin/applications/:applicationId/approve` |

| Reject Application | PATCH | `/api/admin/applications/:applicationId/reject` |

| Get Certificates | GET | `/api/admin/certificates` |

| Revoke Certificate | GET | `/api/admin/certificates/:certificateId/revoke` |



## Status Flow



Pending -> Approved -> Certificate Created -> Valid -> Revoked



Pending -> Rejected



## Project Structure



```text

ELEVATE-SDE-Task-4/

â”œâ”€â”€ frontend/

â”œâ”€â”€ backend/

â”œâ”€â”€ .gitignore

â””â”€â”€ README.md


