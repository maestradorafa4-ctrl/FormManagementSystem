const SPREADSHEET_ID = "17QhNk6Ap-LLYqpiP596p4nFelV385iVpUGh9zvsoLPs";
const SHEET_NAME = "Form Management System";


function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("Form Management System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}



function getSheet() {
  const ss = SpreadsheetApp.openById(
    "17QhNk6Ap-LLYqpiP596p4nFelV385iVpUGh9zvsoLPs"
  );

  let sheet = ss.getSheetByName("Form Management System");

  if (!sheet) {
    sheet = ss.insertSheet("Form Management System");

    sheet.getRange("A1:G1").setValues([[
      "ID",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Created At",
      "Updated At"
    ]]);

    sheet.getRange("A1:G1")
      .setFontWeight("bold")
      .setBackground("#2563eb")
      .setFontColor("#ffffff");

    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * READ
 * Get all records
 */
function getRecords() {
  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return [];
  }

  const data = sheet
    .getRange(2, 1, lastRow - 1, 7)
    .getValues();

  return data.map(function(row) {
    return {
      id: row[0],
      name: row[1],
      email: row[2],
      phone: row[3],
      status: row[4],
      createdAt: formatDate(row[5]),
      updatedAt: formatDate(row[6])
    };
  });
}


/**
 * CREATE
 * Add a new record
 */
function createRecord(data) {

  if (!data) {
    throw new Error("No data received.");
  }

  if (!data.name) {
    throw new Error("Name is required.");
  }

  if (!data.email) {
    throw new Error("Email is required.");
  }

  const sheet = getSheet();

  const id = "REC-" + new Date().getTime();
  const now = new Date();

  sheet.appendRow([
    id,
    data.name,
    data.email,
    data.phone || "",
    data.status || "Active",
    now,
    now
  ]);

  return {
    success: true,
    message: "Record successfully created."
  };
}


/**
 * UPDATE
 * Update an existing record
 */
function updateRecord(data) {

  if (!data || !data.id) {
    throw new Error("Record ID is required.");
  }

  const sheet = getSheet();
  const row = findRowById(data.id);

  if (row === -1) {
    throw new Error("Record not found.");
  }

  const createdAt = sheet.getRange(row, 6).getValue();

  sheet.getRange(row, 1, 1, 7).setValues([[
    data.id,
    data.name || "",
    data.email || "",
    data.phone || "",
    data.status || "Active",
    createdAt,
    new Date()
  ]]);

  return {
    success: true,
    message: "Record successfully updated."
  };
}


/**
 * DELETE
 * Delete a record
 */
function deleteRecord(id) {

  if (!id) {
    throw new Error("Record ID is required.");
  }

  const sheet = getSheet();
  const row = findRowById(id);

  if (row === -1) {
    throw new Error("Record not found.");
  }

  sheet.deleteRow(row);

  return {
    success: true,
    message: "Record successfully deleted."
  };
}


/**
 * Find spreadsheet row using ID
 */
function findRowById(id) {

  const sheet = getSheet();
  const lastRow = sheet.getLastRow();

  if (lastRow <= 1) {
    return -1;
  }

  const ids = sheet
    .getRange(2, 1, lastRow - 1, 1)
    .getValues();

  for (let i = 0; i < ids.length; i++) {

    if (String(ids[i][0]) === String(id)) {
      return i + 2;
    }

  }

  return -1;
}


/**
 * Format date/time
 */
function formatDate(value) {

  if (!value) {
    return "";
  }

  if (Object.prototype.toString.call(value) === "[object Date]") {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );

  }

  return String(value);
}

