export const createDB = () =>
  new Promise((resolve, reject) => {
    const openRequest = indexedDB.open("uliana", 1);
    openRequest.onerror = () => {
      reject(openRequest);
    };
    openRequest.onupgradeneeded = (event) => {
      event.target.result.createObjectStore("doctors", {
        keyPath: "id",
        autoIncrement: true,
      });
      event.target.result.createObjectStore("patients", {
        keyPath: "id",
        autoIncrement: true,
      });
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

export const updateDoctor = (doctor = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("doctors")
          .objectStore("doctors")
          .put(doctor);
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

export const updatePatient = (patient = {}) =>
  createDB().then(
    (db) =>
      new Promise((resolve) => {
        const transaction = db
          .transaction("patients")
          .objectStore("patients")
          .put(patient);
        transaction.onsuccess = (event) => {
          resolve(event.target.result);
        };
      })
  );
