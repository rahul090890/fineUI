function validateApplyLeave(comments, leaveSelected, startDate, endDate,
		remainLeaves) {

	var checkValidate = false;

	try {
		var leaveType = leaveSelected.leaveType;
		checkValidate = true;
	} catch (e) {
		checkValidateMsg('#categoryGroup', 'Please enter Leave Type');
		checkValidate = false;
	}
	try {
		var startDateTry = startDate.getFullYear();
		checkValidate = true;
	} catch (e) {
		checkValidateMsg('#applyLeaveStartDate', 'Please select Start Date');
		checkValidate = false;
	}
	try {
		var endDateTry = endDate.getFullYear();
		checkValidate = true;
	} catch (e) {
		checkValidateMsg('#applyLeaveEndDate', 'Please select End Date');
		checkValidate = false;
	}

	if (comments == null || comments == '' || comments == undefined) {
		checkValidateMsg('#applyLeaveComments',
				'Please enter Comments before Submitting.');
		checkValidate = false;
	} else if (remainLeaves == null || remainLeaves == ''
			|| remainLeaves == undefined) {
		checkValidateMsg('#applyLeaveRemaining',
				'Please select proper Leave End Date.');
		checkValidate = false;
	} else {
		checkValidate = true;
	}

	if (checkValidate) {
		return true;
	} else {
		return false;
	}
}
function checkValidateMsg(id, msg) {
	$(id).closest('.form-group').addClass('has-error');
	html = '<div class="alert alert-danger alert-dismissible" role="alert">';
	html = html
			+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	html = html + msg;
	html = html + '</div>';
	$(id).closest('.form-group').append(html);
	setTimeout(function() {
		$(id).closest('.form-group').find('.alert').remove();
	}, 5000);
}
function checkValidateMsgInputGroup(id, msg) {
	$(id).closest('.fg-line').addClass('has-error');
	html = '<div class="alert alert-danger alert-dismissible" role="alert">';
	html = html
			+ '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
	html = html + msg;
	html = html + '</div>';
	$(id).closest('.fg-line').append(html);
	setTimeout(function() {
		$(id).closest('.fg-line').find('.alert').remove();
	}, 5000);
}
function validateInstant(ele) {
	debugger;
	var targetVal = $(ele).val().trim();
	if (targetVal == null || targetVal == undefined || targetVal == '') {
		$(ele).closest('.form-group').addClass('has-error');
	} else {
		$(ele).closest('.form-group').removeClass('has-error');
	}

}
function validateInstantInputgroup(ele) {
	debugger;
	var targetVal = $(ele).val().trim();
	if (targetVal == null || targetVal == undefined || targetVal == '') {
		$(ele).closest('.fg-line').addClass('has-error');
	} else {
		$(ele).closest('.fg-line').removeClass('has-error');
	}

}
function validatecreateEmployee(firstName, lastName, emailId, loginId,
		loginPassword, managerId, address, role, designation, employeeType,
		userDepartmentId, employeeStatus, employeeCode, joindate) {
	debugger;
	var checkValidate = true;

	if (employeeType == null || employeeType == '' || employeeType == undefined) {
		checkValidateMsgInputGroup('#employeeType',
				'Please enter employee type');
		checkValidate = false;
	}
	if (emailId == null || emailId == '' || emailId == undefined) {
		checkValidateMsgInputGroup('#emailId', 'Please enter email.');
		checkValidate = false;
	}
	if (role == null || role == '' || role == undefined) {
		checkValidateMsgInputGroup('#role', 'Please select employee role.');
		checkValidate = false;
	}

	try {
		debugger;
		var joindate = joindate.getFullYear();
		checkValidate = true;
	} catch (e) {
		checkValidateMsgInputGroup('#joindate', 'Please select joining date');
		checkValidate = false;
	}

	if (employeeCode == null || employeeCode == '' || employeeCode == undefined) {
		checkValidateMsgInputGroup('#employeeCode',
				'Please enter employee code.');
		checkValidate = false;
	}
	if (firstName == null || firstName == '' || firstName == undefined) {
		checkValidateMsgInputGroup('#firstName', 'Please enter first name');
		checkValidate = false;
	}

	if (loginId == null || loginId == '' || loginId == undefined) {
		checkValidateMsgInputGroup('#loginId', 'Please enter login Id.');
		checkValidate = false;
	}
	if (managerId == null || managerId == '' || managerId == undefined) {
		checkValidateMsgInputGroup('#managerId', 'Please select manager Id .');
		checkValidate = false;
	}
	if (employeeStatus == null || employeeStatus == ''
			|| employeeStatus == undefined) {
		checkValidateMsgInputGroup('#employeeStatus', 'Please select status.');
		checkValidate = false;
	}
	if (designation == null || designation == '' || designation == undefined) {
		checkValidateMsgInputGroup('#designation', 'Please select designation.');
		checkValidate = false;
	}
	if (lastName == null || lastName == '' || lastName == undefined) {
		checkValidateMsgInputGroup('#lastName', 'Please enter last Name.');
		checkValidate = false;
	}
	if (loginPassword == null || loginPassword == ''
			|| loginPassword == undefined) {
		checkValidateMsgInputGroup('#loginPassword',
				'Please enter login password.');
		checkValidate = false;
	}
	if (address == null || address == '' || address == undefined) {
		checkValidateMsgInputGroup('#address', 'Please enter address.');
		checkValidate = false;
	}
	if (userDepartmentId == null || userDepartmentId == ''
			|| userDepartmentId == undefined) {
		checkValidateMsgInputGroup('#userDepartmentId',
				'Please select departent.');
		checkValidate = false;
	}

	if (checkValidate) {
		return true;
	} else {
		return false;
	}
}
function validateCustomer(customerName, customerAddress, customerZip, country,customerCode) {

	var checkValidate = true;
	if (customerName == null || customerName == '' || customerName == undefined) {
		checkValidateMsg('#customerName', 'Please enter customerName.');
		checkValidate = false;
	}
	if (customerAddress == null || customerAddress == ''
			|| customerAddress == undefined) {
		checkValidateMsg('#customerAddress', 'Please enter customer address.');
		checkValidate = false;
	}
	if (customerZip == null || customerZip == '' || customerZip == undefined) {
		checkValidateMsg('#customerZip', 'Please enter customer zip.');
		checkValidate = false;
	}
	if (country == null || country == '' || country == undefined) {
		checkValidateMsg('#country', 'Please select country.');
		checkValidate = false;
	}
	if (customerCode == null || customerCode == '' || customerCode == undefined) {
		checkValidateMsg('#customerCode', 'Please enter Customer Code.');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}

}
function validateDepartment(parentDepartment, departmentName, managerId,departmentCode) {
	debugger;
	var checkValidate = true;
	if (parentDepartment == null || parentDepartment == ''
			|| parentDepartment == undefined) {
		checkValidateMsg('#parentDepartment',
				'Please select parent department.');
		checkValidate = false;
	}
	if (departmentName == null || departmentName == ''
			|| departmentName == undefined) {
		checkValidateMsg('#departmentName', 'Please enter department .');
		checkValidate = false;
	}
	if (managerId == null || managerId == '' || managerId == undefined) {
		checkValidateMsg('#managerId', 'Please select manager.');
		checkValidate = false;
	}
	if (departmentCode == null || departmentCode == '' || departmentCode == undefined) {
		checkValidateMsg('#departmentCode', 'Please enter department code.');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}

}
function validateRole(roleName, parentroleId) {
	var checkValidate = true;
	if (roleName == null || roleName == '' || roleName == undefined) {
		checkValidateMsg('#roleName', 'Please enter role name.');
		checkValidate = false;
	}
	if (parentroleId == null || parentroleId == '' || parentroleId == undefined) {
		checkValidateMsg('#parentroleId', 'Please select parent role .');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}

}
function validateTask(taskName, department, customer) {
	var checkValidate = true;
	if (taskName == null || taskName == '' || taskName == undefined) {
		checkValidateMsg('#taskName', 'Please enter task name.');
		checkValidate = false;
	}
	if (department == null || department == '' || department == undefined) {
		checkValidateMsg('#department', 'Please select department .');
		checkValidate = false;
	}
	if (customer == null || customer == '' || customer == undefined) {
		checkValidateMsg('#customer', 'Please select customer .');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}
}
function validateLeaveCredit(leaveType, year,
				noofLeaves){
	var checkValidate=true;
	if (leaveType == null || leaveType == '' || leaveType == undefined) {
		checkValidateMsg('#leaveType', 'Please select leaveType .');
		checkValidate = false;
	}
	if (year == null || year == '' || year == undefined) {
		checkValidateMsg('#year', 'Please select year .');
		checkValidate = false;
	}
	if (noofLeaves == null || noofLeaves == '' || noofLeaves == undefined) {
		checkValidateMsg('#noofLeaves', 'Please enter no of days .');
		checkValidate = false;
	}
	if (noofLeaves<1) {
		checkValidateMsg('#noofLeaves', 'leave cannot be less the 1 .');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}
}
function validateProject(
		projectname,customerprogramid,
		customerproject,projectstatus,
		customerid,departmentid,
		country,projectCode){
	var checkValidate = true;
	
	if (projectname == null || projectname == '' || projectname == undefined) {
		checkValidateMsg('#projectname', 'Please enter project name.');
		checkValidate = false;
	}
	if (customerprogramid == null || customerprogramid == '' || customerprogramid == undefined) {
		checkValidateMsg('#customerprogramid', 'Please select customer program code  .');
		checkValidate = false;
	}
	if (customerproject == null || customerproject == '' || customerproject == undefined) {
		checkValidateMsg('#customerproject', 'Please select project .');
		checkValidate = false;
	}
	if (projectstatus == null || projectstatus == '' || projectstatus == undefined) {
		checkValidateMsg('#projectstatus', 'Please select project status .');
		checkValidate = false;
	}
	if (customerid == null || customerid == '' || customerid == undefined) {
		checkValidateMsg('#customerid', 'Please select customer .');
		checkValidate = false;
	}
	if (departmentid == null || departmentid == '' || departmentid == undefined) {
		checkValidateMsg('#departmentid', 'Please select department .');
		checkValidate = false;
	}
	if (country == null || country == '' || country == undefined) {
		checkValidateMsg('#country', 'Please select country .');
		checkValidate = false;
	}
	if (projectCode == null || projectCode == '' || projectCode == undefined) {
		checkValidateMsg('#projectCode', 'Please enter Customer Project Code .');
		checkValidate = false;
	}
	if (checkValidate) {
		return true;
	} else {
		return false;
	}
	
}
function validateCPC(customerProgCodeType,customerprogName, customerId/*,length*/){
var checkValidate = true;
	debugger;
	
	if (customerProgCodeType == null || customerProgCodeType == '' || customerProgCodeType == undefined) {
		checkValidateMsg('#customerProgCodeType', 'Please select customer program type  .');
		checkValidate = false;
	}
	if (customerprogName == null || customerprogName == '' || customerprogName == undefined) {
		checkValidateMsg('#customerprogName', 'Please enter  customer program name .');
		checkValidate = false;
	}
	if (customerId == null || customerId == '' || customerId == undefined) {
		checkValidateMsg('#customerId', 'Please select project .');
		checkValidate = false;
	}
	/*if (length == null || length == '' || length == undefined ||length<1) {
		checkValidateMsg('#lenght', 'Please select atleast 1  .');
		checkValidate = false;
	}*/
	if (checkValidate) {
		return true;
	} else {
		return false;
	}
}
function validateEmail(emailId) {
	emailFormat = '/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i';
}
