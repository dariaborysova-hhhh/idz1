import express from 'express';
import pool from './db.js';

const router = express.Router();

router.post('/', async (req, res) => {
  const { nurse_id, ward_id, shift } = req.body;

  try {
    const [wardsForNurse] = await pool.execute(
      `SELECT ward.name FROM ward
       JOIN nurse_ward ON ward.id_ward = nurse_ward.fid_ward
       WHERE nurse_ward.fid_nurse = ?`,
      [nurse_id]
    );

    const [nursesInDepartment] = await pool.execute(
      `SELECT nurse.name FROM nurse
       WHERE nurse.department = (
         SELECT department FROM nurse WHERE id_nurse = ?
       )`,
      [nurse_id]
    );

    const [shifts] = await pool.execute(
      `SELECT nurse.name, ward.name AS ward_name FROM nurse
       JOIN nurse_ward ON nurse_ward.fid_nurse = nurse.id_nurse
       JOIN ward ON nurse_ward.fid_ward = ward.id_ward
       WHERE nurse.shift = ?`,
      [shift]
    );

    res.render('results', {
      wardsForNurse,
      nursesInDepartment,
      shifts
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Помилка бази даних');
  }
});

export default router;
