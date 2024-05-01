import express from "express";
const router = express.Router();
import {
    createAddress, getAddress, updateAddress, deleteAddress
} from '../controllers/addressController.js'

router.route('/').post(createAddress)
router.route('/:id')
    .get(getAddress)
    .put(updateAddress)
    .delete(deleteAddress)

export default router;
