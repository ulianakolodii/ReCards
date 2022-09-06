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
import {
  getAllDoctors,
  deleteVisit,
  dbArrayToObject,
  getAllPatients,
  getAllVisits,
} from "../../utils";

const columns = [
  { title: "Пацієнт" },
  { title: "Лікар" },
  { title: "Дата та час" },
  { title: "Дата та час створення" },
  { title: "" },
];

const getFullName = (mapObj, id) => {
  return `${mapObj?.[id]?.lastName} ${mapObj?.[id]?.firstName} ${mapObj?.[id]?.fathersName}`;
};

const mapToTable =
  (deletingID, createDeletingHandler, createDeleteHandler) =>
  ([doctors, patients, visits]) =>
    visits?.map((visit) => [
      getFullName(patients, visit.patient),
      getFullName(doctors, visit.doctor),
      new Date(visit.dateTime).toLocaleString(),
      new Date(visit.timestamp).toLocaleString(),
      deletingID === visit.id ? (
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
          <Button variant="danger" onClick={createDeleteHandler(visit.id)}>
            Так
          </Button>
          <Button onClick={createDeletingHandler(undefined)}>Ні</Button>
        </Box>
      ) : (
        <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
          <Button as={NavLink} to={`/edit-visit/${visit.id}`}>
            Редагувати
          </Button>
          <Button variant="danger" onClick={createDeletingHandler(visit.id)}>
            Видалити
          </Button>
        </Box>
      ),
    ]);

export const Visits = () => {
  const [items, setItems] = useState([]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();

  const loadItems = useCallback(() => {
    const createDeletingHandler = (id) => () => {
      setDeletingID(id);
    };

    const createDeleteHandler = (id) => () => {
      deleteVisit(id).then(() => {
        loadItems();
      });
    };

    return Promise.all([
      getAllDoctors().then(dbArrayToObject),
      getAllPatients().then(dbArrayToObject),
      getAllVisits(),
    ])
      .then(mapToTable(deletingID, createDeletingHandler, createDeleteHandler))
      .then((result) => {
        setItems(result);
      });
  }, [setItems, deletingID]);

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const filteredItems = useMemo(
    () =>
      items.filter(
        ([patient, doctor]) =>
          patient.includes(filterValue) || doctor.includes(filterValue)
      ),
    [items, filterValue]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);
  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 3 }}>
            <Heading as="h2" sx={{ fontSize: 24 }}>
              Візити
            </Heading>
            <TextInput
              onInput={handleFilterInput}
              value={filterValue}
              leadingVisual={SearchIcon}
              placeholder="Пошук"
              sx={{ minWidth: 250 }}
            />
          </Box>
          <Button as={NavLink} to="/add-visit">
            Додати візит
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
              Візити відсутні!
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
