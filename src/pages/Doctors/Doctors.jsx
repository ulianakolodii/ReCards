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
import { DoctorRow } from "../../components";
import { getAllDoctors, deleteDoctor, sortBy, includesBy } from "../../utils";

export const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [deletingID, setDeletingID] = useState();
  const [filterValue, setFilterValue] = useState("");
  const [, startTransition] = useTransition();
  const [orderBy, setOrderBy] = useState("id");
  const [order, setOrder] = useState(false);

  const createHandleSort = (orderByColumn, orderType) => () => {
    setOrderBy(orderByColumn);
    setOrder(orderType);
  };

  const handleFilterInput = (event) => {
    startTransition(() => {
      setFilterValue(event.target.value);
    });
  };

  const filteredItems = useMemo(
    () =>
      doctors
        .sort(sortBy(order, orderBy))
        .filter((el) =>
          includesBy(filterValue, el, [
            "lastName",
            "firstName",
            "fathersName",
            "phoneNumber",
            "deparment",
            "id",
          ])
        ),
    [doctors, filterValue, orderBy, order]
  );

  const loadDoctors = useCallback(() => {
    const handleStartDelete = (id) => {
      setDeletingID(id);
    };

    const handleConfirmDelete = (id) => {
      deleteDoctor(id).then(() => {
        loadDoctors();
      });
    };

    const handleCancelDelete = () => {
      setDeletingID(undefined);
    };
    return getAllDoctors().then((items) => {
      setDoctors(
        items.map((item) => ({
          ...item,
          deleting: item.id === deletingID,
          onStartDelete: handleStartDelete,
          onCancelDelete: handleCancelDelete,
          onConfirmDelete: handleConfirmDelete,
        }))
      );
    });
  }, [setDoctors, deletingID]);

  useEffect(() => {
    loadDoctors();
  }, [loadDoctors]);
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
        <Button as={NavLink} to="/add-doctor">
          Додати лікаря
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
          <DoctorRow key={doctor.id} {...doctor} />
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
            <Text sx={{ fontSize: 36 }}>Нікого не знайдено!</Text>
            <Text>Спробуйте додати лікаря.</Text>
            <Button
              sx={{ marginTop: 2 }}
              variant="primary"
              as={NavLink}
              to="/add-doctor"
            >
              Додати лікаря
            </Button>
          </Box>
        )}
      </PageLayout.Content>
    </PageLayout>
  );
};
