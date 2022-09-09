import React, {
  useEffect,
  useState,
  useCallback,
  useTransition,
  useMemo,
} from "react";
import {
  PageLayout,
  Pagehead,
  Heading,
  Box,
  Button,
  TextInput,
} from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { Table } from "../../components";
import { getAllDoctors, deleteDoctor } from "../../utils/db";

const columns = [
  { title: "Прізвище" },
  { title: "Ім'я" },
  { title: "По-батькові" },
  { title: "Номер телефону" },
  { title: "" },
];

const mapToTable =
  (deletingID, createDeletingHandler, createDeleteHandler) => (doctors) =>
    doctors?.map((doctor) => [
      doctor.lastName,
      doctor.firstName,
      doctor.fathersName,
      doctor.phoneNumber,
      deletingID === doctor.id ? (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Box
            as="span"
            sx={{
              color: "danger.fg",
            }}
          >
            Ви впевнені?
          </Box>
          <Button variant="danger" onClick={createDeleteHandler(doctor.id)}>
            Так
          </Button>
          <Button onClick={createDeletingHandler(undefined)}>Ні</Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button as={NavLink} to={`/edit-doctor/${doctor.id}`}>
            Редагувати
          </Button>
          <Button variant="danger" onClick={createDeletingHandler(doctor.id)}>
            Видалити
          </Button>
        </Box>
      ),
    ]);

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const filteredItems = useMemo(
    () =>
      doctors.filter(
        ([lastName, firstName, fathersName, phoneNumber]) =>
          lastName.includes(filterValue) ||
          firstName.includes(filterValue) ||
          fathersName.includes(filterValue) ||
          phoneNumber.includes(filterValue)
      ),
    [doctors, filterValue]
  );

  const loadDoctors = useCallback(() => {
    const createDeletingHandler = (id) => () => {
      setDeletingID(id);
    };

    const createDeleteHandler = (id) => () => {
      deleteDoctor(id).then(() => {
        loadDoctors();
      });
    };
    return getAllDoctors()
      .then(mapToTable(deletingID, createDeletingHandler, createDeleteHandler))
      .then((result) => {
        setDoctors(result);
      });
  }, [setDoctors, deletingID]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);
  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Heading as="h2" sx={{ fontSize: 24 }}>
              Лікарі
            </Heading>
            <TextInput
              onInput={handleFilterInput}
              value={filterValue}
              leadingVisual={SearchIcon}
              placeholder="Пошук"
              sx={{ minWidth: 250 }}
            />
          </Box>
          <Button as={NavLink} to="/add-doctor">
            Додати лікаря
          </Button>
        </Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        {filteredItems.length === 0 && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <Box as="img" src="empty.png" alt="Empty" />
            <Heading as="h6" sx={{ fontSize: 24 }}>
              Лікарі відсутні!
            </Heading>
          </Box>
        )}
        {filteredItems.length !== 0 && (
          <Table columns={columns} data={filteredItems}></Table>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
};
