# Insert Images For Spreadsheet

<div align="center">

**An extension for Google Sheets that places images in a grid pattern**

[![Google Apps Script](https://img.shields.io/badge/Google%20Apps%20Script-4285F4?style=flat&logo=google&logoColor=white)](https://developers.google.com/apps-script)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[English](#english) | [한국어](README.md)

</div>

---

## English

### 📋 Project Description

An extension program for Google Sheets that automatically places multiple images in a specific pattern. You can easily create grid layouts without the hassle of manually placing images one by one.

### ✨ Key Features

#### 🎯 Image Placement

- **Grid Pattern**: Place images regularly by specifying rows and columns
- **Spacing Control**: Set row and column spacing between images in cell units
- **Inactive Cells**: Specify positions where images should not be placed
- **Drag & Drop**: Easily change image order by dragging

#### 📐 Image Size Adjustment

- **Fit to Cell**: Automatically fit to the size of selected cell (merged cell support)
- **Pixel Specification**: Directly input width/height in pixels
- **Maintain Ratio**: Resize while maintaining the original aspect ratio

#### 💾 Settings Management

- **Preset Save**: Save and reuse frequently used settings as presets
- **Auto Save**: Settings automatically saved to browser's localStorage
- **Undo**: Revert with cancel button after image insertion

#### 🎨 User Interface

- **Dark Mode**: Automatic theme switching based on system settings
- **Responsive Design**: UI optimized for mobile, tablet, and desktop
- **Intuitive Operation**: Design style similar to spreadsheets

### 🚀 Getting Started

#### Installation

1. **Direct Installation with Google Apps Script**

   ```
   1. Open a Google Spreadsheet
   2. Click Extensions > Apps Script menu
   3. Copy and paste the contents of src/Code.gs
   4. Check Project Settings(⚙️) > Show "appsscript.json"
   5. Copy and paste the contents of src/appsscript.json
   6. Create File(+) > HTML > name it 'sidebar'
   7. Copy and paste the contents of src/sidebar.html
   8. Save and refresh the spreadsheet
   ```

2. **Deploy with Clasp (for developers)**

   ```bash
   # Install Clasp
   npm install -g @google/clasp

   # Login to Google account
   clasp login

   # Deploy project
   clasp push
   ```

#### How to Use

1. **Import Images**

   - Click "📁 Import Images" button or
   - Add images via drag and drop
   - Multiple images can be selected simultaneously

2. **Layout Settings**

   - Select starting cell in spreadsheet and click "Select" button
   - Enter number of rows and columns (1~50)
   - Set row and column spacing if needed (0~20)

3. **Image Size Settings**

   - "Fit to Cell" check: Auto-fit to selected cell size
   - "Maintain Ratio" check: Resize while maintaining original ratio
   - Direct input: Specify width/height pixel values directly

4. **Specify Inactive Cells (Optional)**

   - Enable "Specify Inactive Cells" checkbox
   - Click cells in the table where images should not be placed

5. **Apply**
   - Click "Apply" button to insert images into spreadsheet
   - Can revert with "Cancel" button after insertion
   - Click "💾 Save" button to clear image list

### 📸 Usage Examples

#### Basic Grid Layout

```
Settings: 2 rows × 3 columns, no spacing
Result:
[Image1] [Image2] [Image3]
[Image4] [Image5] [Image6]
```

#### Layout with Spacing

```
Settings: 2 rows × 2 columns, row spacing 1, column spacing 1
Result:
[Image1] [ Empty  ] [Image2]
[ Empty ] [ Empty  ] [ Empty ]
[Image3] [ Empty  ] [Image4]
```

#### Using Inactive Cells

```
Settings: 2 rows × 3 columns, inactive cell: (1,2)
Result:
[Image1] [ Empty  ] [Image2]
[Image3] [Image4] [Image5]
```

### 🔧 Tech Stack

- **Google Apps Script**: Backend logic and Spreadsheet API integration
- **HTML/CSS/JavaScript**: Frontend written in pure Vanilla JS
- **localStorage**: Save settings and presets
- **Canvas API**: Image resizing and optimization

### 📂 Project Structure

```
insert-images-for-spreadsheet/
├── src/
│   ├── Code.gs              # Google Apps Script backend
│   ├── sidebar.html         # Sidebar UI (HTML + CSS + JS)
│   └── appsscript.json      # Manifest file
├── CLASP_SETUP_GUIDE.md     # Clasp setup guide
├── 개발계획.md               # Development plan and progress
├── 프로젝트 명세.md          # Detailed feature specifications
├── README.md                # Korean documentation
└── README_EN.md             # This file (English documentation)
```

### 📝 Main Settings Options

| Option         | Description                                  | Range |
| -------------- | -------------------------------------------- | ----- |
| Rows           | Number of vertical lines in grid             | 1~50  |
| Columns        | Number of horizontal lines in grid           | 1~50  |
| Row Spacing    | Vertical spacing between images (in cells)   | 0~20  |
| Column Spacing | Horizontal spacing between images (in cells) | 0~20  |
| Image Width    | Horizontal size of image (pixels)            | 10~   |
| Image Height   | Vertical size of image (pixels)              | 10~   |

### 🎯 Use Cases

- 📊 **Product Catalog**: Create catalogs by regularly arranging product images
- 🖼️ **Photo Album**: Arrange multiple photos at once in album format
- 📈 **Report Creation**: Place chart or graph images at regular intervals
- 🎨 **Design Layout**: Organize design mockups in grid format

### ⚠️ Precautions

- If there are more images than pattern cells, excess images are ignored
- If there are fewer images than pattern cells, remaining cells are left empty
- If actual placeable cells are insufficient due to inactive cells, excess images are ignored
- If a merged cell is selected, the image fits the entire merged size
- Larger images may take longer to process

### 📄 License

This project is distributed under the MIT License.

### 📧 Contact

If you have questions or suggestions about the project, please register an issue.

---

<div align="center">

**Made with ❤️ for Google Sheets users**

</div>
