import { includesBy } from "../../utils";

export const getFullName = (el) =>
  `${el?.lastName} ${el?.firstName} ${el?.fathersName}`;

export const filterByFilterValue =
  (filterValue) =>
  ({ doctor, patient, id }) =>
    includesBy(filterValue, { id }, ["id"]) ||
    includesBy(filterValue, doctor, [
      "lastName",
      "firstName",
      "fathersName",
      "phoneNumber",
      "department",
    ]) ||
    includesBy(filterValue, patient, [
      "lastName",
      "firstName",
      "fathersName",
      "birthDate",
      "phoneNumber",
      "id",
    ]);

export const filterByDepartments =
  (departmentsSelected) =>
  ({ doctor }) =>
    departmentsSelected.length === 0 ||
    departmentsSelected.find((el) => el.text === doctor.department);

export const filterByDoctors =
  (doctorsSelected) =>
  ({ doctor }) =>
    doctorsSelected.length === 0 ||
    doctorsSelected.find((el) => el.text === getFullName(doctor));

export const filterByPatients =
  (patientsSelected) =>
  ({ patient }) =>
    patientsSelected.length === 0 ||
    patientsSelected.find((el) => el.text === getFullName(patient));

export const filterByDateTime =
  (fromDateTime, toDateTime) =>
  ({ dateTime }) => {
    if (isNaN(Date.parse(fromDateTime)) || isNaN(Date.parse(toDateTime))) {
      return true;
    }
    return (
      dateTime >= Date.parse(fromDateTime) && dateTime <= Date.parse(toDateTime)
    );
  };
