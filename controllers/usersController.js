import STATUS_CODE from "../Constants/statusCode.js";
import { readUsersFromFile, writeUsersToFile } from "../models/usersModel.js";
import { v4 as uuidv4 } from "uuid";
import generatePassword from 'password-generator';
export const getAllUsers = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    res.send(users);
  } catch (error) {
    next(error);
  }
};




export const getUserById = async (req, res, next) => {
  try {
    const users = readUsersFromFile();
    const user = users.find((u) => u.id === req.params.id);
    if (!user) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("user not found");
    }
    res.send(user);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  let totalCashFlow = 0;
  try {
    const { userName, cash, credit} = req.body;
    if (!cash || !credit) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error("All fields (userName, Cash, Credit) are required");
    }
    const users = readUsersFromFile();
    if (users.some((users) => users.userName === userName)) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error("there is A user with that name.");
    }
    totalCashFlow = cash + credit;
    const newUser = {
      id: uuidv4(),
      userName,
      cash,
      credit,
      totalCashFlow,
      isActive: true,
      isAdmin: false,
      password: generatePassword()
    };
    users.push(newUser);
    writeUsersToFile(users);
    res.status(STATUS_CODE.CREATED).send(newUser);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const cashDeposit = async (req, res, next) => {
  try {
    const { cashDeposit } = req.body;
    const users = readUsersFromFile();

    const userIndex = users.findIndex((user) => user.id === req.params.id);
    let user = users[userIndex];
    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("User not Found!");
    }
    if(user.isActive === false){
        res.status(STATUS_CODE.FORBIDDEN)
        throw new Error(`${user.userName} IS not an active user. requset faild!`)
    }
    user.cash = user.cash + cashDeposit;
    user.totalCashFlow = user.cash + user.credit;

    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const creditDeposit = async (req, res, next) => {
  try {
    const { creditDeposit } = req.body;
    const users = readUsersFromFile();
    const userIndex = users.findIndex((user) => user.id === req.params.id);
    let user = users[userIndex];
    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("user not Found.");
    }
    if(user.isActive === false){
        res.status(STATUS_CODE.FORBIDDEN)
        throw new Error(`${user.userName} IS not an active user. requset faild!`)
    }

    user.credit = user.credit + creditDeposit;
    user.totalCashFlow = user.credit +user.cash;
    writeUsersToFile(users);
    res.status(STATUS_CODE.OK).send(user);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const cashWithdraw = async (req, res, next) => {
  try {
    const { cashWithdraw } = req.body;
    const users = readUsersFromFile();

    const userIndex = users.findIndex((user) => user.id === req.params.id);
    const user = users[userIndex];
    if (userIndex === -1) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error("user not found.");
    }

    if(user.isActive === false){
        res.status(STATUS_CODE.FORBIDDEN)
        throw new Error(`${user.userName} IS not an active user. requset faild!`)
    }

    let totalWithdrawAmount = cashWithdraw;

    if (user.credit > 0) {
      const creditWithdraw = Math.min(user.credit, totalWithdrawAmount);
      user.credit -= creditWithdraw;
      totalWithdrawAmount -= creditWithdraw;
    }

    if (totalWithdrawAmount > 0 && user.cash > 0) {
      const cashWithdraw = Math.min(user.cash, totalWithdrawAmount);
      user.cash -= cashWithdraw;
      totalWithdrawAmount -= cashWithdraw;
    }

    if (totalWithdrawAmount > 0) {
      res.status(STATUS_CODE.BAD_REQUEST);
      throw new Error(`${user.userName} does not have enough funds.`);
    }
    user.totalCashFlow = user.totalCashFlow - cashWithdraw;
    writeUsersToFile(users);
    res
      .status(STATUS_CODE.OK)
      .send(`Withdrawn ${cashWithdraw}$ from '${user.userName}' account.`);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const cashTransffer = async (req, res, next) => {
  try {
    const { transfferAmount, userId } = req.body;
    const users = readUsersFromFile();
    // user hows transffer money
    const user1 = users.find((user) => user.id === req.params.id);
    //user how get money
    const user2 = users.find((user) => user.id === userId);
    // console.log("user1: ", user1.userName);
    // console.log("user2: ", user2.userName);

    if (!user1 || !user2) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error(
        " at list one of the users is not found. please try again."
      );
    }
    if(user1.isActive === false || user2.isActive === false){
        res.status(STATUS_CODE.FORBIDDEN)
        throw new Error('one of the users is not an active user. requset faild!')
    }
    let totalTranssferAmount = transfferAmount;

    if (user1.credit > 0) {
      const creditTrasnffer = Math.min(user1.credit, totalTranssferAmount);
      user1.credit -= creditTrasnffer;
      totalTranssferAmount -= creditTrasnffer;
      user2.credit += creditTrasnffer;
    }
    if (totalTranssferAmount > 0 && user1.cash > 0) {
      const cashTransffer = Math.min(user1.cash, totalTranssferAmount);
      user1.cash -= cashTransffer;
      totalTranssferAmount -= cashTransffer;
      user2.credit += cashTransffer;
    }

    if (totalTranssferAmount > 0) {
      res.status(STATUS_CODE.CONFLICT);
      throw new Error(`'${user1.userName}' as not have enough fund.`);
    }
    user1.totalCashFlow = user1.totalCashFlow - transfferAmount;
    user2.totalCashFlow = user2.totalCashFlow + transfferAmount;
    writeUsersToFile(users);
    res
      .status(STATUS_CODE.OK)
      .send(
        `'${user1.userName} as secsessfuly as transffer ${transfferAmount} to '${user2.userName}'`
      );
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};

export const getUsersByTotalMoney = async (req, res, next) => {
  try {
    
    const users = readUsersFromFile();
    const totalMoney = parseInt(req.params.totalMoney)
  
    
    const filterdUsers = users.filter(
        (user) => user.totalCashFlow >= totalMoney
        );
        console.log(totalMoney);
    if (filterdUsers.length === 0) {
      res.status(STATUS_CODE.NOT_FOUND);
      throw new Error(
        `there are no users with total money flow of  at least ${totalMoney}$.`
      );
    }
    res.status(STATUS_CODE.OK).send(filterdUsers);
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST);
    next(error);
  }
};


export const getUserByStatus = async (req, res, next) =>{
  try {
    const activeStatus = req.params.isactive.toLowerCase();

    if(activeStatus !== 'true' && activeStatus !== "false"){
      res.status(STATUS_CODE.BAD_REQUEST)
      throw new Error("invalid endpoint. 'active status' should only  be 'true' or 'false")
    }
    
    const users = readUsersFromFile()
    const activeUsers = users.filter((user) => user.isActive === (activeStatus === 'true'));    
    if(activeUsers.length === 0){
      res.status(STATUS_CODE.NOT_FOUND)
      throw new Error(`there is no user how's status is ${activeStatus === 'true' ? '`Active`': '`Not Active`'}`)
    }
    res.status(STATUS_CODE.OK).send(activeUsers)
  } catch (error) {
    res.status(STATUS_CODE.BAD_REQUEST)
    next(error)
  }
} 