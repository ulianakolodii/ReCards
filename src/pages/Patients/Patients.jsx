import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useTransition,
} from "react";
import {
  ActionList,
  ActionMenu,
  Box,
  Button,
  Label,
  PageLayout,
  Text,
  TextInput,
  CounterLabel,
  FormControl,
  Pagination,
} from "@primer/react";
import { SearchIcon, SortAscIcon, SortDescIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { PatientRow } from "../../components";
import {
  getAllPatients,
  deletePatient,
  getAllUniqueTags,
} from "../../utils/db";
import {
  toggleQuery,
  hasQuery,
  sortBy,
  containsTags,
  includesBy,
} from "../../utils";
import { useQuery } from "../../hooks";

const limit = 50;

export const Patients = () => {
  const query = useQuery();
  const [patients, setPatients] = useState([]);
  const [deletingID, setDeletingID] = useState();
  const [tags, setTags] = useState();
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState(false);
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();
  const [page, setPage] = useState(1);

  const createHandleSort = (orderByColumn, orderType) => () => {
    setOrderBy(orderByColumn);
    setOrder(orderType);
  };

  const loadItems = useCallback(() => {
    const handleStartDelete = (id) => {
      setDeletingID(id);
    };

    const handleConfirmDelete = (id) => {
      deletePatient(id).then(() => {
        loadItems();
      });
    };

    const handleCancelDelete = () => {
      setDeletingID(undefined);
    };
    return getAllPatients().then((items) =>
      setPatients(
        items.map((item) => ({
          ...item,
          deleting: item.id === deletingID,
          onStartDelete: handleStartDelete,
          onCancelDelete: handleCancelDelete,
          onConfirmDelete: handleConfirmDelete,
        }))
      )
    );
  }, [setPatients, deletingID]);

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const filteredItems = useMemo(() => {
    return patients
      .filter(containsTags(query.getAll("tag")))
      .filter((el) =>
        includesBy(filterValue, el, [
          "lastName",
          "firstName",
          "fathersName",
          "birthDate",
          "phoneNumber",
          "id",
        ])
      )
      .sort(sortBy(order, orderBy));
  }, [patients, filterValue, order, orderBy, query]);

  const offset = useMemo(() => (page - 1) * limit, [page]);
  const pages = useMemo(() => Math.ceil(filteredItems.length / limit), [filteredItems]);
  const limitedItems = useMemo(() => filteredItems.slice(offset, offset + limit), [filteredItems, offset]);

  const tagsStatisticsList = useMemo(
    () =>
      filteredItems.reduce((list, patient) => {
        if (patient?.tags?.length > 0) {
          patient?.tags.forEach((tag) => {
            list[tag.id] = (list[tag.id] || 0) + 1;
          });
        }
        return list;
      }, {}),
    [filteredItems]
  );

  const handlePageChange = (event, page) => {
    event.preventDefault();
    setPage(page);
  };

  useEffect(() => {
    setPage(1);
  }, [order, orderBy, filterValue]);

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
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
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
        </Box>
        <Box sx={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
          <Button as={NavLink} to="/add-patient">
            Додати пацієнта
          </Button>
        </Box>
      </Box>
      <PageLayout.Content>
        <Box>
          <Box
            sx={{
              background: (theme) => theme.colors.btn.focusBg,
              borderTopRightRadius: 6,
              borderTopLeftRadius: 6,
              borderWidth: 1,
              borderStyle: "solid",
              borderColor: "btn.border",
              padding: 3,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              <Text sx={{ fontSize: 14 }}>Мітки:</Text>
              {tags &&
                tags.map((tag) =>
                  !tagsStatisticsList[tag.id] ? null : (
                    <Label
                      as={NavLink}
                      key={tag.id}
                      to={`/patients?${toggleQuery(tag.id)}`}
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
            <Box>
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
          {limitedItems.map((patient) => (
            <PatientRow key={patient.id} {...patient} />
          ))}
          {pages > 1 ? (
          <Pagination
            currentPage={page}
            pageCount={pages}
            onPageChange={handlePageChange}
            sx={{
              "& em": {
                minWidth: "auto",
              },
              "& a": {
                minWidth: "auto",
              },
            }}
          />
        ) : null}
          {limitedItems.length === 0 && (
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
              <Text sx={{ fontSize: 36 }}>Нікого не знайдено!</Text>
              <Text>Спробуйте додати пацієнта.</Text>
              <Button
                sx={{ marginTop: 2 }}
                variant="primary"
                as={NavLink}
                to="/add-patient"
              >
                Додати пацієнта
              </Button>
            </Box>
          )}
        </Box>
      </PageLayout.Content>
    </PageLayout>
  );
};
