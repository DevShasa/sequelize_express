'use strict'; const { Model, Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt')
const sequelize = require('../../config/database')

module.exports = sequelize.define("user",{
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  firstName: {
    type: DataTypes.STRING
  },
  lastName: {
    type: DataTypes.STRING
  },
  userType: {
    type: DataTypes.ENUM('admin','seller','buyer')
  },
  email: {
    type: DataTypes.STRING
  },
  password: {
    type: DataTypes.STRING
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  confirmPassword:{
    type: DataTypes.VIRTUAL, // not stored in db only for program
    set(val){
      if(val === this.password){
        // do the hashing 
        const hashedPassword = bcrypt.hashSync(val, 10);
        this.setDataValue("password", hashedPassword) // before inserting to db set
      }else{
        throw new Error("Password and confirmpassword must be same")
      }
    }
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE
  },
  deletedAt:{
    type:DataTypes.DATE
  }
},{
  freezeTableName: true,
  modelName:"user",
  paranoid: true
})