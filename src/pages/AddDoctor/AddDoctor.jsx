import React, { useEffect, useState } from "react";
import {
  PageLayout,
  Pagehead,
  Heading,
  FormControl,
  TextInput,
  Box,
  Button,
  Autocomplete,
  Text,
} from "@primer/react";
import { useNavigate, useParams } from "react-router-dom";
import {
  addDoctor,
  updateDoctor,
  getDoctorByID,
  getAllDepartments,
} from "../../utils/db";

export const AddDoctor = () => {
  const { id } = useParams();
  const [
    { fathersName, firstName, lastName, phoneNumber, department },
    setDoctor,
  ] = useState({
    fathersName: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const navigate = useNavigate();
  const [departmentItems, setDepartmentItems] = useState([]);

  const handleInput = (event) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      department: event.target.value,
    }));
  };

  const handleSelectedChange = (event) => {
    setDoctor((prevDoctor) => ({ ...prevDoctor, department: event[0].text }));
  };

  const handleSubmit = (event) => {
    if (id) {
      getDoctorByID(parseInt(id, 10))
        .then((doctorEl) =>
          updateDoctor({
            ...doctorEl,
            fathersName,
            firstName,
            lastName,
            phoneNumber,
            department,
          })
        )
        .then(() => navigate("/doctors"));
    } else {
      addDoctor({
        fathersName,
        firstName,
        lastName,
        phoneNumber,
        department,
        timestamp: Date.now(),
      }).then(() => navigate("/doctors"));
    }
    event.preventDefault();
  };

  const createInputHandler = (name) => (event) => {
    setDoctor((prevDoctor) => ({
      ...prevDoctor,
      [name]: event.target.value,
    }));
  };

  useEffect(() => {
    if (id) {
      getDoctorByID(parseInt(id, 10)).then(setDoctor);
    }
  }, [setDoctor, id]);

  useEffect(() => {
    getAllDepartments().then((items) => {
      setDepartmentItems(
        Object.keys(items).map((id) => ({
          text: items[id],
          id,
        }))
      );
    });
  }, [setDepartmentItems]);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead>
          <Heading as="h2" sx={{ fontSize: 24 }}>
            {id ? "Редагувати лікаря" : "Додати лікаря"}
          </Heading>
        </Pagehead>
      </PageLayout.Header>
      <PageLayout.Content>
        <Box
          as="form"
          sx={{ display: "flex", flexDirection: "column", gap: 4 }}
          onSubmit={handleSubmit}
        >
          <FormControl required>
            <FormControl.Label>Прізвище</FormControl.Label>
            <TextInput
              value={lastName}
              onInput={createInputHandler("lastName")}
              block
              autoFocus
            />
          </FormControl>
          <FormControl required>
            <FormControl.Label>Ім'я</FormControl.Label>
            <TextInput
              value={firstName}
              onInput={createInputHandler("firstName")}
              block
            />
          </FormControl>
          <FormControl required>
            <FormControl.Label>По-батькові</FormControl.Label>
            <TextInput
              value={fathersName}
              onInput={createInputHandler("fathersName")}
              block
            />
          </FormControl>
          <FormControl required>
            <FormControl.Label>Кафедра</FormControl.Label>
            <Autocomplete>
              <Autocomplete.Input
                block
                value={department}
                onInput={handleInput}
              />
              <Autocomplete.Overlay>
                <Autocomplete.Menu
                  onSelectedChange={handleSelectedChange}
                  emptyStateText={
                    <Box sx={{ display: "flex", flexDirection: "column" }}>
                      <Text sx={{ fontWeight: 600 }}>Нічого не знайдено!</Text>
                    </Box>
                  }
                  items={departmentItems}
                  selectedItemIds={[]}
                />
              </Autocomplete.Overlay>
            </Autocomplete>
          </FormControl>
          <FormControl>
            <FormControl.Label>Номер телефону</FormControl.Label>
            <TextInput
              value={phoneNumber}
              onInput={createInputHandler("phoneNumber")}
              type="number"
              block
              sx={{
                "& > input[type=number]::-webkit-inner-spin-button": {
                  display: "none",
                },
                "& > input[type=number]::-webkit-outer-spin-button": {
                  display: "none",
                },
              }}
            />
          </FormControl>
          <Box>
            {!id && (
              <Button type="submit" variant="primary">
                Додати
              </Button>
            )}
            {id && <Button type="submit">Зберегти</Button>}
          </Box>
        </Box>
      </PageLayout.Content>
    </PageLayout>
  );
};
