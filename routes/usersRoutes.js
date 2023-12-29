import express from 'express';
import{
    createUser,
    getAllUsers,
    cashDeposit,
    creditDeposit,
    cashWithdraw,
    cashTransffer,
    getUserById,
    getUsersByTotalMoney,
    getUserByStatus
} from '../controllers/usersController.js'

const router = express.Router();

router.get('/', getAllUsers);

router.post('/', createUser);

//FILTER USERS IF they have amount of specific money

router.get('/:totalMoney', getUsersByTotalMoney);

router.get('/id/:id', getUserById);

// Cash deposit for user by is ID

router.put('/:id/cashDeposit', cashDeposit);

// Credit deposit to a user by is ID

router.put('/:id/creditDeposit', creditDeposit);

// Cash or Credit withdraw for a user by is ID 

router.put('/:id/cashwithdraw', cashWithdraw);

// Transffer cash or credit from one user to another

router.put('/:id/cashtransffer', cashTransffer);

// find users by there active status
router.get('/userstatus/:isactive', getUserByStatus)


export default router