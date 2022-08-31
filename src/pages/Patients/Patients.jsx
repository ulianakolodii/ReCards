import React, { useEffect, useState, useCallback } from "react";
import { PageLayout, Pagehead, Heading, Box, Button } from "@primer/react";
import { NavLink } from "react-router-dom";
import { Table } from "../../components";
import { getAllPatients, deletePatient } from "../../utils/db";

const columns = [
  { title: "Прізвище" },
  { title: "Ім'я" },
  { title: "По-батькові" },
  { title: "Дата народження" },
  { title: "Номер телефону" },
  { title: "Номер карти" },
  { title: "Мітки" },
  { title: "Додаткова інформація" },
  { title: "" },
];

const mapToTable =
  (deletingID, createDeletingHandler, createDeleteHandler) => (patients) =>
    patients?.map((patient) => [
      patient.lastName,
      patient.firstName,
      patient.fathersName,
      patient.birthDate,
      patient.phoneNumber,
      patient.cardNumber,
      JSON.stringify(patient.tags),
      patient.additionalInfo,
      deletingID === patient.id ? (
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
          <Button variant="danger" onClick={createDeleteHandler(patient.id)}>
            Так
          </Button>
          <Button onClick={createDeletingHandler(undefined)}>Ні</Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button as={NavLink} to={`/edit-patient/${patient.id}`}>
            Редагувати
          </Button>
          <Button variant="danger" onClick={createDeletingHandler(patient.id)}>
            Видалити
          </Button>
        </Box>
      ),
    ]);

export const Patients = () => {
  const [doctors, setDoctors] = useState([]);
  const [deletingID, setDeletingID] = useState();

  const loadDoctors = useCallback(() => {
    const createDeletingHandler = (id) => () => {
      setDeletingID(id);
    };

    const createDeleteHandler = (id) => () => {
      deletePatient(id).then(() => {
        loadDoctors();
      });
    };
    return getAllPatients()
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
          <Heading as="h2" sx={{ fontSize: 24 }}>
            Пацієнти
          </Heading>
          <Button as={NavLink} to="/add-patient">
            Додати пацієнта
          </Button>
        </Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        {doctors.length === 0 && (
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
              Пацієнти відсутні!
            </Heading>
          </Box>
        )}
        {doctors.length !== 0 && <Table columns={columns} data={doctors} />}
      </PageLayout.Content>
    </PageLayout>
  );
};
