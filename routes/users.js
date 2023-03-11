/* const { Router } = require('express');
const router = Router()
const admin = require('../firebase/firestore')

router.get('/users', async (req, res) => {
    let users = []
    const listAllUsers = (nextPageToken) => {
        // List batch of users, 1000 at a time.
        admin.auth()
            .listUsers(1000, nextPageToken)
            .then((listUsersResult) => {
                console.log('users');
                listUsersResult.users.forEach((userRecord) => {
                    //console.log('user', userRecord.toJSON());
                    let dataUser = userRecord.toJSON()
                    users.push({ email: dataUser.email, uid: dataUser.uid, creado: new Date(dataUser.metadata.creationTime), ultimo: new Date(dataUser.metadata.lastSignInTime), disabled: dataUser.disabled })
                });
                res.send(users)
                if (listUsersResult.pageToken) {
                    // List next batch of users.
                    listAllUsers(listUsersResult.pageToken);
                }
            })
            .catch((error) => {
                console.log('Error listing users:', error);
            });
    };
    listAllUsers()
})

router.put('/updatedisabled/:uid', async (req, res) => {
    let uid = req.params.uid;
    let disabledp = req.body.disabled
    console.log(disabledp);
    admin.auth().updateUser(uid, {
        disabled: disabledp
    })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            //console.log('Successfully updated user', userRecord.toJSON());
            res.send(userRecord.toJSON())
        })
        .catch((error) => {
            console.log('Error updating user:', error);
        });

})
router.put('/updateuser/:uid', async (req, res) => {
    let uid = req.params.uid;
    let emailp = req.body.email
    let passwordp = req.body.password
    let disabledp = req.body.disabled

    admin.auth().updateUser(uid, {
        disabled: disabledp,
        email: emailp,
        password: passwordp
    })
        .then((userRecord) => {
            // See the UserRecord reference doc for the contents of userRecord.
            //console.log('Successfully updated user', userRecord.toJSON());
            res.send(userRecord.toJSON())
        })
        .catch((error) => {
            console.log('Error updating user:', error);
        });

})

router.delete('/deleteuser/:uid', async (req, res) => {
    let uid = req.params.uid
    try {
        const delUser = await admin.auth().deleteUser(uid)
        res.send(delUser)
    }
    catch (e) {
        console.log(e);
    }
})
router.post('/createuser', async (req, res) => {
    //let uid = 'mQHEaMKxT0fT64apgvHvHDIZecv1'
    let emailp = req.body.email
    let passwordp = req.body.password
    try {
        const newUser = await admin.auth().createUser({
            email: emailp,
            password: passwordp,
        })
        console.log(newUser);
        res.send(newUser)
    }
    catch (e) {
        console.log(e);
    }


})
router.get('/user/:uid', async (req, res) => {
    let uid = req.params.uid
    try {
        const user = await admin.auth().getUser(uid)
        console.log(user);
        res.send(user)
    }
    catch (e) {
        console.log(e);
    }
})


module.exports = router */
const { Router } = require('express');

const router = Router()
const admin = require('../firebase/firestore')
    //const db = admin.firestore()
//
    //const pgdb = require('../pg/conpgtaberna');
    //const pgp = require('pg-promise')({
    //    /* initialization options */
    //    capSQL: true // capitalize all generated SQL
    //});
const listAllUsers = async (nextPageToken) => {
    // List batch of users, 1000 at a time.
    let users = []
    try {
        let listUsersResult = await admin.auth().listUsers(1000, nextPageToken)
        console.log(listUsersResult);
        listUsersResult.users.forEach((userRecord) => {
            //console.log('user', userRecord.toJSON());
            let dataUser = userRecord.toJSON()
            users.push({ email: dataUser.email, uid: dataUser.uid, creado: new Date(dataUser.metadata.creationTime), ultimo: new Date(dataUser.metadata.lastSignInTime), disabled: dataUser.disabled })

        });
        if (listUsersResult.pageToken) {
            // List next batch of users.
            listAllUsers(listUsersResult.pageToken);
        }
        if (users.length > 0) return users

    } catch (error) {
        return false

    }

    /* .then((listUsersResult) => {
        listUsersResult.users.forEach((userRecord) => {
            //console.log('user', userRecord.toJSON());
            let dataUser = userRecord.toJSON()
            users.push({ email: dataUser.email, uid: dataUser.uid, creado: new Date(dataUser.metadata.creationTime), ultimo: new Date(dataUser.metadata.lastSignInTime), disabled: dataUser.disabled })
        });
        console.log(users);
        if(users.length>0) return users
        if (listUsersResult.pageToken) {
            // List next batch of users.
            listAllUsers(listUsersResult.pageToken);
        }
    })
    .catch((error) => {
        console.log('Error listing users:', error);
    }); */
};
router.get('/users', async (req, res) => {
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    if (req.isAuthenticated()) {
        const users = await listAllUsers()
        if (!users) {
            res.send({ res: 'No USERS' })
        }
        else {
            res.send(users)
        }
    }
    else if (idToken != null || idToken != undefined) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token VALIDO' })
        else {
            const users = await listAllUsers()
            if (!users) {
                res.send({ res: 'No SE TIENE ACCESSO' })
            }
            else {
                res.send(users)
            }
        }
    }
    else {
        res.send({ res: 'No hay Token' })
    }

})

router.put('/updatedisabled/:uid', async (req, res) => {
    let uid = req.params.uid;
    let disabledp = req.body.disabled
    //console.log(req.headers);
    //console.log(req.body);
    let idToken = req.headers.token
    let uidheader = req.headers.uid

    if (req.isAuthenticated()) {
        admin.auth().updateUser(uid, {
            disabled: disabledp
        })
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                //console.log('Successfully updated user', userRecord.toJSON());
                res.send(userRecord.toJSON())
            })
            .catch((error) => {
                console.log('Error updating user:', error);

            });

    }
    else if (idToken != undefined || idToken != null) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token valido' })
        else {
            admin.auth().updateUser(uid, { disabled: disabledp })
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    //console.log('Successfully updated user', userRecord.toJSON());
                    res.send(userRecord.toJSON())
                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    res.send({ res: 'No actualizado' })
                });
        }
    }
    else {
        res.send('NO response')
    }
})
router.put('/updateuser/:uid', async (req, res) => {
    let uid = req.params.uid;
    let emailp = req.body.email
    let passwordp = req.body.password
    let disabledp = req.body.disabled
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    console.log(uidheader);
    if (!req.isAuthenticated()) {
        // res.send({res:'No autenticado'}.toJSON())
    }
    if (req.isAuthenticated()) {
        admin.auth().updateUser(uid, {
            disabled: disabledp,
            email: emailp,
            password: passwordp
        })
            .then((userRecord) => {
                // See the UserRecord reference doc for the contents of userRecord.
                //console.log('Successfully updated user', userRecord.toJSON());
                res.send(userRecord.toJSON())
            })
            .catch((error) => {
                console.log('Error updating user:', error);
            });
    }
    else if (idToken != null || idToken != undefined) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token' })
        else {
            admin.auth().updateUser(uid, {
                disabled: disabledp,
                email: emailp,
                password: passwordp
            })
                .then((userRecord) => {
                    // See the UserRecord reference doc for the contents of userRecord.
                    //console.log('Successfully updated user', userRecord.toJSON());
                    res.send(userRecord.toJSON())
                })
                .catch((error) => {
                    console.log('Error updating user:', error);
                    res.send({ res: 'No actualizado' })
                });
        }
    }
    else {
        res.send({ res: 'Error' })
    }

})
async function verify(idToken, uidheader) {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        console.log(decodedToken, 149);
        if (decodedToken.uid == uidheader) return true
        else return false
    } catch (error) {
        return false
    }
}

router.delete('/deleteuser/:uid', async (req, res) => {
    let uid = req.params.uid
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    if (req.isAuthenticated()) {
        try {
            const delUser = await admin.auth().deleteUser(uid)
            //res.send(delUser)
            res.send({ res: 'Deleted user' })
        }
        catch (e) {
            console.log(e);
            res.send({ res: 'No autenticado' })
        }

    } else if (idToken != null || idToken != undefined) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token valido' })
        else {
            try {
                const delUser = await admin.auth().deleteUser(uid)
                //res.send(delUser)
                res.send({ res: 'Deleted user' })
            }
            catch (e) {
                console.log(e);
                res.send({ res: 'No deleted' })
            }
        }

    }
    else {
        res.send({ res: 'No valid token' })
    }

})
router.post('/createuser', async (req, res) => {
    //let uid = 'mQHEaMKxT0fT64apgvHvHDIZecv1'
    let emailp = req.body.email
    let passwordp = req.body.password

    let idToken = req.headers.token
    let uidheader = req.headers.uid
    if (req.isAuthenticated()) {
        try {
            const newUser = await admin.auth().createUser({
                email: emailp,
                password: passwordp,
            })
            console.log(newUser);
            res.send(newUser)
        }
        catch (e) {
            console.log(e);
            res.send({ res: 'No autenticado' })
        }
    } else if (idToken != null || idToken != undefined) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token' })
        else {
            try {
                const newUser = await admin.auth().createUser({
                    email: emailp,
                    password: passwordp,
                })
                console.log(newUser);
                res.send(newUser)
            }
            catch (e) {
                console.log(e);
                res.send({ res: 'No token good' })
            }
        }
    } else {
        res.send({ res: 'No token' })
    }


})
router.get('/user/:uid', async (req, res) => {
    let uid = req.params.uid
    let idToken = req.headers.token
    let uidheader = req.headers.uid
    if (req.isAuthenticated()) {

        try {
            const user = await admin.auth().getUser(uid)
            console.log(user);
            res.send(user)
        }
        catch (e) {
            console.log(e);
            res.send({ res: 'NO autenticado' })
        }

    } else if (idToken != null || idToken != undefined) {
        const verifycation = await verify(idToken, uidheader)
        console.log(verifycation);
        if (!verifycation) res.send({ res: 'No token' })
        else {
            try {
                const user = await admin.auth().getUser(uid)
                console.log(user);
                res.send(user)
            }
            catch (e) {
                console.log(e);
                res.send({ res: 'NO UID corrcecto' })
            }
        }
    }
    else {
        res.send({ res: 'NO Token' })
    }

})
const { execute } = require('@getvim/execute');
const path = require('path');
async function getRestart(server,pkey){
    try {
        let key=path.join(__dirname,pkey)
        //const res=await execute(`ssh -i ${key} pi@tabernasaid.duckdns.org 'touch  hola'`)
        const res=await execute(`ssh -i ${key} pi@${server} 'sudo service  postgresql restart;ls;'`);
        console.log(res);
        return res 
        
    
    } catch (error) {
        console.log(error);
        return error
    }
    
}

router.get('/restartpg/:server/:pkey', async(req, res)=>{
    let serverR=req.params.server
    let pkey=req.params.pkey
    let respuesta = await getRestart(serverR,pkey)
    res.send(respuesta)
}
)



module.exports = router