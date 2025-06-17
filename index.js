
/* --------------------------------------------------
-------------------------------------------------- */
const DB_NAME   = "SCHOOL-DB";
const REL_NAME  = "STUDENT-TABLE";
const BASE_URL  = "http://api.login2explore.com:5577";
const TOKEN     = "90934561|-31949212883518373|90956574";
const IRL       = "/api/irl";
const IML       = "/api/iml";

$("#rollNo").focus();

/* ---------- helpers ---------- */
function saveRecNo2LS(jsObj) {
  const recNo = JSON.parse(jsObj.data).rec_no;
  localStorage.setItem("recno", recNo);
}

function rollNoJSON() {
  const rollNo = $("#rollNo").val().trim();
  return JSON.stringify({ roll_no: rollNo });
}

/* fill form after GET */
function fillData(jsObj) {
  saveRecNo2LS(jsObj);
  const rec = JSON.parse(jsObj.data).record;

  $("#rollNo").val(rec.roll_no);
  $("#fullName").val(rec.full_name);
  $("#class").val(rec.class);
  $("#birthDate").val(rec.birth_date);
  $("#address").val(rec.address);
  $("#enrollDate").val(rec.enrollment_date);
}

/* ---------- CRUD ---------- */
function getStudent() {
  const getReq = createGET_BY_KEYRequest(
    TOKEN, DB_NAME, REL_NAME, rollNoJSON()
  );

  $.ajaxSetup({ async: false });
  const res = executeCommandAtGivenBaseUrl(getReq, BASE_URL, IRL);
  $.ajaxSetup({ async: true });

  if (res.status === 400) {
    $("#save,#reset").prop("disabled", false);
    $("#fullName").focus();
  } else if (res.status === 200) {
    $("#rollNo").prop("disabled", true);
    fillData(res);
    $("#change,#reset").prop("disabled", false);
    $("#fullName").focus();
  }
}

/* validate & build JSON */
function validate() {
  const rollNo   = $("#rollNo").val().trim();
  const fullName = $("#fullName").val().trim();
  const stdClass = $("#class").val().trim();
  const bDate    = $("#birthDate").val().trim();
  const addr     = $("#address").val().trim();
  const eDate    = $("#enrollDate").val().trim();

  if (!rollNo)   { alert("Roll No missing");   $("#rollNo").focus();   return ""; }
  if (!fullName) { alert("Full Name missing"); $("#fullName").focus(); return ""; }
  if (!stdClass) { alert("Class missing");     $("#class").focus();    return ""; }
  if (!bDate)    { alert("Birth Date missing");$("#birthDate").focus();return ""; }
  if (!addr)     { alert("Address missing");   $("#address").focus();  return ""; }
  if (!eDate)    { alert("Enrollment Date missing"); $("#enrollDate").focus(); return ""; }

  return JSON.stringify({
    roll_no:         rollNo,
    full_name:       fullName,
    class:           stdClass,
    birth_date:      bDate,
    address:         addr,
    enrollment_date: eDate
  });
}

/* save (PUT) */
function saveData() {
  const json = validate();
  if (!json) return;

  const putReq = createPUTRequest(TOKEN, json, DB_NAME, REL_NAME);

  $.ajaxSetup({ async: false });
  const res = executeCommandAtGivenBaseUrl(putReq, BASE_URL, IML);
  $.ajaxSetup({ async: true });

  alert("Saved! Record‑no: " + JSON.parse(res.data).rec_no);
  resetForm();
}

/* change (UPDATE) */
function changeData() {
  const json = validate();
  if (!json) return;

  const recNo = localStorage.getItem("recno");
  const updReq = createUPDATERecordRequest(TOKEN, json, DB_NAME, REL_NAME, recNo);

  $.ajaxSetup({ async: false });
  executeCommandAtGivenBaseUrl(updReq, BASE_URL, IML);
  $.ajaxSetup({ async: true });

  alert("Updated!");
  resetForm();
}

/* reset form */
function resetForm() {
  $("#rollNo,#fullName,#class,#birthDate,#address,#enrollDate").val("");
  $("#rollNo").prop("disabled", false);
  $("#save,#change").prop("disabled", true);
  $("#rollNo").focus();
}

















 


