import firebase from './firebase';
import { clearAll } from './test';
import {
  createAccount,
  updateEmail,
} from './accounts';

afterEach(async () => {
  jest.clearAllMocks();
  await clearAll();
});

describe('createAccount', () => {
  it('rejects empty name.', async () => {
    await expect(
      () => createAccount({
      })(firebase, 'user01'),
    ).rejects.toThrow('name: ');

    await expect(
      () => createAccount({
        name: null,
      })(firebase, 'user01'),
    ).rejects.toThrow('name: ');

    await expect(
      () => createAccount({
        name: '',
      })(firebase, 'user01'),
    ).rejects.toThrow('name: ');

    await expect(
      () => createAccount({
        name: ' ',
      })(firebase, 'user01'),
    ).rejects.toThrow('name:  ');

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(0);

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(0);
  });

  it('accept name only.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
    })(firebase, 'user01');
    await expect(id).toBeDefined();

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(1);
    expect(accounts.docs[0].data()).toMatchObject({
      name: 'User 02',
      valid: true,
      admin: false,
      tester: false,
      createdBy: 'user01',
      updatedBy: 'user01',
    });

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).not.toBeDefined();
  });

  it('trim name.', async () => {
    const { id: id1 } = await createAccount({
      name: ' User 02 ',
    })(firebase, 'user01');
    expect(id1).toBeDefined();

    const { id: id2 } = await createAccount({
      name: ' User 03 ',
      email: null,
    })(firebase, 'user02');
    expect(id2).toBeDefined();

    const { id: id3 } = await createAccount({
      name: ' User 04 ',
      email: null,
    })(firebase, 'user03');
    expect(id3).toBeDefined();

    const { id: id4 } = await createAccount({
      name: ' User 05 ',
      email: null,
    })(firebase, 'user04');
    expect(id4).toBeDefined();

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').orderBy('name', 'asc').get();
    expect(accounts.size).toEqual(4);
    expect(accounts.docs.map((doc) => doc.data())).toMatchObject([
      {
        name: 'User 02',
        valid: true,
        admin: false,
        tester: false,
        createdBy: 'user01',
        updatedBy: 'user01',
      },
      {
        name: 'User 03',
        valid: true,
        admin: false,
        tester: false,
        createdBy: 'user02',
        updatedBy: 'user02',
      },
      {
        name: 'User 04',
        valid: true,
        admin: false,
        tester: false,
        createdBy: 'user03',
        updatedBy: 'user03',
      },
      {
        name: 'User 05',
        valid: true,
        admin: false,
        tester: false,
        createdBy: 'user04',
        updatedBy: 'user04',
      },
    ]);

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(4);
    expect(userList.users[0].email).not.toBeDefined();
    expect(userList.users[1].email).not.toBeDefined();
    expect(userList.users[2].email).not.toBeDefined();
    expect(userList.users[3].email).not.toBeDefined();
  });

  it('rejects invalid email.', async () => {
    await expect(
      () => createAccount({
        name: 'User 02',
        email: 'example',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: example');

    await expect(
      () => createAccount({
        name: 'User 02',
        email: 'test@example',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: test@example');

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(0);

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(0);
  });

  it('rejects used email.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
      email: 'test@example.com',
    })(firebase, 'user01');

    await expect(
      () => createAccount({
        name: 'User 03',
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: test@example.com');

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(1);
    expect(accounts.docs[0].id).toEqual(id);

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].uid).toEqual(id);
  });

  it('accept name and email.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
      email: 'test@example.com',
    })(firebase, 'user01');
    await expect(id).toBeDefined();

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(1);
    expect(accounts.docs[0].data()).toMatchObject({
      name: 'User 02',
      valid: true,
      admin: false,
      tester: false,
      createdBy: 'user01',
      updatedBy: 'user01',
    });

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('test@example.com');
  });

  it('accept set admin flag.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
      email: 'test@example.com',
      admin: true,
    })(firebase, 'user01');
    await expect(id).toBeDefined();

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(1);
    expect(accounts.docs[0].data()).toMatchObject({
      name: 'User 02',
      valid: true,
      admin: true,
      tester: false,
      createdBy: 'user01',
      updatedBy: 'user01',
    });

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('test@example.com');
  });

  it('accept set tester flag.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
      email: 'test@example.com',
      tester: true,
    })(firebase, 'user01');
    await expect(id).toBeDefined();

    const db = firebase.firestore();
    const auth = firebase.auth();

    const accounts = await db.collection('accounts').get();
    expect(accounts.size).toEqual(1);
    expect(accounts.docs[0].data()).toMatchObject({
      name: 'User 02',
      valid: true,
      admin: false,
      tester: true,
      createdBy: 'user01',
      updatedBy: 'user01',
    });

    const userList = await auth.listUsers();
    expect(userList.users).toHaveLength(1);
    expect(userList.users[0].email).toEqual('test@example.com');
  });
});

describe('updateEmail', () => {
  it('rejects empty id.', async () => {
    await expect(
      () => updateEmail({
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('id: undefined');

    await expect(
      () => updateEmail({
        id: null,
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('id: null');

    await expect(
      () => updateEmail({
        id: '',
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('id: ');

    await expect(
      () => updateEmail({
        id: ' ',
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('id:  ');
  });

  it('rejects empty email.', async () => {
    await expect(
      () => updateEmail({
        id: 'user01',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: undefined');

    await expect(
      () => updateEmail({
        id: 'user01',
        email: null,
      })(firebase, 'user01'),
    ).rejects.toThrow('email: null');

    await expect(
      () => updateEmail({
        id: 'user01',
        email: '',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: ');

    await expect(
      () => updateEmail({
        id: 'user01',
        email: ' ',
      })(firebase, 'user01'),
    ).rejects.toThrow('email:  ');
  });

  it('rejects id without doc.', async () => {
    await expect(
      () => updateEmail({
        id: 'user01',
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('exists: false, id: user01');
  });

  it('rejects id without registered account.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
    })(firebase, 'user01');

    const auth = firebase.auth();
    await auth.deleteUser(id);

    await expect(
      () => updateEmail({
        id,
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow();
  });

  it('rejects email used.', async () => {
    await createAccount({
      name: 'User 02',
      email: 'test@example.com',
    })(firebase, 'user01');

    const { id } = await createAccount({
      name: 'User 03',
    })(firebase, 'user01');

    await expect(
      () => updateEmail({
        id,
        email: 'test@example.com',
      })(firebase, 'user01'),
    ).rejects.toThrow('email: test@example.com is used');
  });

  it('accept valid id and email.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
    })(firebase, 'user01');

    await updateEmail({
      id,
      email: 'test@example.com',
    })(firebase, 'user01');

    const db = firebase.firestore();
    const auth = firebase.auth();

    const account = await db.collection('accounts').doc(id).get();
    expect(account.get('email')).toEqual('test@example.com');

    const user = await auth.getUser(id);
    expect(user.email).toEqual('test@example.com');
  });

  it('accept current email.', async () => {
    const { id } = await createAccount({
      name: 'User 02',
      email: 'test@example.com',
    })(firebase, 'user01');

    await updateEmail({
      id,
      email: 'test@example.com',
    })(firebase, 'user01');

    const db = firebase.firestore();
    const auth = firebase.auth();

    const account = await db.collection('accounts').doc(id).get();
    expect(account.get('email')).toEqual('test@example.com');

    const user = await auth.getUser(id);
    expect(user.email).toEqual('test@example.com');
  });
});
