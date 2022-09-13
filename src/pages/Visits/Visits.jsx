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
} from "@primer/react";
import { SearchIcon, SortAscIcon, SortDescIcon } from "@primer/octicons-react";
import { NavLink } from "react-router-dom";
import { VisitRow } from "../../components";
import {
  getAllDoctors,
  deleteVisit,
  dbArrayToObject,
  getAllPatients,
  getAllVisits,
  includesBy,
} from "../../utils";

const getFullName = (mapObj, id) => {
  return `${mapObj?.[id]?.lastName} ${mapObj?.[id]?.firstName} ${mapObj?.[id]?.fathersName}`;
};

export const Visits = () => {
  const [[doctors, patients, visits], setItems] = useState([{}, {}, []]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState(false);

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

  const filteredItems = useMemo(
    () =>
      visits
        .map((visit) => ({
          ...visit,
          doctor: doctors[visit.doctor],
          patient: patients[visit.patient],
          deleting: visit.id === deletingID,
          onStartDelete: handleStartDelete,
          onCancelDelete: handleCancelDelete,
          onConfirmDelete: handleConfirmDelete,
        }))
        .filter(
          ({ doctor, patient }) =>
            includesBy(filterValue, doctor, [
              "lastName",
              "firstName",
              "fathersName",
              "phoneNumber",
            ]) ||
            includesBy(filterValue, patient, [
              "lastName",
              "firstName",
              "fathersName",
              "birthDate",
              "phoneNumber",
              "id",
            ])
        ),
    [
      deletingID,
      visits,
      doctors,
      patients,
      filterValue,
      handleStartDelete,
      handleCancelDelete,
      handleConfirmDelete,
    ]
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
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
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
        {console.log(filteredItems)}
      </PageLayout.Content>
    </PageLayout>
  );
};
