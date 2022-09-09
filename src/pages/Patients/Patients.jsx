import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import {
  PageLayout,
  Pagehead,
  Heading,
  Box,
  Button,
  Token,
  TextInput,
  Text,
} from "@primer/react";
import { SearchIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { Table } from "../../components";
import {
  getAllPatients,
  deletePatient,
  getAllUniqueTags,
} from "../../utils/db";
import { toggleQuery, hasQuery } from "../../utils";
import { useQuery } from "../../hooks";

const columns = [
  { id: "lastName", title: "Прізвище", sortable: true },
  { id: "firstName", title: "Ім'я", sortable: true },
  { id: "fathersName", title: "По-батькові", sortable: true },
  { id: "birthDate", title: "Дата народження", sortable: true },
  { id: "phoneNumber", title: "Номер телефону", sortable: true },
  { id: "cardNumber", title: "Номер карти", sortable: true },
  { title: "Мітки" },
  { id: "additionalInfo", title: "Додаткова інформація", sortable: true },
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
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        {patient.tags.map((tag) => (
          <Token
            sx={{
              cursor: "pointer",
            }}
            isSelected={hasQuery(tag.id)}
            as={NavLink}
            key={tag.id}
            text={tag.text}
            to={`/patients?${toggleQuery(tag.id)}`}
          />
        ))}
      </Box>,
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
  const query = useQuery();
  const [doctors, setDoctors] = useState([]);
  const [deletingID, setDeletingID] = useState();
  const [tags, setTags] = useState();
  const [orderBy, setOrderBy] = useState();
  const [order, setOrder] = useState(true);
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();

  const handleToggleSort = (id) => {
    if (orderBy === id) {
      setOrder((prev) => !prev);
    } else {
      setOrderBy(id);
      setOrder(true);
    }
  };

  const loadItems = useCallback(() => {
    const createDeletingHandler = (id) => () => {
      setDeletingID(id);
    };

    const createDeleteHandler = (id) => () => {
      deletePatient(id).then(() => {
        loadItems();
      });
    };
    const tags = query.getAll("tag");
    return getAllPatients()
      .then((result) =>
        result.filter((tag) => {
          if (
            tags.length === 0 ||
            tags.every((id) =>
              (tag.tags || []).map(({ id }) => id).includes(id)
            )
          ) {
            return true;
          }
          return false;
        })
      )
      .then((items) => {
        if (!orderBy) {
          return items;
        }
        return items.sort((a, b) => {
          if (order) {
            return (b?.[orderBy] || "").localeCompare(a?.[orderBy] || "");
          }
          return (a?.[orderBy] || "").localeCompare(b?.[orderBy] || "");
        });
      })
      .then(mapToTable(deletingID, createDeletingHandler, createDeleteHandler))
      .then((result) => {
        setDoctors(result);
      });
  }, [setDoctors, deletingID, query, order, orderBy]);

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const filteredItems = useMemo(
    () =>
      doctors.filter(
        ([
          lastName,
          firstName,
          fathersName,
          birthDate,
          phoneNumber,
          cardNumber,
        ]) =>
          lastName.includes(filterValue) ||
          firstName.includes(filterValue) ||
          fathersName.includes(filterValue) ||
          birthDate.includes(filterValue) ||
          phoneNumber.includes(filterValue) ||
          cardNumber.includes(filterValue)
      ),
    [doctors, filterValue]
  );

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  useEffect(() => {
    getAllUniqueTags().then(setTags);
  }, [setTags]);
  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <Heading as="h2" sx={{ fontSize: 24 }}>
                Пацієнти
              </Heading>
              <TextInput
                onInput={handleFilterInput}
                value={filterValue}
                leadingVisual={SearchIcon}
                placeholder="Пошук"
                sx={{ minWidth: 250 }}
              />
            </Box>
          </Box>
          <Button as={NavLink} to="/add-patient">
            Додати пацієнта
          </Button>
        </Pagehead>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Text sx={{ fontWeight: "bold" }}>Мітки:</Text>
          {tags &&
            tags.map((tag) => (
              <Token
                sx={{
                  cursor: "pointer",
                }}
                isSelected={hasQuery(tag.id)}
                as={NavLink}
                key={tag.id}
                text={tag.text}
                to={`/patients?${toggleQuery(tag.id)}`}
              />
            ))}
        </Box>
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
              Пацієнти відсутні!
            </Heading>
          </Box>
        )}
        {filteredItems.length !== 0 && (
          <Table
            columns={columns}
            data={filteredItems}
            onToggleSort={handleToggleSort}
            order={order}
            orderBy={orderBy}
          />
        )}
      </PageLayout.Content>
    </PageLayout>
  );
};
