// logs into an admin account on postgres 
// (should be your user account)
// configure the admin info in the knexfile
//
// from the admin account it drops the test db, creates it again
// and adds proper privileges, and runs migrations and seeds
// TODO: same thing for the development db
"use strict"; 

var knexConfig = require('../../knexfile');

// assume its the test db unless otherwise specified
var database = 'flyptox_test';

// default knex config to use (should be a local pg account with admin access)
var kConfig = knexConfig.admin;

// see if an options switch was used
// always ignore first 2 args
process.argv.slice(2).forEach(function(val, index, array){
  if (val[0] === '-'){
    // option switch used -check flag
    console.log(val);
    // check for dev flag
    if (val.slice(1) === 'dev'){
      // set database to development
      database = 'flyptox';
    } else if (val.slice(1) === 'travis'){
      // set user to travis
      kConfig = knexConfig.travis;
    }
  }
});

var knex = require('knex')(kConfig);

console.log('Dropping database!' + database);
knex.raw('DROP DATABASE IF EXISTS ' + database + ';')
  .then(function(){
    console.log('Creating new database: ' + database);
    return knex.raw('CREATE DATABASE ' + database + ';');
  })
  .then(function(){
    console.log('Creating role ' + database);
    return knex.raw('create role ' + database + ' with login;');
  })
  .catch(function(){
    // role already exists
    return;
  })
  .then(function(){
    console.log('Granting privileges!');
    return knex.raw('grant all privileges on database '+database+' to '+database+';');
  })
  .then(function(){
    console.log('Disconnecting from DB');
    return knex.destroy();
  })
  .then(function(){
    knex = require('knex')(knexConfig.test);
    console.log('Migrating latest to test');
    return knex.migrate.latest({env: 'test'});
  })
  .then(function(){
    console.log('Seeding test');
    return knex.seed.run({env: 'test'});
  })
  .then(function(){
    console.log('Migration and seeding complete');
  })
  .catch(function(err){
    console.error('Error when creating database. ', err);
  })
  .finally(function(){
    console.log('Done!');
    knex.destroy();
  });
