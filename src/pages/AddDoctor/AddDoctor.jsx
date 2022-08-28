import React, { useEffect, useState } from "react";
import {
  PageLayout,
  Pagehead,
  Heading,
  FormControl,
  TextInput,
  Box,
  Button,
} from "@primer/react";
import { useNavigate, useParams } from "react-router-dom";
import { addDoctor, updateDoctor, getDoctorByID } from "../../utils/db";

export const AddDoctor = () => {
  const { id } = useParams();
  const [{ fathersName, firstName, lastName, phoneNumber }, setDoctor] =
    useState({ fathersName: "", firstName: "", lastName: "", phoneNumber: "" });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (id) {
      updateDoctor({
        fathersName,
        firstName,
        lastName,
        phoneNumber,
        id: parseInt(id, 10),
      }).then(() => navigate("/doctors"));
    } else {
      addDoctor({
        fathersName,
        firstName,
        lastName,
        phoneNumber,
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

  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead>
          <Heading as="h2" sx={{ fontSize: 24 }}>
            Додати лікаря
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
              sx={{ width: "100%" }}
              autoFocus
            />
          </FormControl>
          <FormControl required>
            <FormControl.Label>Ім'я</FormControl.Label>
            <TextInput
              value={firstName}
              onInput={createInputHandler("firstName")}
              sx={{ width: "100%" }}
            />
          </FormControl>
          <FormControl required>
            <FormControl.Label>По-батькові</FormControl.Label>
            <TextInput
              value={fathersName}
              onInput={createInputHandler("fathersName")}
              sx={{ width: "100%" }}
            />
          </FormControl>
          <FormControl>
            <FormControl.Label>Номер телефону</FormControl.Label>
            <TextInput
              value={phoneNumber}
              onInput={createInputHandler("phoneNumber")}
              type="number"
              sx={{
                width: "100%",
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
