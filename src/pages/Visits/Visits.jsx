import React, {
  useEffect,
  useState,
  useCallback,
  useTransition,
  useMemo,
} from "react";
import {
  PageLayout,
  Box,
  Button,
  TextInput,
  Text,
  ActionList,
  ActionMenu,
  FormControl,
  SelectPanel,
} from "@primer/react";
import {
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  TriangleDownIcon,
} from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { VisitRow } from "../../components";
import {
  getAllDoctors,
  deleteVisit,
  dbArrayToObject,
  getAllPatients,
  getAllVisits,
  includesBy,
  sortBy,
} from "../../utils";

const getFullName = (el) =>
  `${el?.lastName} ${el?.firstName} ${el?.fathersName}`;

export const Visits = () => {
  const [[doctors, patients, visits], setItems] = useState([{}, {}, []]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState(false);

  const [patientsSelected, setPatientSelected] = useState([]);
  const [openPatientsFilter, setOpenPatientsFilter] = useState(false);
  const [patientsFilterText, setPatientsFilterText] = useState("");

  const [doctorsSelected, setDoctorsSelected] = useState([]);
  const [openDoctorsFilter, setOpenDoctorsFilter] = useState(false);
  const [doctorsFilterText, setDoctorsFilterText] = useState("");

  const [departmentsSelected, setDepartmentsSelected] = useState([]);
  const [openDepartmentsFilter, setOpenDepartmentsFilter] = useState(false);
  const [departmentsFilterText, setDepartmentsFilterText] = useState("");

  const [fromDateTime, setFromDateTime] = useState("");
  const [toDateTime, setToDateTime] = useState("");

  const createHandleSort = (orderByColumn, orderType) => () => {
    setOrderBy(orderByColumn);
    setOrder(orderType);
  };

  const loadItems = useCallback(() => {
    return Promise.all([
      getAllDoctors().then(dbArrayToObject),
      getAllPatients().then(dbArrayToObject),
      getAllVisits(),
    ]).then((result) => {
      setItems(result);
    });
  }, [setItems]);

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const handleStartDelete = useCallback(
    (id) => {
      setDeletingID(id);
    },
    [setDeletingID]
  );

  const handleConfirmDelete = useCallback(
    (id) => {
      deleteVisit(id).then(() => {
        loadItems();
      });
    },
    [loadItems]
  );

  const handleCancelDelete = useCallback(() => {
    setDeletingID(undefined);
  }, [setDeletingID]);

  const handleInputFromDateTime = useCallback(
    (event) => {
      setFromDateTime(event.target.value);
    },
    [setFromDateTime]
  );

  const handleInputToDateTime = useCallback(
    (event) => {
      setToDateTime(event.target.value);
    },
    [setToDateTime]
  );

  const filteredItems = useMemo(
    () =>
      visits
        .map((visit) => ({
          ...visit,
          lastName: patients[visit.patient]?.lastName,
          doctor: doctors[visit.doctor],
          patient: patients[visit.patient],
          deleting: visit.id === deletingID,
          onStartDelete: handleStartDelete,
          onCancelDelete: handleCancelDelete,
          onConfirmDelete: handleConfirmDelete,
        }))
        .filter(
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
            ])
        )
        .filter(
          ({ doctor }) =>
            departmentsSelected.length === 0 ||
            departmentsSelected.find((el) => el.text === doctor.department)
        )
        .filter(
          ({ doctor }) =>
            doctorsSelected.length === 0 ||
            doctorsSelected.find((el) => el.text === getFullName(doctor))
        )
        .filter(
          ({ patient }) =>
            patientsSelected.length === 0 ||
            patientsSelected.find((el) => el.text === getFullName(patient))
        )
        .filter(({ dateTime }) => {
          if (
            isNaN(Date.parse(fromDateTime)) ||
            isNaN(Date.parse(toDateTime))
          ) {
            return true;
          }
          return (
            dateTime >= Date.parse(fromDateTime) &&
            dateTime <= Date.parse(toDateTime)
          );
        })
        .sort(sortBy(order, orderBy)),
    [
      deletingID,
      visits,
      doctors,
      patients,
      filterValue,
      handleStartDelete,
      handleCancelDelete,
      handleConfirmDelete,
      order,
      orderBy,
      departmentsSelected,
      doctorsSelected,
      patientsSelected,
      fromDateTime,
      toDateTime,
    ]
  );

  const patientItems = useMemo(
    () =>
      Object.keys(patients)
        .map((key) => ({
          ...patients[key],
          text: getFullName(patients[key]),
        }))
        .filter((patient) => patient.text.includes(patientsFilterText)),
    [patients, patientsFilterText]
  );

  const doctorsItems = useMemo(
    () =>
      Object.keys(doctors)
        .map((key) => ({
          ...doctors[key],
          text: getFullName(doctors[key]),
        }))
        .filter((el) => el.text.includes(doctorsFilterText)),
    [doctors, doctorsFilterText]
  );

  const departmentItems = useMemo(
    () =>
      Object.values(
        Object.entries(doctors).reduce((acc, [id, el]) => {
          if (!el.department.includes(departmentsFilterText)) {
            return acc;
          }
          return {
            ...acc,
            [el.department]: { id: el.department, text: el.department },
          };
        }, {})
      ),
    [doctors, departmentsFilterText]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);
  return (
    <PageLayout>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 3,
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <TextInput
              onInput={handleFilterInput}
              value={filterValue}
              leadingVisual={SearchIcon}
              placeholder="Пошук"
              sx={{ minWidth: 250 }}
            />
          </Box>
        </Box>
        <Button as={NavLink} to="/add-visit">
          Додати візит
        </Button>
      </Box>
      <PageLayout.Content>
        <Box
          sx={{
            background: (theme) => theme.colors.btn.focusBg,
            borderTopRightRadius: 6,
            borderTopLeftRadius: 6,
            borderStyle: "solid",
            borderColor: "btn.border",
            padding: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <FormControl>
              <FormControl.Label>Від</FormControl.Label>
              <TextInput
                type="datetime-local"
                value={fromDateTime}
                onInput={handleInputFromDateTime}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label>До</FormControl.Label>
              <TextInput
                type="datetime-local"
                value={toDateTime}
                onInput={handleInputToDateTime}
              />
            </FormControl>
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <SelectPanel
              renderAnchor={({ ...anchorProps }) => (
                <Button
                  variant="invisible"
                  trailingIcon={TriangleDownIcon}
                  {...anchorProps}
                >
                  Кафедра
                </Button>
              )}
              title="Сортувати за кафедрою"
              open={openDepartmentsFilter}
              onOpenChange={setOpenDepartmentsFilter}
              items={departmentItems}
              selected={departmentsSelected}
              onSelectedChange={setDepartmentsSelected}
              onFilterChange={setDepartmentsFilterText}
              showItemDividers={true}
              overlayProps={{ width: "medium", height: "medium" }}
            />
            <SelectPanel
              renderAnchor={({ ...anchorProps }) => (
                <Button
                  variant="invisible"
                  trailingIcon={TriangleDownIcon}
                  {...anchorProps}
                >
                  Лікар
                </Button>
              )}
              title="Сортувати за лікарем"
              open={openDoctorsFilter}
              onOpenChange={setOpenDoctorsFilter}
              items={doctorsItems}
              selected={doctorsSelected}
              onSelectedChange={setDoctorsSelected}
              onFilterChange={setDoctorsFilterText}
              showItemDividers={true}
              overlayProps={{ width: "medium", height: "medium" }}
            />
            <SelectPanel
              variant="inset"
              renderAnchor={({ ...anchorProps }) => (
                <Button
                  variant="invisible"
                  trailingIcon={TriangleDownIcon}
                  {...anchorProps}
                >
                  Пацієнт
                </Button>
              )}
              title="Сортувати за пацієнтом"
              open={openPatientsFilter}
              onOpenChange={setOpenPatientsFilter}
              items={patientItems}
              selected={patientsSelected}
              onSelectedChange={setPatientSelected}
              onFilterChange={setPatientsFilterText}
              showItemDividers={true}
              overlayProps={{ width: "medium", height: "medium" }}
            />
            <ActionMenu>
              <ActionMenu.Button variant="invisible">
                Сортувати
              </ActionMenu.Button>

              <ActionMenu.Overlay width="medium">
                <ActionList selectionVariant="single">
                  <ActionList.Item
                    onSelect={createHandleSort("id", true)}
                    selected={order === true && orderBy === "id"}
                  >
                    <ActionList.LeadingVisual>
                      <SortAscIcon />
                    </ActionList.LeadingVisual>
                    За номером (зростання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("id", false)}
                    selected={order === false && orderBy === "id"}
                  >
                    <ActionList.LeadingVisual>
                      <SortDescIcon />
                    </ActionList.LeadingVisual>
                    За номером (спадання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("lastName", false)}
                    selected={order === false && orderBy === "lastName"}
                  >
                    <ActionList.LeadingVisual>
                      <SortAscIcon />
                    </ActionList.LeadingVisual>
                    За прізвищем (А-Я)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("lastName", true)}
                    selected={order === true && orderBy === "lastName"}
                  >
                    <ActionList.LeadingVisual>
                      <SortDescIcon />
                    </ActionList.LeadingVisual>
                    За прізвищем (Я-А)
                  </ActionList.Item>
                </ActionList>
              </ActionMenu.Overlay>
            </ActionMenu>
          </Box>
        </Box>
        {filteredItems.map((doctor) => (
          <VisitRow key={doctor.id} {...doctor} />
        ))}
        {filteredItems.length === 0 && (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 8,
              gap: 2,
              borderWidth: 1,
              borderTopWidth: 0,
              borderStyle: "solid",
              borderColor: "btn.border",
              boxSizing: "border-box",
            }}
          >
            <Box as="img" src="empty.svg" alt="Empty" />
            <Text sx={{ fontSize: 36 }}>Нічого не знайдено!</Text>
            <Text>Спробуйте додати візит.</Text>
            <Button
              sx={{ marginTop: 2 }}
              variant="primary"
              as={NavLink}
              to="/add-visit"
            >
              Додати візит
            </Button>
          </Box>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
};
