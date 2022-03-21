import test from 'ava';
import request from 'supertest';
import app from '../../server';
import Account from '../account';
import { connectDB, dropDB } from '../../util/test-helpers';

// Initial accounts added into test db
const accounts = [
  new Account({ type: 'personal' }),
  new Account({ type: 'business', name: 'Cool Co.' }),
];

test.beforeEach('connect and add two account entries', t => {
  connectDB(t, () => {
    Account.create(accounts, err => {
      if (err) t.fail('Unable to create accounts');
    });
  });
});

test.afterEach.always(t => {
  dropDB(t);
});

test.serial('Should correctly give number of Accounts', async t => {
  t.plan(2);

  const res = await request(app)
    .get('/api/accounts')
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.deepEqual(accounts.length, res.body.accounts.length);
});

test.serial('Should send correct data when queried against an id', async t => {
  t.plan(2);

  const account = new Account({ 'type': 'business', name: 'Cool Co' });
  account.save();

  const res = await request(app)
    .get(`/api/accounts/${account._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);
  t.is(res.body.account.name, account.name);
});

test.serial('Should correctly add a account', async t => {
  t.plan(2);

  const res = await request(app)
    .post('/api/accounts')
    .send({ account: { 'type': 'Business', name: 'Cool Co' } })
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const savedAccount = await Account.findOne({ _id: res.body.account._id }).exec();
  t.is(savedAccount.name, 'Cool Co');
});

test.serial('Should correctly delete a account', async t => {
  t.plan(2);

  const account = new Account({ 'type': 'business', 'name': 'Cool Co' });
  account.save();

  const res = await request(app)
    .delete(`/api/accounts/${account._id}`)
    .set('Accept', 'application/json');

  t.is(res.status, 200);

  const queriedAccount = await Account.findOne({ _id: account._id }).exec();
  t.is(queriedAccount, null);
});

