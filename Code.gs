const SHEET_NAME = "Data";

/**
 * ==========================================
 * WEB APP
 * ==========================================
 */
function doGet() {
  return HtmlService
    .createHtmlOutputFromFile("Index")
    .setTitle("CRUD Management System")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}


/**
 * ==========================================
 * GET / CREATE SHEET
 * ==========================================
 */
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  let sheet = ss.getSheetByName(SHEET_NAME);

  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);

    sheet.getRange(1, 1, 1, 7).setValues([[
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
      .setBackground("#1d4ed8")
      .setFontColor("#ffffff");

    sheet.setFrozenRows(1);

    sheet.setColumnWidth(1, 220);
    sheet.setColumnWidth(2, 180);
    sheet.setColumnWidth(3, 220);
    sheet.setColumnWidth(4, 150);
    sheet.setColumnWidth(5, 120);
    sheet.setColumnWidth(6, 180);
    sheet.setColumnWidth(7, 180);
  }

  return sheet;
}


/**
 * ==========================================
 * READ
 * ==========================================
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
 * ==========================================
 * CREATE
 * ==========================================
 */
function createRecord(data) {

  if (!data) {
    throw new Error("No data received.");
  }

  if (!data.name || data.name.trim() === "") {
    throw new Error("Name is required.");
  }

  if (!data.email || data.email.trim() === "") {
    throw new Error("Email is required.");
  }

  const sheet = getSheet();

  const id = generateId();

  const now = new Date();

  sheet.appendRow([
    id,
    data.name.trim(),
    data.email.trim(),
    data.phone ? data.phone.trim() : "",
    data.status || "Active",
    now,
    now
  ]);

  return {
    success: true,
    message: "Record created successfully.",
    id: id
  };
}


/**
 * ==========================================
 * UPDATE
 * ==========================================
 */
function updateRecord(data) {

  if (!data || !data.id) {
    throw new Error("Record ID is required.");
  }

  if (!data.name || data.name.trim() === "") {
    throw new Error("Name is required.");
  }

  if (!data.email || data.email.trim() === "") {
    throw new Error("Email is required.");
  }

  const sheet = getSheet();

  const row = findRowById(data.id);

  if (row === -1) {
    throw new Error("Record not found.");
  }

  const createdAt =
    sheet.getRange(row, 6).getValue();

  sheet.getRange(row, 1, 1, 7).setValues([[
    data.id,
    data.name.trim(),
    data.email.trim(),
    data.phone ? data.phone.trim() : "",
    data.status || "Active",
    createdAt,
    new Date()
  ]]);

  return {
    success: true,
    message: "Record updated successfully."
  };
}


/**
 * ==========================================
 * DELETE
 * ==========================================
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
    message: "Record deleted successfully."
  };
}


/**
 * ==========================================
 * FIND ROW BY ID
 * ==========================================
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
 * ==========================================
 * GENERATE UNIQUE ID
 * ==========================================
 */
function generateId() {

  const timestamp =
    new Date().getTime();

  const random =
    Math.floor(Math.random() * 10000);

  return "REC-" +
    timestamp +
    "-" +
    random;
}


/**
 * ==========================================
 * FORMAT DATE
 * ==========================================
 */
function formatDate(value) {

  if (!value) {
    return "";
  }

  if (
    Object.prototype.toString.call(value)
    === "[object Date]"
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      "yyyy-MM-dd HH:mm:ss"
    );

  }

  return String(value);
}
