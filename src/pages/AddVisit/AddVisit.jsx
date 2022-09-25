import React, { useEffect, useState, useMemo, useCallback } from "react";
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
  getVisitByID,
  getAllDoctors,
  getAllPatients,
  getPatientByID,
} from "../../utils/db";
import dayjs from "dayjs";

const mapToAutocomplete = (doctors) =>
  doctors?.map((doctor) => ({
    text: `${doctor.lastName} ${doctor.firstName} ${doctor.fathersName}`,
    id: doctor.id,
  }));

export const AddVisit = () => {
  const { id } = useParams();

  const [doctor, setDoctor] = useState("");
  const [patient, setPatient] = useState("");
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const doctorObj = useMemo(
    () => doctors.find((el) => String(el?.text).includes(doctor)),
    [doctors, doctor]
  );
  const patientObj = useMemo(
    () => patients.find((el) => String(el?.text).includes(patient)),
    [patients, patient]
  );
  const [dateTime, setDateTime] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    if (id) {
      getVisitByID(parseInt(id, 10))
        .then((visitEl) => {
          console.log("visitEl", visitEl, dateTime, Date.parse(dateTime));
          return updateVisit({
            ...visitEl,
            doctor: doctorObj.id,
            patient: patientObj.id,
            dateTime: Date.parse(dateTime),
          });
        })
        .then(() => navigate("/"));
    } else {
      getPatientByID(patientObj.id).then((patientEl) => {
        const isChild =
          dayjs(Date.now()).diff(patientEl.birthDate, "year") <= 15;
        console.log(
          "isChild",
          isChild,
          dayjs(Date.now()).diff(patientEl.birthDate, "year")
        );
        addVisit({
          doctor: doctorObj.id,
          patient: patientObj.id,
          dateTime: Date.parse(dateTime),
          isChild,
          timestamp: Date.now(),
        }).then(() => navigate("/"));
      });
    }
    event.preventDefault();
  };

  const handleDateTimeInput = useCallback(
    (event) => {
      setDateTime(event.target.value);
    },
    [setDateTime]
  );

  useEffect(() => {
    Promise.all([
      getAllDoctors().then(mapToAutocomplete),
      getAllPatients().then(mapToAutocomplete),
    ]).then(([doctors, patients]) => {
      setDoctors(doctors);
      setPatients(patients);

      if (id) {
        getVisitByID(parseInt(id, 10)).then(
          ({ doctor: doctorID, patient: patientID, dateTime: dt }) => {
            setDoctor(doctors.find((el) => el.id === doctorID)?.text || "");
            setPatient(patients.find((el) => el.id === patientID)?.text || "");
            setDateTime(dayjs(dt).format().slice(0, 16));
          }
        );
      }
    });
  }, [setDoctors, setPatients, setDateTime, setDoctor, setPatient, id]);

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
                validationStatus={doctorObj ? "" : "error"}
                items={doctors}
                value={doctor}
                onChange={setDoctor}
              />
            </Autocomplete>
          </FormControl>
          <FormControl required>
            <FormControl.Label>Пацієнт</FormControl.Label>
            <Autocomplete>
              <AutocompleteSingle
                validationStatus={patientObj ? "" : "error"}
                items={patients}
                value={patient}
                onChange={setPatient}
              />
            </Autocomplete>
          </FormControl>
          <FormControl required>
            <FormControl.Label>Дата та час</FormControl.Label>
            <TextInput
              type="datetime-local"
              value={dayjs(dateTime).format("YYYY-MM-DDTHH:mm")}
              onInput={handleDateTimeInput}
              block
              autoFocus
            />
          </FormControl>
          <Box>
            {!id && (
              <Button
                type="submit"
                variant="primary"
                disabled={!doctorObj || !patientObj}
              >
                Додати
              </Button>
            )}
            {id && (
              <Button type="submit" disabled={!doctorObj || !patientObj}>
                Зберегти
              </Button>
            )}
          </Box>
        </Box>
      </PageLayout.Content>
    </PageLayout>
  );
};
