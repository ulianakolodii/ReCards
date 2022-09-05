export const createDB = () =>
  new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("uliana", 2);
    openRequest.onerror = () => {
      reject(openRequest);
    };
    openRequest.onupgradeneeded = (event) => {
      const db = event.target.result;
      console.log("db", db);
      if (!db.objectStoreNames.contains("doctors")) {
        db.createObjectStore("doctors", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains("patients")) {
        db.createObjectStore("patients", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains("visits")) {
        db.createObjectStore("visits", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
    };
    openRequest.onsuccess = (event) => {
      resolve(event.target.result);
    };
  });

export const addDoctor = (data = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors", "readwrite")
          .objectStore("doctors")
          .add(data);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const deleteDoctor = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors", "readwrite")
          .objectStore("doctors")
          .delete(id);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const getAllDoctors = () =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors")
          .objectStore("doctors")
          .getAll();
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const getDoctorByID = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors")
          .objectStore("doctors")
          .get(id);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const updateDoctor = (doctor = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors", "readwrite")
          .objectStore("doctors")
          .put(doctor);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const getPatientByID = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients")
          .objectStore("patients")
          .get(id);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const addPatient = (data = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients", "readwrite")
          .objectStore("patients")
          .add(data);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const deletePatient = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients", "readwrite")
          .objectStore("patients")
          .delete(id);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const getAllPatients = () =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients")
          .objectStore("patients")
          .getAll();
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const getAllTags = () =>
  getAllPatients().then((patients) =>
    patients.reduce(
      (accumulator, patient) => accumulator.concat(patient.tags),
      []
    )
  );

export const getAllUniqueTags = () =>
  getAllTags().then((tags) =>
    Object.values(
      tags.reduce((accumulator, tag) => ({ ...accumulator, [tag.id]: tag }), {})
    )
  );

export const updatePatient = (patient = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients", "readwrite")
          .objectStore("patients")
          .put(patient);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const addVisit = (data = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("visits", "readwrite")
          .objectStore("visits")
          .add(data);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const deleteVisit = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("visits", "readwrite")
          .objectStore("visits")
          .delete(id);
        transaction.onsuccess = (event) => {
          resolve(event);
        };
      })
  );

export const getAllVisits = () =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("visits")
          .objectStore("visits")
          .getAll();
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const getVisitByID = (id) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("visits")
          .objectStore("visits")
          .get(id);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );

export const updateVisit = (doctor = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("visits", "readwrite")
          .objectStore("visits")
          .put(doctor);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );
