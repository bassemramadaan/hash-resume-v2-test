/**
 * Hash Resume - Google Apps Script Backend (Code.gs)
 * Spreadsheet ID: 1PIEj3u0KSts6Pr5biaSt2DU8XbK0l03oWNGkYfJfYWU
 *
 * Sheets:
 *  - Manual: A:Reference | B:Sender Info | C:Email | D:Amount | E:Timestamp | F:Status | G:Edit Approval | H:AssignedCodes | I:BundleEmailSentAt
 *  - Codes:  A:Code | B:Status | C:UserEmail | D:AssignedAt | E:UsedAt | F:Transfer | G:Reference
 */

var SPREADSHEET_ID = '1PIEj3u0KSts6Pr5biaSt2DU8XbK0l03oWNGkYfJfYWU';

function getSpreadsheet() {
  if (SPREADSHEET_ID && SPREADSHEET_ID.length > 10) {
    return SpreadsheetApp.openById(SPREADSHEET_ID);
  }
  return SpreadsheetApp.getActiveSpreadsheet();
}

/**
  Ensures auto-created columns exist in Manual and Codes sheets without altering existing columns.
 */
function ensureHeaders() {
  var ss = getSpreadsheet();
  
  // Sheet Manual
  var manualSheet = ss.getSheetByName('Manual');
  if (manualSheet) {
    var lastCol = manualSheet.getLastColumn() || 1;
    var manualHeaders = manualSheet.getRange(1, 1, 1, lastCol).getValues()[0];
    var requiredManual = ['AssignedCodes', 'BundleEmailSentAt'];
    requiredManual.forEach(function(colName) {
      if (manualHeaders.indexOf(colName) === -1) {
        var newColIdx = manualSheet.getLastColumn() + 1;
        manualSheet.getRange(1, newColIdx).setValue(colName);
        manualHeaders.push(colName);
      }
    });
  }

  // Sheet Codes
  var codesSheet = ss.getSheetByName('Codes');
  if (codesSheet) {
    var lastColCodes = codesSheet.getLastColumn() || 1;
    var codesHeaders = codesSheet.getRange(1, 1, 1, lastColCodes).getValues()[0];
    var requiredCodes = ['AssignedAt', 'UsedAt', 'Reference'];
    requiredCodes.forEach(function(colName) {
      if (codesHeaders.indexOf(colName) === -1) {
        var newColIdx = codesSheet.getLastColumn() + 1;
        codesSheet.getRange(1, newColIdx).setValue(colName);
        codesHeaders.push(colName);
      }
    });
  }
}

/**
 * HTTP Handlers
 */
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  ensureHeaders();
  var params = e ? (e.parameter || {}) : {};
  var postData = {};
  if (e && e.postData && e.postData.contents) {
    try {
      postData = JSON.parse(e.postData.contents);
    } catch (err) {}
  }

  var action = params.action || postData.action || '';

  if (action === 'submit_payment' || action === 'submitPayment') {
    return jsonResponse(submitPayment(
      postData.reference || params.reference || params.tx,
      postData.senderInfo || params.senderInfo,
      postData.email || params.email,
      postData.amount || params.amount
    ));
  } else if (action === 'submit_hunt_profile' || action === 'submitHuntProfile') {
    return jsonResponse(submitHuntProfile(postData.submission || postData, postData.sheetRow));
  } else if (action === 'check_status' || action === 'checkStatus') {
    var ref = params.tx || params.reference || postData.reference || postData.tx;
    return jsonResponse(checkStatus(ref));
  } else if (action === 'verify') {
    var code = params.code || postData.code;
    return jsonResponse(verify(code));
  } else if (action === 'approve_edit' || action === 'approveEdit') {
    return jsonResponse(approveEdit(
      postData.reference || params.reference,
      postData.approved !== undefined ? postData.approved : params.approved
    ));
  }

  return jsonResponse({ success: false, error: 'Invalid action requested' });
}

/**
 * 0. submitHuntProfile: Appends candidate record to Form_Responses sheet and saves to Drive
 * Folder ID: 1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV
 */
function submitHuntProfile(submission, sheetRow) {
  try {
    var ss = getSpreadsheet();
    var sheet = ss.getSheetByName('Form_Responses') || ss.getSheetByName('Responses') || ss.getSheets()[0];
    
    var DRIVE_FOLDER_ID = '1C0vT4ERPy9SCyXULssVE6NKo5l9_IpqPap5tUNgkZt84-JsqLNuf6lsz5R9rRG56pODHzYHV';
    var driveLink = 'https://drive.google.com/drive/folders/' + DRIVE_FOLDER_ID;

    // Check if base64 file data provided to upload to Google Drive folder
    if (submission && submission.cvBase64 && submission.cvFileName) {
      try {
        var folder = DriveApp.getFolderById(DRIVE_FOLDER_ID);
        var decodedBytes = Utilities.base64Decode(submission.cvBase64);
        var blob = Utilities.newBlob(decodedBytes, 'application/pdf', submission.cvFileName);
        var file = folder.createFile(blob);
        file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
        driveLink = file.getUrl();
      } catch (driveErr) {
        Logger.log('Drive file upload warning: ' + driveErr.toString());
      }
    }

    var timestamp = submission.timestamp || Utilities.formatDate(new Date(), 'GMT+2', 'M/d/yyyy HH:mm:ss');
    var fullName = submission.fullName || '';
    var phone = submission.phoneNumber || '';
    var email = submission.email || '';
    var jobTitle = submission.jobTitle || '';
    var expYears = submission.yearsOfExperience || '';
    var openTo = submission.openTo || '';

    // Columns: Timestamp | Name | Phone number | Email | Job/Career | Submit Your CV - Hash Resume. (Hash Hunt) | Email Address | Exp Years | Open to
    var rowToAppend = [
      timestamp,
      fullName,
      phone,
      email,
      jobTitle,
      driveLink,
      email,
      expYears,
      openTo
    ];

    sheet.appendRow(rowToAppend);

    return {
      success: true,
      message: 'Candidate profile recorded successfully in Google Sheet and Google Drive',
      driveLink: driveLink,
      row: rowToAppend
    };
  } catch (err) {
    return {
      success: false,
      error: err.toString()
    };
  }
}

function jsonResponse(data) {
  return ContentService.createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 1. submitPayment: Records new payment submission in Manual sheet.
 */
function submitPayment(reference, senderInfo, email, amount) {
  if (!reference) {
    return { success: false, error: 'Reference is required' };
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Manual');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var refIdx = headers.indexOf('Reference');

  // Avoid duplicates if already submitted
  for (var i = 1; i < data.length; i++) {
    if (String(data[i][refIdx]).trim() === String(reference).trim()) {
      return {
        success: true,
        message: 'Payment reference already recorded',
        status: data[i][headers.indexOf('Status')] || 'pending'
      };
    }
  }

  var row = [];
  headers.forEach(function(h) {
    if (h === 'Reference') row.push(reference);
    else if (h === 'Sender Info') row.push(senderInfo || '');
    else if (h === 'Email') row.push(email || '');
    else if (h === 'Amount') row.push(amount || '');
    else if (h === 'Timestamp') row.push(new Date());
    else if (h === 'Status') row.push('pending');
    else if (h === 'Edit Approval') row.push('pending');
    else row.push('');
  });

  sheet.appendRow(row);
  return { success: true, status: 'pending', message: 'Payment reference submitted successfully' };
}

/**
 * 2. checkStatus: Checks approval status in Manual sheet and auto-assigns UNUSED codes from Codes sheet.
 */
function checkStatus(reference) {
  if (!reference) {
    return { status: 'error', message: 'Reference is required' };
  }

  var ss = getSpreadsheet();
  var manualSheet = ss.getSheetByName('Manual');
  var codesSheet = ss.getSheetByName('Codes');

  var manualData = manualSheet.getDataRange().getValues();
  var manualHeaders = manualData[0];

  var refIdx = manualHeaders.indexOf('Reference');
  var emailIdx = manualHeaders.indexOf('Email');
  var amountIdx = manualHeaders.indexOf('Amount');
  var statusIdx = manualHeaders.indexOf('Status');
  var assignedCodesIdx = manualHeaders.indexOf('AssignedCodes');
  var bundleEmailSentAtIdx = manualHeaders.indexOf('BundleEmailSentAt');

  // 1. Locate row in Manual sheet
  var rowIndex = -1;
  var rowData = null;
  for (var i = 1; i < manualData.length; i++) {
    if (String(manualData[i][refIdx]).trim() === String(reference).trim()) {
      rowIndex = i + 1; // 1-based index in Sheet
      rowData = manualData[i];
      break;
    }
  }

  if (rowIndex === -1) {
    return { status: 'not_found', message: 'Payment reference not found' };
  }

  var status = String(rowData[statusIdx] || '').trim().toLowerCase();

  // 2. Return pending or non-approved status directly
  if (status === 'pending') {
    return { status: 'pending', message: 'Payment is pending manual verification' };
  }
  if (status !== 'approved') {
    return { status: status, message: 'Payment status: ' + status };
  }

  var email = String(rowData[emailIdx] || '').trim();
  var amount = String(rowData[amountIdx] || '').trim();
  var existingAssignedStr = String(rowData[assignedCodesIdx] || '').trim();
  var bundleEmailSentAt = rowData[bundleEmailSentAtIdx];

  // Determine if this is a 120 EGP bundle (3 codes) or 50 EGP single (1 code)
  var isBundle = (amount === '120' || amount.indexOf('120') !== -1 || amount.indexOf('bundle') !== -1 || amount.indexOf('3') !== -1);
  var requiredCount = isBundle ? 3 : 1;

  // If codes are ALREADY assigned for this reference, return them without re-allocating
  if (existingAssignedStr.length > 0) {
    var existingCodes = existingAssignedStr.split(',').map(function(c) { return c.trim(); });
    if (isBundle && existingCodes.length >= 3) {
      return {
        status: 'approved',
        activatedCode: existingCodes[0],
        remainingCodes: [existingCodes[1], existingCodes[2]],
        codes: existingCodes
      };
    } else {
      return {
        status: 'approved',
        activatedCode: existingCodes[0],
        codes: [existingCodes[0]]
      };
    }
  }

  // 3. Thread locking for allocating UNUSED codes
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000); // Wait up to 10 seconds
  } catch (err) {
    return { status: 'error', message: 'Server busy, please try again' };
  }

  try {
    // Re-verify Manual row inside lock to prevent race conditions
    manualData = manualSheet.getDataRange().getValues();
    rowData = manualData[rowIndex - 1];
    existingAssignedStr = String(rowData[assignedCodesIdx] || '').trim();

    if (existingAssignedStr.length > 0) {
      var reExistingCodes = existingAssignedStr.split(',').map(function(c) { return c.trim(); });
      lock.releaseLock();
      if (isBundle && reExistingCodes.length >= 3) {
        return {
          status: 'approved',
          activatedCode: reExistingCodes[0],
          remainingCodes: [reExistingCodes[1], reExistingCodes[2]],
          codes: reExistingCodes
        };
      } else {
        return {
          status: 'approved',
          activatedCode: reExistingCodes[0],
          codes: [reExistingCodes[0]]
        };
      }
    }

    // Read Codes sheet to find UNUSED codes
    var codesData = codesSheet.getDataRange().getValues();
    var codesHeaders = codesData[0];

    var codeColIdx = codesHeaders.indexOf('Code');
    var codeStatusColIdx = codesHeaders.indexOf('Status');
    var codeUserEmailColIdx = codesHeaders.indexOf('UserEmail');
    var codeAssignedAtColIdx = codesHeaders.indexOf('AssignedAt');
    var codeRefColIdx = codesHeaders.indexOf('Reference');

    var availableRows = [];
    var availableCodes = [];

    for (var j = 1; j < codesData.length; j++) {
      var cStatus = String(codesData[j][codeStatusColIdx] || '').trim().toUpperCase();
      if (cStatus === 'UNUSED') {
        availableRows.push(j + 1); // 1-based index in Sheet
        availableCodes.push(String(codesData[j][codeColIdx]).trim());
        if (availableCodes.length === requiredCount) {
          break;
        }
      }
    }

    // Check if enough UNUSED codes exist
    if (availableCodes.length < requiredCount) {
      lock.releaseLock();
      return {
        status: 'approved',
        error: 'تمت الموافقة على الدفع، لكن الأكواد غير متاحة حالياً.',
        message: 'Payment approved, but activation codes are currently out of stock.'
      };
    }

    var now = new Date();

    // Automatically update Codes sheet: UNUSED -> ASSIGNED
    for (var k = 0; k < availableRows.length; k++) {
      var sheetRow = availableRows[k];
      codesSheet.getRange(sheetRow, codeStatusColIdx + 1).setValue('ASSIGNED');
      codesSheet.getRange(sheetRow, codeUserEmailColIdx + 1).setValue(email);
      codesSheet.getRange(sheetRow, codeAssignedAtColIdx + 1).setValue(now);
      codesSheet.getRange(sheetRow, codeRefColIdx + 1).setValue(reference);
    }

    // Save assigned codes in Manual.AssignedCodes
    var assignedCodesStr = availableCodes.join(',');
    manualSheet.getRange(rowIndex, assignedCodesIdx + 1).setValue(assignedCodesStr);

    // If 120 EGP bundle, send codes 2 & 3 via email ONLY (Do NOT send Code 1)
    if (isBundle && availableCodes.length >= 3) {
      if (email && email.indexOf('@') !== -1 && !bundleEmailSentAt) {
        try {
          var remainingCodes = [availableCodes[1], availableCodes[2]];
          var subject = 'أكوادك الإضافية لباقة 3 تفعيلات - Hash Resume';
          var body = 'مرحباً،\n\n' +
            'شكراً لاستخدامك Hash Resume!\n' +
            'تم تفعيل سيرتك الذاتية الأولى مباشرة.\n\n' +
            'إليك الأكواد الإضافية المتبقية لإنشاء وتصدير سيرتك الذاتية في المستقبل:\n' +
            '1. ' + remainingCodes[0] + '\n' +
            '2. ' + remainingCodes[1] + '\n\n' +
            'احفظ هذه الأكواد جيداً لاستخدامها في أي وقت.\n\n' +
            'مع تحيات فريق Hash Resume';

          MailApp.sendEmail(email, subject, body);
          manualSheet.getRange(rowIndex, bundleEmailSentAtIdx + 1).setValue(now);
        } catch (emailErr) {
          Logger.log('Email send failed: ' + emailErr);
        }
      }
    }

    lock.releaseLock();

    // Prepare response
    if (isBundle && availableCodes.length >= 3) {
      return {
        status: 'approved',
        activatedCode: availableCodes[0],
        remainingCodes: [availableCodes[1], availableCodes[2]],
        codes: availableCodes
      };
    } else {
      return {
        status: 'approved',
        activatedCode: availableCodes[0],
        codes: [availableCodes[0]]
      };
    }
  } catch (err) {
    lock.releaseLock();
    return { status: 'error', message: err.toString() };
  }
}

/**
 * 3. verify: Validates activation code when used for PDF export, converting ASSIGNED to USED.
 */
function verify(code) {
  if (!code) {
    return { success: false, valid: false, message: 'Code is required' };
  }

  var cleanCode = String(code).trim();
  var ss = getSpreadsheet();
  var codesSheet = ss.getSheetByName('Codes');
  var codesData = codesSheet.getDataRange().getValues();
  var headers = codesData[0];

  var codeColIdx = headers.indexOf('Code');
  var statusColIdx = headers.indexOf('Status');
  var usedAtColIdx = headers.indexOf('UsedAt');

  // Thread locking during state change from ASSIGNED to USED
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);
  } catch (err) {
    return { success: false, valid: false, message: 'Server busy, please try again' };
  }

  try {
    codesData = codesSheet.getDataRange().getValues();
    var codeRow = -1;

    for (var i = 1; i < codesData.length; i++) {
      if (String(codesData[i][codeColIdx]).trim() === cleanCode) {
        codeRow = i + 1; // 1-based index in Sheet
        break;
      }
    }

    if (codeRow === -1) {
      lock.releaseLock();
      return { success: false, valid: false, message: 'الكود غير موجود أو غير صحيح' };
    }

    var currentStatus = String(codesData[codeRow - 1][statusColIdx] || '').trim().toUpperCase();

    // Reject if already USED
    if (currentStatus === 'USED') {
      lock.releaseLock();
      return { success: false, valid: false, message: 'تم استخدام هذا الكود سابقاً' };
    }

    // Reject if still UNUSED (must be assigned via approved payment first)
    if (currentStatus === 'UNUSED') {
      lock.releaseLock();
      return { success: false, valid: false, message: 'الكود غير مفعّل بعد، يرجى انتظار تأكيد الدفع' };
    }

    // Must be ASSIGNED to convert to USED
    if (currentStatus === 'ASSIGNED') {
      var now = new Date();
      codesSheet.getRange(codeRow, statusColIdx + 1).setValue('USED');
      codesSheet.getRange(codeRow, usedAtColIdx + 1).setValue(now);

      lock.releaseLock();
      return {
        success: true,
        valid: true,
        downloadsAdded: 1,
        message: 'تم تفعيل الكود بنجاح واستخدامه'
      };
    }

    lock.releaseLock();
    return { success: false, valid: false, message: 'حالة الكود غير صالحة' };
  } catch (err) {
    lock.releaseLock();
    return { success: false, valid: false, message: err.toString() };
  }
}

/**
 * 4. approveEdit: Toggles Edit Approval in Manual sheet.
 */
function approveEdit(reference, approved) {
  if (!reference) {
    return { success: false, error: 'Reference is required' };
  }

  var ss = getSpreadsheet();
  var sheet = ss.getSheetByName('Manual');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var refIdx = headers.indexOf('Reference');
  var editIdx = headers.indexOf('Edit Approval');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][refIdx]).trim() === String(reference).trim()) {
      var approvalValue = (approved === true || approved === 'approved' || approved === 'true') ? 'approved' : 'rejected';
      sheet.getRange(i + 1, editIdx + 1).setValue(approvalValue);
      return { success: true, reference: reference, editApproval: approvalValue };
    }
  }

  return { success: false, error: 'Reference not found' };
}

/**
 * Simple trigger for Google Sheets edits.
 */
function onSheetEdit(e) {
  ensureHeaders();
}
