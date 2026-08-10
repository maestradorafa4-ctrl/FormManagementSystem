```javascript
// ==========================================
// GOOGLE APPS SCRIPT API URL
// ==========================================

const API_URL =
  "https://script.google.com/macros/s/AKfycby_REBLjTUhXP91uZYzLTZ3WYz4Edj-vU8H_O6g9SAWnzVdOVHdoJ647df84zyOY7-T/exec";


// ==========================================
// DATA
// ==========================================

let records = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
  "DOMContentLoaded",
  function () {

    loadRecords();

    setupForm();

    setupSearch();

  }
);


// ==========================================
// LOAD RECORDS
// ==========================================

async function loadRecords() {

  showLoading(true);

  try {

    const response =
      await fetch(
        API_URL +
        "?action=getRecords"
      );


    const data =
      await response.json();


    if (
      !Array.isArray(data)
    ) {

      throw new Error(
        "Invalid response from server."
      );

    }


    records =
      data;


    renderRecords(
      records
    );

  }

  catch (error) {

    console.error(error);

    showMessage(
      "Failed to load records: " +
      error.message,
      "error"
    );

  }

  finally {

    showLoading(false);

  }

}


// ==========================================
// CREATE
// ==========================================

async function createRecord(
  data
) {

  try {

    const params =
      new URLSearchParams();


    params.append(
      "action",
      "create"
    );


    params.append(
      "name",
      data.name
    );


    params.append(
      "email",
      data.email
    );


    params.append(
      "phone",
      data.phone
    );


    params.append(
      "status",
      data.status
    );


    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          body: params
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.message
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

    console.error(error);

    showMessage(
      error.message,
      "error"
    );

  }

}


// ==========================================
// UPDATE
// ==========================================

async function updateRecord(
  data
) {

  try {

    const params =
      new URLSearchParams();


    params.append(
      "action",
      "update"
    );


    params.append(
      "id",
      data.id
    );


    params.append(
      "name",
      data.name
    );


    params.append(
      "email",
      data.email
    );


    params.append(
      "phone",
      data.phone
    );


    params.append(
      "status",
      data.status
    );


    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          body: params
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.message
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

    console.error(error);

    showMessage(
      error.message,
      "error"
    );

  }

}


// ==========================================
// DELETE
// ==========================================

async function deleteRecord(
  id
) {

  if (
    !confirm(
      "Are you sure you want to delete this record?"
    )
  ) {

    return;

  }


  try {

    const params =
      new URLSearchParams();


    params.append(
      "action",
      "delete"
    );


    params.append(
      "id",
      id
    );


    const response =
      await fetch(
        API_URL,
        {
          method: "POST",

          body: params
        }
      );


    const result =
      await response.json();


    if (!result.success) {

      throw new Error(
        result.message
      );

    }


    showMessage(
      result.message,
      "success"
    );


    await loadRecords();

  }

  catch (error) {

    console.error(error);

    showMessage(
      error.message,
      "error"
    );

  }

}


// ==========================================
// FORM
// ==========================================

function setupForm() {

  const form =
    document.getElementById(
      "recordForm"
    );


  form.addEventListener(
    "submit",
    function (event) {

      event.preventDefault();


      const id =
        document.getElementById(
          "recordId"
        ).value;


      const data = {

        id: id,

        name:
          document.getElementById(
            "name"
          ).value.trim(),

        email:
          document.getElementById(
            "email"
          ).value.trim(),

        phone:
          document.getElementById(
            "phone"
          ).value.trim(),

        status:
          document.getElementById(
            "status"
          ).value

      };


      if (!data.name) {

        showMessage(
          "Name is required.",
          "error"
        );

        return;

      }


      if (!data.email) {

        showMessage(
          "Email is required.",
          "error"
        );

        return;

      }


      const button =
        document.getElementById(
          "submitButton"
        );


      button.disabled =
        true;


      if (id) {

        updateRecord(
          data
        );

      }

      else {

        createRecord(
          data
        );

      }


      setTimeout(
        function () {

          button.disabled =
            false;

        },
        1000
      );

    }
  );

}


// ==========================================
// EDIT
// ==========================================

function editRecord(
  id
) {

  const record =
    records.find(
      function (item) {

        return String(
          item.id
        ) === String(id);

      }
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
    record.name;


  document.getElementById(
    "email"
  ).value =
    record.email;


  document.getElementById(
    "phone"
  ).value =
    record.phone;


  document.getElementById(
    "status"
  ).value =
    record.status;


  document.getElementById(
    "submitButton"
  ).textContent =
    "Update Record";


  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

}


// ==========================================
// RESET
// ==========================================

function resetForm() {

  document
    .getElementById(
      "recordForm"
    )
    .reset();


  document.getElementById(
    "recordId"
  ).value = "";


  document.getElementById(
    "status"
  ).value =
    "Active";


  document.getElementById(
    "submitButton"
  ).textContent =
    "Add Record";


  document.getElementById(
    "submitButton"
  ).disabled =
    false;

}


// ==========================================
// SEARCH
// ==========================================

function setupSearch() {

  document
    .getElementById(
      "searchInput"
    )
    .addEventListener(
      "input",
      searchRecords
    );

}


function searchRecords() {

  const search =
    document
      .getElementById(
        "searchInput"
      )
      .value
      .toLowerCase()
      .trim();


  if (!search) {

    renderRecords(
      records
    );

    return;

  }


  const filtered =
    records.filter(
      function (record) {

        return (

          String(
            record.id
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            record.name
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            record.email
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            record.phone
          )
            .toLowerCase()
            .includes(search)

          ||

          String(
            record.status
          )
            .toLowerCase()
            .includes(search)

        );

      }
    );


  renderRecords(
    filtered
  );

}


// ==========================================
// RENDER TABLE
// ==========================================

function renderRecords(
  data
) {

  const table =
    document.getElementById(
      "recordTable"
    );


  table.innerHTML =
    "";


  if (
    !data ||
    data.length === 0
  ) {

    table.innerHTML = `

      <tr>

        <td
          colspan="7"
          class="empty"
        >
          No records found.
        </td>

      </tr>

    `;

    return;

  }


  data.forEach(
    function (record) {

      const row =
        document.createElement(
          "tr"
        );


      const statusClass =
        record.status ===
        "Active"

          ? "status-active"

          : "status-inactive";


      row.innerHTML = `

        <td>
          ${escapeHtml(
            record.id
          )}
        </td>

        <td>
          ${escapeHtml(
            record.name
          )}
        </td>

        <td>
          ${escapeHtml(
            record.email
          )}
        </td>

        <td>
          ${escapeHtml(
            record.phone
          )}
        </td>

        <td>

          <span
            class="status ${statusClass}"
          >
            ${escapeHtml(
              record.status
            )}
          </span>

        </td>

        <td>
          ${escapeHtml(
            record.createdAt
          )}
        </td>

        <td>

          <div class="action-buttons">

            <button
              class="btn-edit"
              onclick="editRecord('${escapeJs(record.id)}')"
            >
              Edit
            </button>

            <button
              class="btn-delete"
              onclick="deleteRecord('${escapeJs(record.id)}')"
            >
              Delete
            </button>

          </div>

        </td>

      `;


      table.appendChild(
        row
      );

    }
  );

}


// ==========================================
// LOADING
// ==========================================

function showLoading(
  show
) {

  const loading =
    document.getElementById(
      "loading"
    );


  loading.style.display =
    show
      ? "block"
      : "none";

}


// ==========================================
// MESSAGE
// ==========================================

function showMessage(
  message,
  type
) {

  const element =
    document.getElementById(
      "message"
    );


  if (!element) {

    alert(message);

    return;

  }


  element.textContent =
    message;


  element.className =
    type;


  element.style.display =
    "block";


  setTimeout(
    function () {

      element.style.display =
        "none";

    },
    3500
  );

}


// ==========================================
// SECURITY
// ==========================================

function escapeHtml(
  value
) {

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


function escapeJs(
  value
) {

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
