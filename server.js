// Inisialisasi server Express
const express = require('express');
const app = express();
const port = 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Database sederhana untuk menyimpan data driver F1
let f1Drivers = [
  {
    id: 1,
    name: "Lewis Hamilton",
    team: "Ferrari",
    country: "United Kingdom",
    championships: 7,
    wins: 103
  },
  {
    id: 2,
    name: "Max Verstappen",
    team: "Red Bull Racing",
    country: "Netherlands",
    championships: 3,
    wins: 57
  },
  {
    id: 3,
    name: "Charles Leclerc",
    team: "Ferrari",
    country: "Monaco",
    championships: 0,
    wins: 5
  }
];

// Root route - Halaman selamat datang
app.get('/', (req, res) => {
  res.json({
    message: "Selamat datang di API Character Driver F1",
    endpoints: {
      getAllDrivers: "GET /api/drivers",
      getDriverById: "GET /api/drivers/:id",
      addNewDriver: "POST /api/drivers",
      updateDriver: "PUT /api/drivers/:id",
      deleteDriver: "DELETE /api/drivers/:id",
      searchByTeam: "GET /api/drivers/search/team?team=nama_tim"
    }
  });
});

// GET - Mendapatkan semua driver F1
app.get('/api/drivers', (req, res) => {
  res.json({
    data: f1Drivers
  });
});

// GET - Mendapatkan driver F1 berdasarkan ID
app.get('/api/drivers/:id', (req, res) => {
  const driverId = parseInt(req.params.id);
  const driver = f1Drivers.find(driver => driver.id === driverId);
  
  if (!driver) {
    return res.status(404).json({
      message: "Driver tidak ditemukan"
    });
  }
  
  res.json({
    data: driver
  });
});

// POST - Menambahkan driver F1 baru
app.post('/api/drivers', (req, res) => {
  const { name, team, country, championships, wins } = req.body;
  
  // Validasi data yang masuk
  if (!name || !team || !country) {
    return res.status(400).json({
      message: "Data driver belum lengkap. Wajib memiliki name, team, dan country"
    });
  }
  
  // Generate ID baru (ID terakhir + 1)
  const newId = f1Drivers.length > 0 ? f1Drivers[f1Drivers.length - 1].id + 1 : 1;
  
  // Buat objek driver baru
  const newDriver = {
    id: newId,
    name,
    team,
    country,
    championships: championships || 0,
    wins: wins || 0
  };
  
  // Tambahkan ke database
  f1Drivers.push(newDriver);
  
  res.status(201).json({
    message: "Driver berhasil ditambahkan",
    data: newDriver
  });
});

// PUT - Update data driver F1 berdasarkan ID (Fitur tambahan)
app.put('/api/drivers/:id', (req, res) => {
  const driverId = parseInt(req.params.id);
  const driverIndex = f1Drivers.findIndex(driver => driver.id === driverId);
  
  if (driverIndex === -1) {
    return res.status(404).json({
      message: "Driver tidak ditemukan"
    });
  }
  
  const { name, team, country, championships, wins } = req.body;
  
  // Update data driver
  f1Drivers[driverIndex] = {
    ...f1Drivers[driverIndex], // Pertahankan data yang tidak diubah
    name: name || f1Drivers[driverIndex].name,
    team: team || f1Drivers[driverIndex].team,
    country: country || f1Drivers[driverIndex].country,
    championships: championships !== undefined ? championships : f1Drivers[driverIndex].championships,
    wins: wins !== undefined ? wins : f1Drivers[driverIndex].wins
  };
  
  res.json({
    message: "Data driver berhasil diperbarui",
    data: f1Drivers[driverIndex]
  });
});

// DELETE - Menghapus driver F1 berdasarkan ID (Fitur tambahan)
app.delete('/api/drivers/:id', (req, res) => {
  const driverId = parseInt(req.params.id);
  const driverIndex = f1Drivers.findIndex(driver => driver.id === driverId);
  
  if (driverIndex === -1) {
    return res.status(404).json({
      message: "Driver tidak ditemukan"
    });
  }
  
  // Hapus driver dari array
  const deletedDriver = f1Drivers.splice(driverIndex, 1)[0];
  
  res.json({
    message: "Driver berhasil dihapus",
    data: deletedDriver
  });
});

// GET - Pencarian driver berdasarkan team (Fitur tambahan)
app.get('/api/drivers/search/team', (req, res) => {
  const team = req.query.team;
  
  if (!team) {
    return res.status(400).json({
      message: "Parameter team diperlukan"
    });
  }
  
  const filteredDrivers = f1Drivers.filter(driver => 
    driver.team.toLowerCase().includes(team.toLowerCase())
  );
  
  res.json({
    data: filteredDrivers
  });
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
