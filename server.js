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
    name: "Max Verstappen",
    team: "Red Bull Racing",
    country: "Netherlands",
    championships: 3,
    wins: 57
  },
  {
    id: 2,
    name: "Sergio Perez",
    team: "Red Bull Racing",
    country: "Mexico",
    championships: 0,
    wins: 6
  },
  {
    id: 3,
    name: "Lewis Hamilton",
    team: "Mercedes",
    country: "United Kingdom",
    championships: 7,
    wins: 103
  },
  {
    id: 4,
    name: "George Russell",
    team: "Mercedes",
    country: "United Kingdom",
    championships: 0,
    wins: 1
  },
  {
    id: 5,
    name: "Charles Leclerc",
    team: "Ferrari",
    country: "Monaco",
    championships: 0,
    wins: 5
  },
  {
    id: 6,
    name: "Carlos Sainz",
    team: "Ferrari",
    country: "Spain",
    championships: 0,
    wins: 2
  },
  {
    id: 7,
    name: "Lando Norris",
    team: "McLaren",
    country: "United Kingdom",
    championships: 0,
    wins: 0
  },
  {
    id: 8,
    name: "Oscar Piastri",
    team: "McLaren",
    country: "Australia",
    championships: 0,
    wins: 0
  },
  {
    id: 9,
    name: "Fernando Alonso",
    team: "Aston Martin",
    country: "Spain",
    championships: 2,
    wins: 32
  },
  {
    id: 10,
    name: "Lance Stroll",
    team: "Aston Martin",
    country: "Canada",
    championships: 0,
    wins: 0
  },
  {
    id: 11,
    name: "Pierre Gasly",
    team: "Alpine",
    country: "France",
    championships: 0,
    wins: 1
  },
  {
    id: 12,
    name: "Esteban Ocon",
    team: "Alpine",
    country: "France",
    championships: 0,
    wins: 1
  },
  {
    id: 13,
    name: "Valtteri Bottas",
    team: "Alfa Romeo",
    country: "Finland",
    championships: 0,
    wins: 10
  },
  {
    id: 14,
    name: "Zhou Guanyu",
    team: "Alfa Romeo",
    country: "China",
    championships: 0,
    wins: 0
  },
  {
    id: 15,
    name: "Kevin Magnussen",
    team: "Haas",
    country: "Denmark",
    championships: 0,
    wins: 0
  },
  {
    id: 16,
    name: "Nico Hulkenberg",
    team: "Haas",
    country: "Germany",
    championships: 0,
    wins: 0
  },
  {
    id: 17,
    name: "Yuki Tsunoda",
    team: "AlphaTauri",
    country: "Japan",
    championships: 0,
    wins: 0
  },
  {
    id: 18,
    name: "Daniel Ricciardo",
    team: "AlphaTauri",
    country: "Australia",
    championships: 0,
    wins: 8
  },
  {
    id: 19,
    name: "Alexander Albon",
    team: "Williams",
    country: "Thailand",
    championships: 0,
    wins: 0
  },
  {
    id: 20,
    name: "Logan Sargeant",
    team: "Williams",
    country: "United States",
    championships: 0,
    wins: 0
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
