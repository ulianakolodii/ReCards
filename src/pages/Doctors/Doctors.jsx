import React, { useEffect, useState, useCallback } from "react";
import { PageLayout, Pagehead, Heading, Box, Button } from "@primer/react";
import { NavLink } from "react-router-dom";
import { Table } from "../../components";
import { getAllDoctors, deleteDoctor } from "../../utils/db";
import { ReactComponent as Empty } from "../../assets/icons/empty.svg";

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
    // loadDoctors();
  }, [loadDoctors]);
  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead sx={{ display: "flex", justifyContent: "space-between" }}>
          <Heading as="h2" sx={{ fontSize: 24 }}>
            Лікарі
          </Heading>
          <Button as={NavLink} to="/add-doctor">
            Додати лікаря
          </Button>
        </Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        <Empty />
        <Table columns={columns} data={doctors}></Table>
      </PageLayout.Content>
    </PageLayout>
  );
};
