```javascript
// =====================================================
// GOOGLE APPS SCRIPT WEB APP URL
// =====================================================

const API_URL =
  "https://script.google.com/macros/s/AKfycbxbFsfTXx_sUWkYKLWOMdlP67RCrZpIh6s_AOWsXozsvYDRuddDXCwAzNkMVjix-9kP/exec";


// =====================================================
// GLOBAL DATA
// =====================================================

let records = [];
let editingId = null;


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", () => {

  loadRecords();

  const form =
    document.getElementById("recordForm");

  if (form) {
    form.addEventListener(
      "submit",
      handleSubmit
    );
  }

});


// =====================================================
// GET RECORDS
// =====================================================

async function loadRecords() {

  const loading =
    document.getElementById("loading");

  if (loading) {
    loading.style.display = "block";
  }

  try {

    const response = await fetch(
      API_URL + "?action=getRecords"
    );

    const result =
      await response.json();

    console.log("GET RESPONSE:", result);

    if (!result.success) {

      throw new Error(
        result.message ||
        "Unable to get records."
      );

    }

    records =
      result.records || [];

    displayRecords(records);

  }

  catch (error) {

    console.error(
      "Load error:",
      error
    );

    showMessage(
      "Unable to load records: " +
      error.message,
      "error"
    );

  }

  finally {

    if (loading) {
      loading.style.display = "none";
    }

  }

}


// =====================================================
// CREATE / UPDATE
// =====================================================

async function handleSubmit(event) {

  event.preventDefault();


  const id =
    document.getElementById(
      "recordId"
    ).value.trim();


  const name =
    document.getElementById(
      "name"
    ).value.trim();


  const email =
    document.getElementById(
      "email"
    ).value.trim();


  const phone =
    document.getElementById(
      "phone"
    ).value.trim();


  const status =
    document.getElementById(
      "status"
    ).value;


  if (!name) {

    showMessage(
      "Name is required.",
      "error"
    );

    return;

  }


  if (!email) {

    showMessage(
      "Email is required.",
      "error"
    );

    return;

  }


  const action =
    id ? "update" : "create";


  const formData =
    new URLSearchParams();


  formData.append(
    "action",
    action
  );


  if (id) {

    formData.append(
      "id",
      id
    );

  }


  formData.append(
    "name",
    name
  );


  formData.append(
    "email",
    email
  );


  formData.append(
    "phone",
    phone
  );


  formData.append(
    "status",
    status
  );


  const button =
    document.getElementById(
      "submitButton"
    );


  if (button) {

    button.disabled = true;

    button.textContent =
      action === "create"
        ? "Saving..."
        : "Updating...";

  }


  try {

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();


    console.log(
      "POST RESPONSE:",
      result
    );


    if (!result.success) {

      throw new Error(
        result.message ||
        "Operation failed."
      );

    }


    showMessage(
      result.message,
      "success"
    );


    resetForm();


    await loadRecords();

  }

  catch (error) {

    console.error(
      "Save error:",
      error
    );

    showMessage(
      "Error: " +
      error.message,
      "error"
    );

  }

  finally {

    if (button) {

      button.disabled = false;

      button.textContent =
        "Add Record";

    }

  }

}


// =====================================================
// EDIT RECORD
// =====================================================

function editRecord(id) {

  const record =
    records.find(
      item =>
        String(item.id) ===
        String(id)
    );


  if (!record) {

    showMessage(
      "Record not found.",
      "error"
    );

    return;

  }


  document.getElementById(
    "recordId"
  ).value =
    record.id;


  document.getElementById(
    "name"
  ).value =
    record.name || "";


  document.getElementById(
    "email"
  ).value =
    record.email || "";


  document.getElementById(
    "phone"
  ).value =
    record.phone || "";


  document.getElementById(
    "status"
  ).value =
    record.status || "Active";


  const button =
    document.getElementById(
      "submitButton"
    );


  if (button) {

    button.textContent =
      "Update Record";

  }


  window.scrollTo({

    top: 0,

    behavior: "smooth"

  });

}


// =====================================================
// DELETE RECORD
// =====================================================

async function deleteRecord(id) {

  const confirmed =
    confirm(
      "Are you sure you want to delete this record?"
    );


  if (!confirmed) {
    return;
  }


  const formData =
    new URLSearchParams();


  formData.append(
    "action",
    "delete"
  );


  formData.append(
    "id",
    id
  );


  try {

    const response =
      await fetch(
        API_URL,
        {
          method: "POST",
          body: formData
        }
      );


    const result =
      await response.json();


    console.log(
      "DELETE RESPONSE:",
      result
    );


    if (!result.success) {

      throw new Error(
        result.message ||
        "Delete failed."
      );

    }


    showMessage(
      result.message,
      "success"
    );


    await loadRecords();

  }

  catch (error) {

    console.error(
      "Delete error:",
      error
    );

    showMessage(
      "Delete failed: " +
      error.message,
      "error"
    );

  }

}


// =====================================================
// DISPLAY RECORDS
// =====================================================

function displayRecords(data) {

  const table =
    document.getElementById(
      "recordTable"
    );


  if (!table) {
    return;
  }


  table.innerHTML = "";


  if (
    !data ||
    data.length === 0
  ) {

    table.innerHTML = `

      <tr>

        <td
          colspan="7"
          style="text-align:center;"
        >
          No records found.
        </td>

      </tr>

    `;

    return;

  }


  data.forEach(record => {

    const row =
      document.createElement("tr");


    row.innerHTML = `

      <td>
        ${escapeHtml(record.id)}
      </td>

      <td>
        ${escapeHtml(record.name)}
      </td>

      <td>
        ${escapeHtml(record.email)}
      </td>

      <td>
        ${escapeHtml(record.phone)}
      </td>

      <td>
        ${escapeHtml(record.status)}
      </td>

      <td>
        ${escapeHtml(record.createdAt)}
      </td>

      <td>

        <button
          type="button"
          onclick="editRecord('${escapeJs(record.id)}')"
        >
          Edit
        </button>

        <button
          type="button"
          onclick="deleteRecord('${escapeJs(record.id)}')"
        >
          Delete
        </button>

      </td>

    `;


    table.appendChild(row);

  });

}


// =====================================================
// SEARCH
// =====================================================

function searchRecords() {

  const input =
    document.getElementById(
      "searchInput"
    );


  if (!input) {
    return;
  }


  const keyword =
    input.value
      .toLowerCase()
      .trim();


  if (!keyword) {

    displayRecords(records);

    return;

  }


  const filtered =
    records.filter(record => {

      return (

        String(record.id)
          .toLowerCase()
          .includes(keyword)

        ||

        String(record.name)
          .toLowerCase()
          .includes(keyword)

        ||

        String(record.email)
          .toLowerCase()
          .includes(keyword)

        ||

        String(record.phone)
          .toLowerCase()
          .includes(keyword)

        ||

        String(record.status)
          .toLowerCase()
          .includes(keyword)

      );

    });


  displayRecords(filtered);

}


// =====================================================
// RESET FORM
// =====================================================

function resetForm() {

  const form =
    document.getElementById(
      "recordForm"
    );


  if (form) {
    form.reset();
  }


  const id =
    document.getElementById(
      "recordId"
    );


  if (id) {
    id.value = "";
  }


  const status =
    document.getElementById(
      "status"
    );


  if (status) {
    status.value = "Active";
  }


  const button =
    document.getElementById(
      "submitButton"
    );


  if (button) {

    button.textContent =
      "Add Record";

    button.disabled = false;

  }

}


// =====================================================
// MESSAGE
// =====================================================

function showMessage(
  message,
  type
) {

  let element =
    document.getElementById(
      "message"
    );


  // Create message element
  // if it doesn't exist.

  if (!element) {

    element =
      document.createElement(
        "div"
      );

    element.id =
      "message";

    document.body.prepend(
      element
    );

  }


  element.textContent =
    message;


  element.className =
    "message " + type;


  element.style.display =
    "block";


  setTimeout(() => {

    element.style.display =
      "none";

  }, 4000);

}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHtml(value) {

  if (
    value === null ||
    value === undefined
  ) {

    return "";

  }


  return String(value)

    .replace(
      /&/g,
      "&amp;"
    )

    .replace(
      /</g,
      "&lt;"
    )

    .replace(
      />/g,
      "&gt;"
    )

    .replace(
      /"/g,
      "&quot;"
    )

    .replace(
      /'/g,
      "&#039;"
    );

}


// =====================================================
// ESCAPE JAVASCRIPT
// =====================================================

function escapeJs(value) {

  return String(value)

    .replace(
      /\\/g,
      "\\\\"
    )

    .replace(
      /'/g,
      "\\'"
    );

}
```
