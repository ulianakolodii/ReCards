import React, { useContext, useEffect, useState } from "react";
import {
  Autocomplete,
  PageLayout,
  Pagehead,
  Heading,
  FormControl,
  TextInput,
  Box,
  Button,
} from "@primer/react";
import { AutocompleteSingle } from "../../components";
import { useNavigate, useParams } from "react-router-dom";
import {
  addVisit,
  updateVisit,
  getPatientByID,
  getAllUniqueTags,
  getAllDoctors,
  getAllPatients,
} from "../../utils/db";

const mapToAutocomplete = (doctors) =>
  doctors?.map((doctor) => ({
    text: `${doctor.lastName} ${doctor.firstName} ${doctor.fathersName}`,
    id: doctor.id,
  }));

export const AddVisit = () => {
  const { id } = useParams();
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [{ dateTime, doctor, patient }, setVisit] = useState({
    dateTime: "",
    doctor: undefined,
    patient: undefined,
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (id) {
      updateVisit({
        doctor,
        patient,
        dateTime: Date.parse(dateTime),
        id: parseInt(id, 10),
      }).then(() => navigate("/visits"));
    } else {
      addVisit({
        doctor,
        patient,
        dateTime: Date.parse(dateTime),
        timestamp: Date.now(),
      }).then(() => navigate("/visits"));
    }
    event.preventDefault();
  };

  const createInputHandler = (name) => (event) => {
    setVisit((prevDoctor) => ({
      ...prevDoctor,
      [name]: event.target.value,
    }));
  };

  const handleDoctorChange = ({ id }) => {
    setVisit((prevVisit) => ({ ...prevVisit, doctor: id }));
  };

  const handlePatientChange = ({ id }) => {
    setVisit((prevVisit) => ({ ...prevVisit, patient: id }));
  };

  // useEffect(() => {
  //   if (id) {
  //     getPatientByID(parseInt(id, 10)).then(setPatient);
  //   }
  // }, [setPatient, id]);

  useEffect(() => {
    getAllDoctors()
      .then(mapToAutocomplete)
      .then((result) => {
        setDoctors(result);
      });
    getAllPatients()
      .then(mapToAutocomplete)
      .then((result) => setPatients(result));
  }, [setDoctors, setPatients]);

  return (
    <PageLayout>
      <PageLayout.Header>
        <Pagehead>
          <Heading as="h2" sx={{ fontSize: 24 }}>
            {id ? "Редагувати візит" : "Додати візит"}
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
            <FormControl.Label>Лікар</FormControl.Label>
            <Autocomplete>
              <AutocompleteSingle
                items={doctors}
                value={doctor}
                onChange={handleDoctorChange}
              />
            </Autocomplete>
          </FormControl>
          <FormControl required>
            <FormControl.Label>Пацієнт</FormControl.Label>
            <Autocomplete>
              <AutocompleteSingle
                items={patients}
                value={patient}
                onChange={handlePatientChange}
              />
            </Autocomplete>
          </FormControl>
          <FormControl required>
            <FormControl.Label>Дата та час</FormControl.Label>
            <TextInput
              type="datetime-local"
              value={dateTime}
              onInput={createInputHandler("dateTime")}
              block
              autoFocus
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
