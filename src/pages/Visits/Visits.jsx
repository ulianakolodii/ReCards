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
  Label,
  CounterLabel,
} from "@primer/react";
import {
  SearchIcon,
  SortAscIcon,
  SortDescIcon,
  XIcon,
} from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { VisitRow, DropdownMultiSelect } from "../../components";
import {
  getAllDoctors,
  deleteVisit,
  dbArrayToObject,
  getAllPatients,
  getAllVisits,
  sortBy,
  getAllUniqueTags,
  hasQuery,
  toggleQuery,
  containsTags,
} from "../../utils";
import {
  filterByDateTime,
  filterByDepartments,
  filterByDoctors,
  filterByFilterValue,
  filterByPatients,
  filterByChild,
  getFullName,
} from "./utils";
import { useQuery } from "../../hooks";

export const Visits = () => {
  const query = useQuery();
  const [[doctors, patients, visits], setItems] = useState([{}, {}, []]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();
  const [orderBy, setOrderBy] = useState("dateTime");
  const [order, setOrder] = useState(false);
  const [tags, setTags] = useState();

  const [patientsSelected, setPatientSelected] = useState({});
  const [doctorsSelected, setDoctorsSelected] = useState({});
  const [departmentsSelected, setDepartmentsSelected] = useState({});

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

  const handleDepartmentChange = (event, el) => {
    setDepartmentsSelected((prev) => {
      if (prev[el.id]) {
        return Object.fromEntries(
          Object.entries(prev).filter(([id]) => id !== el.id)
        );
      }
      return { ...prev, [el.id]: el };
    });
  };

  const handleDoctorsChange = (event, el) => {
    setDoctorsSelected((prev) => {
      if (prev[el.id]) {
        return Object.fromEntries(
          Object.entries(prev).filter(([id, item]) => item.id !== el.id)
        );
      }
      return { ...prev, [el.id]: el };
    });
  };

  const handlePatientsChange = (event, el) => {
    setPatientSelected((prev) => {
      if (prev[el.id]) {
        return Object.fromEntries(
          Object.entries(prev).filter(([id, item]) => item.id !== el.id)
        );
      }
      return { ...prev, [el.id]: el };
    });
  };

  const filteredItems = useMemo(
    () =>
      visits
        .map((visit) => ({
          ...visit,
          lastName: patients[visit.patient]?.lastName,
          doctor: doctors[visit.doctor],
          patient: patients[visit.patient],
          patientId: visit.patient,
          deleting: visit.id === deletingID,
          onStartDelete: handleStartDelete,
          onCancelDelete: handleCancelDelete,
          onConfirmDelete: handleConfirmDelete,
        }))
        .filter((el) =>
          [
            filterByFilterValue(filterValue)(el),
            filterByDepartments(Object.values(departmentsSelected))(el),
            filterByDoctors(Object.values(doctorsSelected))(el),
            filterByPatients(Object.values(patientsSelected))(el),
            filterByDateTime(fromDateTime, toDateTime)(el),
            filterByChild(query.getAll("child"))(el),
            containsTags(query.getAll("tag"))(el?.patient || {}),
          ].every((el) => !!el === true)
        )
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
      query,
    ]
  );

  const childrenStatistics = useMemo(
    () =>
      filteredItems.reduce((sum, { isChild }) => (isChild ? sum + 1 : sum), 0),
    [filteredItems]
  );

  const departmentStatisticsList = useMemo(
    () =>
      filteredItems.reduce(
        (list, { doctor }) => ({
          ...list,
          [doctor.department]: (list[doctor.department] || 0) + 1,
        }),
        {}
      ),
    [filteredItems]
  );

  const doctrosStatisticsList = useMemo(
    () =>
      filteredItems.reduce(
        (list, { doctor }) => ({
          ...list,
          [getFullName(doctor)]: (list[getFullName(doctor)] || 0) + 1,
        }),
        {}
      ),
    [filteredItems]
  );

  const tagsStatisticsList = useMemo(
    () =>
      filteredItems.reduce((list, { patient }) => {
        if (patient.tags?.length > 0) {
          patient.tags.forEach((tag) => {
            list[tag.id] = (list[tag.id] || 0) + 1;
          });
        }
        return list;
      }, {}),
    [filteredItems]
  );

  const patientsStatisticsList = useMemo(
    () =>
      filteredItems.reduce(
        (list, { patient }) => ({
          ...list,
          [patient.id]: (list[patient.id] || 0) + 1,
        }),
        {}
      ),
    [filteredItems]
  );

  const patientItems = useMemo(
    () =>
      Object.keys(patients).map((key) => ({
        ...patients[key],
        text: getFullName(patients[key]),
        selected: !!patientsSelected[key],
        leadingVisual: () => (
          <CounterLabel>
            {patientsStatisticsList[patients[key].id]}
          </CounterLabel>
        ),
      })),
    [patients, patientsStatisticsList, patientsSelected]
  );

  const doctorsItems = useMemo(
    () =>
      Object.keys(doctors).map((key) => ({
        ...doctors[key],
        text: getFullName(doctors[key]),
        selected: !!doctorsSelected[key],
        leadingVisual: () => (
          <CounterLabel>
            {doctrosStatisticsList[getFullName(doctors[key])]}
          </CounterLabel>
        ),
      })),
    [doctors, doctrosStatisticsList, doctorsSelected]
  );

  const departmentItems = useMemo(
    () =>
      Object.values(
        Object.entries(doctors).reduce((acc, [, el]) => {
          return {
            ...acc,
            [el.department]: {
              id: el.department,
              text: el.department,
              selected: !!departmentsSelected[el.department],
              leadingVisual: () => (
                <CounterLabel>
                  {departmentStatisticsList[el.department]}
                </CounterLabel>
              ),
            },
          };
        }, {})
      ),
    [doctors, departmentStatisticsList, departmentsSelected]
  );

  const handleClearClick = useCallback(() => {
    setFilterValue("");
    setDepartmentsSelected({});
    setPatientSelected({});
    setDoctorsSelected({});
    setFromDateTime("");
    setToDateTime("");
    window.location.search = "";
  }, [
    setFilterValue,
    setDepartmentsSelected,
    setPatientSelected,
    setDoctorsSelected,
  ]);

  const isClearable = useMemo(
    () =>
      !!filterValue ||
      !!fromDateTime ||
      !!toDateTime ||
      query.getAll("child").length > 0 ||
      query.getAll("tag").length > 0 ||
      Object.values(departmentsSelected).length > 0 ||
      Object.values(doctorsSelected).length > 0 ||
      Object.values(patientsSelected).length > 0,
    [
      filterValue,
      fromDateTime,
      toDateTime,
      query,
      departmentsSelected,
      doctorsSelected,
      patientsSelected,
    ]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    getAllUniqueTags().then(setTags);
  }, [setTags]);

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
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <FormControl>
            <FormControl.Label>
              Записів: {filteredItems.length}
            </FormControl.Label>
            <TextInput
              onInput={handleFilterInput}
              value={filterValue}
              leadingVisual={SearchIcon}
              placeholder="Пошук"
              sx={{ minWidth: 250 }}
            />
          </FormControl>
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

        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <Button as={NavLink} to="/add-visit">
            Додати візит
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        {isClearable && (
          <Button
            variant="invisible"
            sx={{ "& span": { display: "flex", gap: 2, alignItems: "center" } }}
            onClick={handleClearClick}
          >
            <XIcon />
            <Text>
              Очистити поточний пошуковий запит, фільтри та сортування
            </Text>
          </Button>
        )}
      </Box>
      <PageLayout.Content>
        <Box
          sx={{
            background: (theme) => theme.colors.btn.focusBg,
            borderTopRightRadius: 6,
            borderTopLeftRadius: 6,
            borderStyle: "solid",
            borderColor: "btn.border",
            borderWidth: 1,
            padding: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", gap: 2 }}>
            <Text sx={{ fontSize: 14 }}>Мітки:</Text>
            {!!childrenStatistics && (
              <Label
                variant="accent"
                sx={{
                  cursor: "pointer",
                  textDecoration: "none",
                  display: "flex",
                  gap: 1,
                  background: (theme) =>
                    !hasQuery("1", "child") ? "#fff" : theme.colors.accent.fg,
                  color: (theme) =>
                    hasQuery("1", "child") ? "#fff" : theme.colors.accent.fg,
                }}
                as={NavLink}
                to={`/?${toggleQuery("1", "child")}`}
              >
                неповнолітній
                <CounterLabel
                  sx={{
                    background: (theme) => theme.colors.accent.muted,
                    color: (theme) =>
                      hasQuery("1", "child") ? "#fff" : theme.colors.accent.fg,
                  }}
                >
                  {childrenStatistics}
                </CounterLabel>
              </Label>
            )}
            {tags &&
              tags.map((tag) =>
                !tagsStatisticsList[tag.id] ? null : (
                  <Label
                    as={NavLink}
                    key={tag.id}
                    to={`/?${toggleQuery(tag.id)}`}
                    sx={{
                      cursor: "pointer",
                      textDecoration: "none",
                      display: "flex",
                      gap: 1,
                      background: (theme) =>
                        !hasQuery(tag.id)
                          ? "#fff"
                          : theme.colors.border.default,
                      color: () => (hasQuery(tag.id) ? "#fff" : "inherit"),
                    }}
                  >
                    {tag.text}
                    <CounterLabel>{tagsStatisticsList[tag.id]}</CounterLabel>
                  </Label>
                )
              )}
          </Box>
          <Box sx={{ display: "flex", gap: 2 }}>
            <DropdownMultiSelect
              title="Кафедра"
              items={departmentItems}
              onChange={handleDepartmentChange}
            />
            <DropdownMultiSelect
              title="Лікар"
              items={doctorsItems}
              onChange={handleDoctorsChange}
            />
            <DropdownMultiSelect
              title="Пацієнт"
              items={patientItems}
              onChange={handlePatientsChange}
            />
            <ActionMenu>
              <ActionMenu.Button variant="invisible">
                Сортувати
              </ActionMenu.Button>

              <ActionMenu.Overlay width="medium">
                <ActionList selectionVariant="single">
                  <ActionList.Item
                    onSelect={createHandleSort("dateTime", true)}
                    selected={order === true && orderBy === "dateTime"}
                  >
                    <ActionList.LeadingVisual>
                      <SortAscIcon />
                    </ActionList.LeadingVisual>
                    За датою візиту (зростання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("dateTime", false)}
                    selected={order === false && orderBy === "dateTime"}
                  >
                    <ActionList.LeadingVisual>
                      <SortDescIcon />
                    </ActionList.LeadingVisual>
                    За датою візиту (спадання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("timestamp", true)}
                    selected={order === true && orderBy === "timestamp"}
                  >
                    <ActionList.LeadingVisual>
                      <SortAscIcon />
                    </ActionList.LeadingVisual>
                    За датою додавання (зростання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("timestamp", false)}
                    selected={order === false && orderBy === "timestamp"}
                  >
                    <ActionList.LeadingVisual>
                      <SortDescIcon />
                    </ActionList.LeadingVisual>
                    За датою додавання (спадання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("patientId", true)}
                    selected={order === true && orderBy === "patientId"}
                  >
                    <ActionList.LeadingVisual>
                      <SortAscIcon />
                    </ActionList.LeadingVisual>
                    За номером (зростання)
                  </ActionList.Item>
                  <ActionList.Item
                    onSelect={createHandleSort("patientId", false)}
                    selected={order === false && orderBy === "patientId"}
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
