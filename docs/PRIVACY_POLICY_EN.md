# Privacy Policy

**Last Updated**: November 10, 2025

## 1. Introduction

"Insert Images For Spreadsheet" (hereinafter referred to as "the Service") prioritizes the protection of user privacy. This Privacy Policy explains what information the Service collects and how it is used.

## 2. Core Principle: No Data Collection

**The Service does not collect, store, or transmit any personal information from users.**

## 3. Permissions and Their Purposes

The Service requests the following permissions, each used solely for its stated purpose:

### 3.1 Current Spreadsheet Access Permission

- **Permission**: `https://www.googleapis.com/auth/spreadsheets.currentonly`
- **Purpose**:
  - Read the position and size of user-selected cells
  - Insert user-selected images into the spreadsheet
  - Provide image insertion undo functionality
- **Scope**: Access is limited to the currently open spreadsheet file only. The Service does not access other spreadsheets or Google Drive files.

### 3.2 UI Display Permission

- **Permission**: `https://www.googleapis.com/auth/script.container.ui`
- **Purpose**: Display the sidebar and menu interface.

### 3.3 Add-on Execution Permission

- **Permission**: `https://www.googleapis.com/auth/script.addons`
- **Purpose**: Basic permission required to run as a Google Workspace Add-on.

## 4. Data Processing Methods

### 4.1 Image Files

- **Local Processing**: Images uploaded by users are processed entirely within the browser and are never transmitted to external servers.
- **Temporary Storage**: Image data exists temporarily in browser memory only until the user clicks the "Apply" button to insert them into the spreadsheet.
- **Automatic Deletion**: All image data is deleted from memory when the user clicks the "Save" button or closes the sidebar.
- **No Server Storage**: The Service does not have any server infrastructure to store user data.

### 4.2 Settings Storage

- **Browser Local Storage**: For user convenience, the following settings are stored in the browser's localStorage:
  - Number of rows/columns
  - Row/column spacing
  - Image size settings
  - Inactive cell information
- **Storage Location**: This data is stored only in the user's browser and is never transmitted externally or stored on any server.
- **Deletion Method**: Users can delete this data at any time through the browser's cookie and site data deletion feature.
- **No Cross-Device Sync**: Settings are not synchronized across devices or browsers.

### 4.3 Data Not Stored

The Service does not store or collect:

- Image files or image data
- Spreadsheet contents
- User's Google account information
- Usage history or analytics data
- User behavior or tracking data
- Any personally identifiable information (PII)

## 5. Third-Party Data Sharing

The Service does not share any data with third parties. There are no analytics services, advertising networks, or any other third-party services integrated into the Service.

## 6. Data Sharing with Google

The Service communicates with Google only for the following purpose:

- When the user clicks the "Apply" button, API calls are made to insert selected images into the spreadsheet.

This is the minimum communication required for the normal operation of Google Apps Script and does not include any personally identifiable information.

## 7. Cookies and Tracking Technologies

The Service does not use:

- Cookies
- Analytics tools (such as Google Analytics)
- Advertising tracking
- User behavior tracking
- Any tracking pixels or beacons

## 8. Children's Privacy

The Service does not intentionally collect personal information from children under the age of 13. Since the Service does not collect any personal information at all, it can be safely used by users of all ages.

## 9. Data Security

- Since the Service does not store user data on servers, there is no risk of server hacking or data breaches.
- All data processing occurs within the user's browser and Google's secure systems.
- Users are responsible for the security of their own devices and browser environments.

## 10. User Rights

Users have the following rights:

- The right to stop using the Service at any time
- The right to delete localStorage data through browser settings
- The right to revoke all access permissions by uninstalling the Add-on
- The right to request information about what data (if any) is processed

## 11. Data Retention

- **Image Data**: Not retained; deleted immediately after insertion or when the sidebar is closed
- **Settings Data**: Retained in browser localStorage until manually deleted by the user
- **No Server Data**: The Service maintains no servers or databases, so there is no server-side data retention

## 12. International Data Transfers

Since all data processing occurs locally in the user's browser, there are no international data transfers. The only communication is with Google's servers as part of the normal operation of Google Workspace.

## 13. Changes to This Privacy Policy

- This Privacy Policy may be updated as necessary. Any significant changes will be announced on this page.
- The "Last Updated" date at the top of this policy indicates when it was last revised.
- Continued use of the Service after changes constitutes acceptance of the updated policy.

## 14. Google's Privacy Practices

Since the Service runs on the Google Workspace platform, Google's Privacy Policy also applies:

- [Google Privacy Policy](https://policies.google.com/privacy)

Users should review Google's privacy practices to understand how Google handles data in connection with Google Workspace services.

## 15. Contact Information

If you have questions or concerns about privacy, please contact us through the GitHub repository Issues page.

## 16. Compliance

The Service is designed to comply with:

- General Data Protection Regulation (GDPR) requirements
- California Consumer Privacy Act (CCPA) requirements
- Other applicable privacy regulations

Since the Service does not collect personal data, many regulatory requirements do not apply. However, we maintain transparency about our data practices.

## 17. Summary

**Quick Summary:**

- ✅ Personal Information Collection: None
- ✅ Image Data Transmission: None (processed in browser only)
- ✅ Settings Storage: Browser local storage only (no external transmission)
- ✅ Third-Party Sharing: None
- ✅ Tracking/Analytics: None
- ✅ Cookies: None
- ✅ Server-Side Storage: None

## 18. Privacy by Design

The Service is built with privacy by design principles:

- **Data Minimization**: Only essential permissions are requested
- **Purpose Limitation**: Permissions are used only for their stated purposes
- **Transparency**: Clear communication about data practices
- **User Control**: Users maintain full control over their data and settings

---

**Open Source Commitment**

This Service is open source. Users and security researchers are encouraged to review the source code on GitHub to verify these privacy claims.

**Your Privacy Matters**

We believe that privacy is a fundamental right. The Service is designed to provide useful functionality while respecting user privacy at every level.
